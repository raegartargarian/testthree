// src/containers/attachmentDetail/index.tsx
import { formatDate } from "@/shared/utils/dateFormatter";
import {
  getIPFSIMGAddr,
  getIPFSIMGAddrPrivate,
} from "@/shared/utils/getIPFSAddrs";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  FileCheck,
  FileText,
  Globe,
  Loader2,
  Shield,
  ShoppingCart,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import PurchaseModal from "../attachments/PurchaseModal";
import { GlobalSelectors } from "../global/selectors";
import LuxuryPDFViewer from "./components/LuxuryPDFViewer";
import { attachmentDetailSelectors } from "./selectors";
import { attachmentDetailActions } from "./slice";

const iconMap: Record<string, any> = {
  "Certificate of Authenticity": Shield,
  "Appraisal Report": FileCheck,
  "Origin Documentation": Globe,
  "Insurance Documentation": FileText,
};

const AttachmentDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const attachment = useSelector(attachmentDetailSelectors.attachment);
  const isLoading = useSelector(attachmentDetailSelectors.isLoading);
  const authData = useSelector(GlobalSelectors.authData);

  useEffect(() => {
    if (id) {
      dispatch(attachmentDetailActions.fetchAttachmentDetailStart({ id }));
    }
  }, [dispatch, id, authData]);

  useEffect(() => {
    if (attachment?.files?.length && !selectedFile) {
      setSelectedFile(attachment.files[0].cid || "");
    }
  }, [attachment, selectedFile]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-obsidian-500 via-obsidian-400 to-obsidian-500 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-luxury-gold-500 animate-spin" />
      </div>
    );
  }

  if (!attachment) {
    return (
      <div className="min-h-screen bg-obsidian-500 flex items-center justify-center">
        <p className="text-white">Document not found</p>
      </div>
    );
  }

  const selectedFileData = attachment.files?.find(
    (f) => f.cid === selectedFile
  );
  const Icon = iconMap[attachment.name || ""] || FileText;

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-obsidian-500 via-obsidian-400 to-obsidian-500">
        {/* Header */}
        <div className="bg-obsidian-500/80 backdrop-blur-sm border-b border-luxury-gold-500/10 sticky top-0 z-30">
          <div className="max-w-7xl mx-auto px-8 py-6">
            <div className="flex items-center justify-between">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-pearl-300 hover:text-luxury-gold-500 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Documents</span>
              </button>
              <motion.button
                onClick={() => setShowPurchaseModal(true)}
                className="flex items-center gap-2 px-6 py-2 rounded-lg 
                         bg-luxury-gold-500 hover:bg-luxury-gold-400 transition-colors 
                         text-obsidian-500 font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ShoppingCart className="w-4 h-4" />
                Purchase Fraction
              </motion.button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-8 py-12">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Document Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1"
            >
              <div
                className="bg-obsidian-400/30 backdrop-blur-sm rounded-xl p-8 
                            border border-luxury-gold-500/10 sticky top-32"
              >
                <Icon className="w-12 h-12 text-luxury-gold-500 mb-4" />
                <h1 className="text-2xl font-medium text-white mb-2">
                  {attachment.name}
                </h1>
                <p className="text-luxury-gold-500 mb-4">
                  {attachment.files?.length || 0} Document
                  {(attachment.files?.length || 0) > 1 ? "s" : ""}
                </p>
                <p className="text-pearl-300 mb-6">
                  {attachment.description || "Official documentation"}
                </p>

                {/* File selector if multiple files */}
                {attachment.files && attachment.files.length > 1 && (
                  <div className="mb-6">
                    <h3 className="text-sm text-pearl-400 mb-2">
                      Select Document
                    </h3>
                    <div className="space-y-2">
                      {attachment.files.map((file) => (
                        <button
                          key={file.cid}
                          onClick={() => setSelectedFile(file.cid || "")}
                          className={`w-full text-left p-3 rounded-lg transition-colors ${
                            selectedFile === file.cid
                              ? "bg-luxury-gold-500/20 border border-luxury-gold-500"
                              : "bg-obsidian-300/30 border border-transparent hover:border-luxury-gold-500/30"
                          }`}
                        >
                          <p className="text-white text-sm">{file.filename}</p>
                          <p className="text-pearl-400 text-xs">
                            {file.size
                              ? `${(file.size / 1024 / 1024).toFixed(2)} MB`
                              : ""}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <h3 className="text-lg text-white font-medium">
                    Document Details
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2 text-pearl-300">
                      <span className="w-1.5 h-1.5 bg-luxury-gold-500 rounded-full mt-2" />
                      <span className="text-sm">
                        Created: {formatDate(attachment.created_at || "")}
                      </span>
                    </li>
                    <li className="flex items-start gap-2 text-pearl-300">
                      <span className="w-1.5 h-1.5 bg-luxury-gold-500 rounded-full mt-2" />
                      <span className="text-sm">
                        Status: {attachment.status?.replace(/_/g, " ")}
                      </span>
                    </li>
                    {attachment.tx_hash && (
                      <li className="flex items-start gap-2 text-pearl-300">
                        <span className="w-1.5 h-1.5 bg-luxury-gold-500 rounded-full mt-2" />
                        <span className="text-sm break-all">
                          TX: {attachment.tx_hash.slice(0, 10)}...
                        </span>
                      </li>
                    )}
                  </ul>
                </div>

                <div className="mt-8 pt-8 border-t border-luxury-gold-500/10">
                  <p className="text-sm text-pearl-400 mb-4">
                    This document has been verified and stored immutably on the
                    blockchain
                  </p>
                  <div className="flex items-center gap-2 text-xs text-luxury-gold-500">
                    <div className="w-2 h-2 bg-luxury-gold-500 rounded-full animate-pulse" />
                    Blockchain Verified
                  </div>
                </div>
              </div>
            </motion.div>

            {/* PDF Viewer */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-2"
            >
              <div
                className="bg-obsidian-400/30 backdrop-blur-sm rounded-xl 
                            border border-luxury-gold-500/10 overflow-hidden h-[800px]"
              >
                {selectedFileData && (
                  <LuxuryPDFViewer
                    fileUrl={
                      attachment.public_vault
                        ? getIPFSIMGAddr(selectedFileData.cid || "")
                        : getIPFSIMGAddrPrivate(selectedFileData.cid || "")
                    }
                    fileName={selectedFileData.filename || "Document"}
                    isPrivate={!attachment.public_vault}
                    attachment={attachment}
                  />
                )}
              </div>
            </motion.div>
          </div>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-16 text-center"
          >
            <div className="bg-gradient-to-r from-transparent via-luxury-gold-500/10 to-transparent p-12">
              <h3 className="text-3xl font-playfair text-white mb-4">
                Ready to Own a Piece of History?
              </h3>
              <p className="text-pearl-300 mb-8 max-w-2xl mx-auto">
                After reviewing our comprehensive documentation, take the next
                step towards owning a fraction of this extraordinary pink
                diamond masterpiece.
              </p>
              <motion.button
                onClick={() => setShowPurchaseModal(true)}
                className="bg-luxury-gold-500 text-obsidian-500 px-12 py-4 rounded-lg text-lg font-medium 
                         hover:bg-luxury-gold-400 transition-all duration-300 transform hover:scale-105
                         shadow-lg hover:shadow-glow"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Purchase Your Fraction Now
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>

      <PurchaseModal
        isOpen={showPurchaseModal}
        onClose={() => setShowPurchaseModal(false)}
      />
    </>
  );
};

export default AttachmentDetail;
