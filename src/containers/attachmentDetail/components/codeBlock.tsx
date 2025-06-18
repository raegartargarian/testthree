import { getLanguageFromFileName } from "@/shared/utils/fileHelpers";
import {
  Check,
  ChevronDown,
  ChevronRight,
  Copy,
  FolderClosed,
  FolderOpen,
} from "lucide-react";
import React, { useState } from "react";
import { FileIcon, defaultStyles } from "react-file-icon";

// Types
export interface FileStructure {
  name: string;
  type: "file" | "folder";
  language?: string;
  code?: string;
  children?: FileStructure[];
}

interface CodeBlockProps {
  code: string;
  language?: string;
  fileName: string;
}

interface FileExplorerProps {
  structure: FileStructure[];
  onFileSelect: (file: FileStructure) => void;
  zipDownloadUrl?: string;
}

// Components
const CodeBlock: React.FC<CodeBlockProps> = ({ code, fileName }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative bg-black rounded-lmid h-[500px] overflow-hidden border border-gray-800">
      <div className="flex justify-between items-center px-6 py-3 border-b border-gray-800">
        <span className="text-gray-300 font-light">{fileName}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
          <span className="font-light">{copied ? "Copied!" : "Copy"}</span>
        </button>
      </div>
      <pre className="p-6 h-[calc(100%-52px)] overflow-auto">
        <code className="text-gray-300 font-mono whitespace-pre">{code}</code>
      </pre>
    </div>
  );
};

const CustomFileIcon: React.FC<{ fileName: string }> = ({ fileName }) => {
  const extension = fileName.split(".").pop()?.toLowerCase() || "";

  // Get the appropriate style for this extension, fallback to default
  const fileStyle =
    defaultStyles[extension as keyof typeof defaultStyles] ||
    defaultStyles.sitx;

  return (
    <div className="w-5 h-5">
      <FileIcon extension={extension} {...fileStyle} />
    </div>
  );
};

export const FileExplorer: React.FC<FileExplorerProps> = ({
  structure,
  onFileSelect,
}) => {
  const [expanded, setExpanded] = useState<string[]>([]);
  const [selectedFilePath, setSelectedFilePath] = useState<string | null>(null);

  const toggleFolder = (path: string) => {
    if (expanded.includes(path)) {
      setExpanded(
        expanded.filter((p) => p !== path && !p.startsWith(`${path}-`))
      );
    } else {
      setExpanded([...expanded, path]);
    }
  };

  // This function builds a unique and consistent path for each item
  const buildPath = (
    _item: FileStructure,
    parentPath: string,
    index: number
  ): string => {
    return parentPath ? `${parentPath}-${index}` : `${index}`;
  };

  const renderItem = (item: FileStructure, path: string, depth: number = 0) => {
    const isExpanded = expanded.includes(path);
    const hasChildren = item.children && item.children.length > 0;
    const paddingLeft = `${depth * 16 + 12}px`;
    const isSelected = selectedFilePath === path;

    const handleClick = () => {
      if (item.type === "folder") {
        toggleFolder(path);
      } else {
        setSelectedFilePath(path);
        onFileSelect(item);
      }
    };

    return (
      <div key={path}>
        <div
          className={`flex items-center py-2 hover:bg-gray-800/50 cursor-pointer transition-colors ${
            isSelected ? "bg-gray-800/80" : ""
          }`}
          style={{ paddingLeft }}
          onClick={handleClick}
        >
          {item.type === "folder" && (
            <span className="mr-1 text-gray-300">
              {isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </span>
          )}

          {item.type === "folder" ? (
            isExpanded ? (
              <FolderOpen className="w-4 h-4 text-gray-300" />
            ) : (
              <FolderClosed className="w-4 h-4 text-gray-300" />
            )
          ) : (
            <div className="mr-1">
              <CustomFileIcon fileName={item.name} />
            </div>
          )}

          <span className="ml-2 text-sm text-gray-300 font-light">
            {item.name}
          </span>
        </div>
        {isExpanded && hasChildren && (
          <div>
            {item.children!.map((child, index) => {
              const childPath = buildPath(child, path, index);
              return renderItem(child, childPath, depth + 1);
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="border border-gray-800 rounded-lmid overflow-hidden bg-black">
      <div className="max-h-[600px] overflow-y-auto">
        {structure.map((item, index) => {
          const rootPath = `${index}`;
          return renderItem(item, rootPath);
        })}
      </div>
    </div>
  );
};

export const GitHubExplorer: React.FC<{
  fileStructure: FileStructure[];
}> = ({ fileStructure }) => {
  const [selectedFile, setSelectedFile] = useState<FileStructure | null>(null);

  const handleFileSelect = (file: FileStructure) => {
    setSelectedFile(file);
  };

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="md:order-2">
        <FileExplorer
          structure={fileStructure || []}
          onFileSelect={handleFileSelect}
        />
      </div>
      <div className="md:order-1">
        {selectedFile && selectedFile.code ? (
          <CodeBlock
            code={selectedFile.code}
            language={
              selectedFile.language ||
              getLanguageFromFileName(selectedFile.name)
            }
            fileName={selectedFile.name}
          />
        ) : (
          <div className="flex items-center justify-center h-[500px] bg-black rounded-lmid border border-gray-800">
            <p className="text-gray-300 font-light">
              Select a file to view its contents
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default {
  FileExplorer,
  GitHubExplorer,
  CodeBlock,
};
