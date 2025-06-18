// src/containers/attachments/index.tsx
import { appRoutes } from "@/shared/constants/routes";
import { formatDate } from "@/shared/utils/dateFormatter";
import { motion } from "framer-motion";
import { FileCheck, FileText, Globe, Loader2, Shield } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { GlobalSelectors } from "../global/selectors";
import PurchaseModal from "./PurchaseModal";
import { attachmentsSelectors } from "./selectors";
import { attachmentsActions } from "./slice";

const iconMap: Record<string, any> = {
  "Certificate of Authenticity": Shield,
  "Appraisal Report": FileCheck,
  "Origin Documentation": Globe,
  "Insurance Documentation": FileText,
};

const ProofOfReserveAttachments = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);

  const attachments = useSelector(attachmentsSelectors.attachments);
  const isLoading = useSelector(attachmentsSelectors.isFirstLoading);
  const authData = useSelector(GlobalSelectors.authData);
  const tokenCodes = useSelector(GlobalSelectors.tokens);

  useEffect(() => {
    if (tokenCodes && tokenCodes[0]) {
      dispatch(
        attachmentsActions.fetchAttachmentsStart({
          page: 1,
          token: tokenCodes[0],
        })
      );
    }
  }, [dispatch, tokenCodes, authData]);

  const handleDocumentClick = (id: string) => {
    navigate(`${appRoutes.attachmentsDetail.name}${id}`);
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-obsidian-500 via-obsidian-400 to-obsidian-500 py-16 px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="luxury-heading text-luxury-gold-500 text-xl mb-4">
              Documentation & Verification
            </h1>
            <h2 className="font-playfair text-5xl text-white mb-6">
              Complete Transparency
            </h2>
            <p className="text-pearl-200 text-lg max-w-2xl mx-auto">
              Every document has been verified and stored immutably on the
              blockchain, ensuring complete transparency and authenticity for
              our investors.
            </p>
          </motion.div>

          {/* Documents Grid */}
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="w-8 h-8 text-luxury-gold-500 animate-spin" />
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8 mb-16">
              {attachments.map((attachment, index) => {
                const Icon = iconMap[attachment.name || ""] || FileText;
                return (
                  <motion.div
                    key={attachment.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => handleDocumentClick(attachment.id || "")}
                    className="group cursor-pointer"
                  >
                    <div
                      className="bg-obsidian-400/30 backdrop-blur-sm rounded-xl p-8 
                                  border border-luxury-gold-500/10 hover:border-luxury-gold-500/30 
                                  transition-all duration-300 hover:transform hover:-translate-y-1"
                    >
                      <div className="flex items-start gap-6">
                        <div className="p-4 bg-luxury-gold-500/10 rounded-lg group-hover:bg-luxury-gold-500/20 transition-colors">
                          <Icon className="w-8 h-8 text-luxury-gold-500" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-medium text-white mb-1">
                            {attachment.name}
                          </h3>
                          <p className="text-luxury-gold-500 text-sm mb-3">
                            {attachment.files?.length || 0} file(s)
                          </p>
                          <p className="text-pearl-300 text-sm mb-4">
                            {attachment.description || "Official documentation"}
                          </p>
                          <div className="flex items-center justify-between text-xs text-pearl-400">
                            <span>
                              {formatDate(attachment.created_at || "")}
                            </span>
                            <span className="text-luxury-gold-500 group-hover:text-luxury-gold-400 transition-colors">
                              View Document →
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Purchase Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center"
          >
            <div
              className="bg-gradient-to-r from-luxury-gold-500/10 via-luxury-gold-500/5 to-luxury-gold-500/10 
                          rounded-2xl p-12 border border-luxury-gold-500/20"
            >
              <h3 className="font-playfair text-3xl text-white mb-4">
                Ready to Invest?
              </h3>
              <p className="text-pearl-200 mb-8 max-w-lg mx-auto">
                Join an exclusive group of collectors owning a piece of this
                magnificent creation.
              </p>
              <motion.button
                onClick={() => setShowPurchaseModal(true)}
                className="bg-luxury-gold-500 text-obsidian-500 px-12 py-4 rounded-lg text-lg font-medium 
                         hover:bg-luxury-gold-400 transition-all duration-300 transform hover:scale-105
                         shadow-lg hover:shadow-glow"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Purchase Fraction
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Purchase Modal */}
      <PurchaseModal
        isOpen={showPurchaseModal}
        onClose={() => setShowPurchaseModal(false)}
      />
    </>
  );
};

export default ProofOfReserveAttachments;
