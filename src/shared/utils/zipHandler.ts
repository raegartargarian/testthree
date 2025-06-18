import { FileStructure } from "@/containers/attachmentDetail/components/codeBlock";
import JSZip from "jszip";
import { getLanguageFromFileName, isBinaryFile } from "./fileHelpers";

export interface ModelDocumentation {
  modelDetails: any;
  textFiles: Array<{ name: string; content: string }>;
}

export interface ProcessedZipContent {
  type: "code" | "model-documentation";
  content: FileStructure[] | ModelDocumentation;
}

function buildFileStructure(paths: string[]): FileStructure[] {
  // Sort paths to ensure folders come before their contents
  paths.sort();

  const root: FileStructure[] = [];
  const folderMap = new Map<string, FileStructure>();

  // First pass: create folder structure
  paths.forEach((path) => {
    // Skip .git folder and hidden files (except .gitignore)
    if (
      (path.includes("/.git/") ||
        path
          .split("/")
          .some((part) => part.startsWith(".") && part !== ".gitignore")) &&
      !path.endsWith(".gitignore")
    ) {
      return;
    }

    const parts = path.split("/");
    let currentLevel = root;
    let currentPath = "";

    // Skip empty parts that might cause empty folders
    const filteredParts = parts.filter((part) => part.trim() !== "");

    // Process each part of the path to build the folder structure
    for (let i = 0; i < filteredParts.length; i++) {
      const part = filteredParts[i];
      currentPath = currentPath ? `${currentPath}/${part}` : part;

      // If this is the last part and not ending with /, it's a file
      const isFile = i === filteredParts.length - 1 && !path.endsWith("/");

      if (isFile) {
        // Will add files in the second pass
        continue;
      }

      // Check if this folder already exists
      let folder = currentLevel.find(
        (item) => item.name === part && item.type === "folder"
      );

      if (!folder) {
        folder = {
          name: part,
          type: "folder",
          children: [],
        };
        currentLevel.push(folder);
        folderMap.set(currentPath, folder);
      }

      currentLevel = folder.children!;
    }
  });

  // Second pass: add files to the folder structure
  paths.forEach((path) => {
    // Skip directories and hidden files (except .gitignore)
    if (
      path.endsWith("/") ||
      (path
        .split("/")
        .some((part) => part.startsWith(".") && part !== ".gitignore") &&
        !path.endsWith(".gitignore"))
    ) {
      return;
    }

    const parts = path.split("/");
    const fileName = parts.pop()!;
    const parentPath = parts.join("/");

    // Find the parent folder
    let parentFolder: FileStructure[];
    if (parentPath === "") {
      parentFolder = root;
    } else {
      const parent = folderMap.get(parentPath);
      if (!parent) return; // Should not happen if structure is correct
      parentFolder = parent.children!;
    }

    // Add the file
    parentFolder.push({
      name: fileName,
      type: "file",
      // Code content will be added later
    });
  });

  // Remove empty folders
  const removeEmptyFolders = (folders: FileStructure[]): FileStructure[] => {
    return folders.filter((item) => {
      if (item.type === "folder" && item.children) {
        item.children = removeEmptyFolders(item.children);
        return item.children.length > 0;
      }
      return true;
    });
  };

  return removeEmptyFolders(root);
}

export async function processZipFile(
  zipData: ArrayBuffer
): Promise<ProcessedZipContent> {
  const zip = new JSZip();
  const contents = await zip.loadAsync(zipData);

  // Get all file paths
  const paths = Object.keys(contents.files);

  // Check if this is a model documentation zip by looking for model.json in the root only
  const hasModelJson = paths.some(
    (path) =>
      // Check if it's in the root (no slash except possibly at the end)
      (path.indexOf("/") === -1 || path.indexOf("/") === path.length - 1) &&
      (path === "model.json" || path === "model-details.json")
  );

  if (hasModelJson) {
    // Process as model documentation
    const modelDocumentation: ModelDocumentation = {
      modelDetails: null,
      textFiles: [],
    };

    for (const [path, file] of Object.entries(contents.files)) {
      if (file.dir) continue;

      if (path.endsWith(".json")) {
        const content = await file.async("text");
        try {
          modelDocumentation.modelDetails = JSON.parse(content);
        } catch (e) {
          console.error(`Failed to parse JSON file: ${path}`);
        }
      } else if (path.endsWith(".txt") || path.endsWith(".md")) {
        modelDocumentation.textFiles.push({
          name: path.split("/").pop() || "",
          content: await file.async("text"),
        });
      }
    }

    return {
      type: "model-documentation",
      content: modelDocumentation,
    };
  }

  // Process as a code repository

  // Handle GitHub zip specifics - GitHub adds a root folder with repo name
  // Check if all paths start with the same directory
  let commonPrefix = "";
  if (paths.length > 0) {
    // Get the first path segment (e.g., "repo-main/")
    const firstPath = paths[0];
    const firstSlashIndex = firstPath.indexOf("/");

    if (firstSlashIndex > 0) {
      const potentialPrefix = firstPath.substring(0, firstSlashIndex + 1);
      // Check if all paths start with this prefix
      if (paths.every((path) => path.startsWith(potentialPrefix))) {
        commonPrefix = potentialPrefix;
      }
    }
  }

  // Remove common prefix for cleaner structure
  const normalizedPaths = commonPrefix
    ? paths.map((path) => path.substring(commonPrefix.length))
    : paths;

  // Build initial structure based on normalized paths
  const structure = buildFileStructure(normalizedPaths);

  // Add file contents
  const processNode = async (node: FileStructure, basePath: string = "") => {
    const currentPath = basePath ? `${basePath}/${node.name}` : node.name;

    if (node.type === "file") {
      // Reconstruct the original path in the zip
      const originalPath = commonPrefix + currentPath;
      const file = contents.files[originalPath];

      if (file && !file.dir) {
        // Only load content for text files, skip binaries
        if (!isBinaryFile(node.name)) {
          try {
            node.code = await file.async("text");
            // Infer language from file extension for syntax highlighting
            node.language = getLanguageFromFileName(node.name);
          } catch (e: any) {
            console.error(`Failed to read file: ${originalPath}`);
            node.code = `Error reading file: ${e.message}`;
          }
        } else {
          node.code = "[Binary file not displayed]";
        }
      }
    } else if (node.children) {
      // If a folder, recursively process all children
      for (const child of node.children) {
        await processNode(child, currentPath);
      }
    }
  };

  // Process the entire structure
  for (const node of structure) {
    await processNode(node);
  }

  return {
    type: "code",
    content: structure,
  };
}
