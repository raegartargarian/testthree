import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import React, { useEffect, useState } from "react";
import { FileIcon, defaultStyles } from "react-file-icon";

interface FilePreviewProps {
  fileUrl: string;
  mimeType: string;
  fileName: string;
  fileSize?: number;
}

const FilePreview: React.FC<FilePreviewProps> = ({
  fileUrl,
  mimeType,
  fileName,
  fileSize,
}) => {
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const extension = fileName.split(".").pop()?.toLowerCase() || "";
  const fileStyle =
    defaultStyles[extension as keyof typeof defaultStyles] ||
    defaultStyles.sitx;

  // Define which file types to display as text
  const textFileTypes = [
    "text/plain",
    "text/html",
    "text/css",
    "text/javascript",
    "application/json",
    "application/xml",
    "text/markdown",
    "application/javascript",
    "application/typescript",
  ];

  // Define which file types to display as images
  const imageFileTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/svg+xml",
  ];

  const isTextFile =
    textFileTypes.includes(mimeType) ||
    /\.(txt|md|js|jsx|ts|tsx|html|css|json|xml|yaml|yml)$/i.test(fileName);
  const isImageFile =
    imageFileTypes.includes(mimeType) ||
    /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(fileName);
  const isPDF =
    mimeType === "application/pdf" || fileName.toLowerCase().endsWith(".pdf");

  useEffect(() => {
    const fetchContent = async () => {
      if (!fileUrl) return;

      setLoading(true);
      setError(null);

      try {
        if (isTextFile) {
          const response = await fetch(fileUrl);
          if (!response.ok) {
            throw new Error(
              `Failed to fetch file: ${response.status} ${response.statusText}`
            );
          }
          const text = await response.text();
          setContent(text);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load file");
        console.error("Error loading file:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [fileUrl, isTextFile]);

  const handleDownload = () => {
    if (fileUrl) {
      const link = document.createElement("a");
      link.href = fileUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const formatFileSize = (size?: number): string => {
    if (!size) return "Unknown size";

    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header with file info and download button */}
      <div className="flex justify-between items-center p-4 border-b border-gray-800">
        <div className="flex items-center">
          <div className="w-8 h-8 mr-3">
            <FileIcon extension={extension} {...fileStyle} />
          </div>
          <div>
            <p className="font-medium text-white">{fileName}</p>
            <p className="text-xs text-gray-500">{formatFileSize(fileSize)}</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={handleDownload}>
          <Download className="w-4 h-4 mr-2" />
          Download
        </Button>
      </div>

      {/* File content preview */}
      <div className="flex-1 overflow-auto p-4 bg-gray-950">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-400"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 p-4">
            <p>Error loading file: {error}</p>
          </div>
        ) : (
          <>
            {isImageFile && (
              <div className="flex justify-center">
                <img
                  src={fileUrl}
                  alt={fileName}
                  className="max-w-full max-h-[80vh] object-contain"
                />
              </div>
            )}

            {isPDF && (
              <iframe
                src={fileUrl}
                className="w-full h-full min-h-[80vh]"
                title={fileName}
              />
            )}

            {isTextFile && content && (
              <pre className="whitespace-pre-wrap break-words text-gray-300 font-mono text-sm p-4 bg-gray-900 rounded-md">
                <code>{content}</code>
              </pre>
            )}

            {!isImageFile && !isPDF && !isTextFile && (
              <div className="flex flex-col items-center justify-center h-full">
                <div className="w-16 h-16 mb-4">
                  <FileIcon extension={extension} {...fileStyle} />
                </div>
                <p className="text-gray-400 mb-2">Preview not available</p>
                <Button onClick={handleDownload}>
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default FilePreview;
