// src/containers/attachmentDetail/components/LuxuryPDFViewer.tsx
import { LocalStorageKeys } from "@/shared/utils/localStorageHelpers";
import { motion } from "framer-motion";
import { AlertCircle, Download, Loader2 } from "lucide-react";
import { useState } from "react";

interface LuxuryPDFViewerProps {
  fileUrl: string;
  fileName: string;
  isPrivate: boolean;
  attachment: any;
}

const LuxuryPDFViewer: React.FC<LuxuryPDFViewerProps> = ({
  fileUrl,
  fileName,
  isPrivate,
  attachment,
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = async () => {
    try {
      const token = localStorage.getItem(LocalStorageKeys.jwtAccessKey);

      if (isPrivate && token) {
        const headers = {
          Authorization: `Bearer ${token.replace(/"/g, "")}`,
          "X-LedgerInfo": JSON.stringify({
            tx_hash: attachment.tx_hash,
            ledger: attachment.ledger,
          }),
        };

        const response = await fetch(fileUrl, { headers });
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
        window.open(fileUrl, "_blank");
      }
    } catch (err) {
      console.error("Download error:", err);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* PDF Header */}
      <div className="bg-obsidian-400/50 backdrop-blur-sm border-b border-luxury-gold-500/10 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-white font-medium">{fileName}</h3>
            <p className="text-pearl-400 text-sm">PDF Document</p>
          </div>
          <motion.button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 bg-luxury-gold-500 hover:bg-luxury-gold-400 
                     text-obsidian-500 rounded-lg font-medium transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Download className="w-4 h-4" />
            Download
          </motion.button>
        </div>
      </div>

      {/* PDF Viewer */}
      <div className="flex-1 relative bg-obsidian-300">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-obsidian-400/50 z-10">
            <Loader2 className="w-8 h-8 text-luxury-gold-500 animate-spin" />
          </div>
        )}

        {error ? (
          <div className="flex flex-col items-center justify-center h-full text-pearl-400">
            <AlertCircle className="w-12 h-12 mb-4 text-luxury-gold-500" />
            <p className="text-lg mb-2">Unable to load document</p>
            <p className="text-sm opacity-60 mb-4">{error}</p>
            <motion.button
              onClick={handleDownload}
              className="px-6 py-2 bg-luxury-gold-500 hover:bg-luxury-gold-400 
                       text-obsidian-500 rounded-lg font-medium transition-colors"
            >
              Download Instead
            </motion.button>
          </div>
        ) : (
          <iframe
            src={fileUrl}
            className="w-full h-full"
            onLoad={() => setLoading(false)}
            onError={() => {
              setError("Failed to load PDF. Please try downloading the file.");
              setLoading(false);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default LuxuryPDFViewer;
