// src/containers/attachments/PurchaseModal.tsx
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, Wallet, X } from "lucide-react";
import { useState } from "react";

interface PurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PurchaseModal = ({ isOpen, onClose }: PurchaseModalProps) => {
  const [quantity, setQuantity] = useState(1);
  const [step, setStep] = useState<
    "select" | "confirm" | "processing" | "success"
  >("select");

  const pricePerFraction = 50000;
  const totalPrice = quantity * pricePerFraction;
  const maxQuantity = 37; // Available fractions

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(
      1,
      Math.min(maxQuantity, parseInt(e.target.value) || 1)
    );
    setQuantity(value);
  };

  const handlePurchase = async () => {
    setStep("processing");
    // Simulate transaction
    setTimeout(() => {
      setStep("success");
    }, 3000);
  };

  const resetModal = () => {
    setStep("select");
    setQuantity(1);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-obsidian-500/90 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
          >
            <div
              className="bg-obsidian-400 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden 
                          border border-luxury-gold-500/20 shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-8 border-b border-luxury-gold-500/10">
                <h2 className="font-playfair text-3xl text-white">
                  Purchase Fractions
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-luxury-gold-500/10 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-pearl-400" />
                </button>
              </div>

              {/* Content */}
              <div className="p-8">
                {step === "select" && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <div className="mb-8">
                      <label className="block text-pearl-300 mb-2">
                        Number of Fractions
                      </label>
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="w-12 h-12 rounded-lg bg-obsidian-300 hover:bg-obsidian-200 
                                   text-white transition-colors flex items-center justify-center"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          value={quantity}
                          onChange={handleQuantityChange}
                          className="w-24 h-12 bg-obsidian-300 rounded-lg text-center text-white 
                                   border border-luxury-gold-500/20 focus:border-luxury-gold-500/50
                                   focus:outline-none"
                          min="1"
                          max={maxQuantity}
                        />
                        <button
                          onClick={() =>
                            setQuantity(Math.min(maxQuantity, quantity + 1))
                          }
                          className="w-12 h-12 rounded-lg bg-obsidian-300 hover:bg-obsidian-200 
                                   text-white transition-colors flex items-center justify-center"
                        >
                          +
                        </button>
                        <span className="text-pearl-400 ml-4">
                          Max: {maxQuantity} fractions available
                        </span>
                      </div>
                    </div>

                    <div className="bg-obsidian-300/30 rounded-xl p-6 mb-8">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-pearl-300">
                          Price per fraction
                        </span>
                        <span className="text-white">
                          ${pricePerFraction.toLocaleString()} USDC
                        </span>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-pearl-300">Quantity</span>
                        <span className="text-white">{quantity}</span>
                      </div>
                      <div className="border-t border-luxury-gold-500/20 pt-2 mt-2">
                        <div className="flex justify-between items-center">
                          <span className="text-luxury-gold-500 font-medium">
                            Total
                          </span>
                          <span className="text-2xl text-white font-light">
                            ${totalPrice.toLocaleString()} USDC
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <button
                        onClick={() => setStep("confirm")}
                        className="flex-1 bg-luxury-gold-500 text-obsidian-500 py-4 rounded-lg 
                                 font-medium hover:bg-luxury-gold-400 transition-colors 
                                 flex items-center justify-center gap-2"
                      >
                        Continue
                        <ArrowRight className="w-5 h-5" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {step === "confirm" && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <div className="text-center mb-8">
                      <Wallet className="w-16 h-16 text-luxury-gold-500 mx-auto mb-4" />
                      <h3 className="text-2xl text-white mb-2">
                        Confirm Purchase
                      </h3>
                      <p className="text-pearl-300">
                        You are about to purchase {quantity} fraction
                        {quantity > 1 ? "s" : ""}
                        for ${totalPrice.toLocaleString()} USDC
                      </p>
                    </div>

                    <div className="bg-obsidian-300/30 rounded-xl p-6 mb-8">
                      <p className="text-sm text-pearl-300 mb-4">
                        By proceeding, you acknowledge that:
                      </p>
                      <ul className="space-y-2 text-sm text-pearl-400">
                        <li className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-luxury-gold-500 mt-0.5" />
                          <span>
                            This is a mock transaction for demonstration
                            purposes
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-luxury-gold-500 mt-0.5" />
                          <span>
                            Smart contracts will be implemented in the next
                            phase
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-luxury-gold-500 mt-0.5" />
                          <span>
                            Your wallet must have sufficient USDC balance
                          </span>
                        </li>
                      </ul>
                    </div>

                    <div className="flex gap-4">
                      <button
                        onClick={() => setStep("select")}
                        className="flex-1 bg-obsidian-300 text-white py-4 rounded-lg 
                                 font-medium hover:bg-obsidian-200 transition-colors"
                      >
                        Back
                      </button>
                      <button
                        onClick={handlePurchase}
                        className="flex-1 bg-luxury-gold-500 text-obsidian-500 py-4 rounded-lg 
                                 font-medium hover:bg-luxury-gold-400 transition-colors"
                      >
                        Confirm Purchase
                      </button>
                    </div>
                  </motion.div>
                )}

                {step === "processing" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12"
                  >
                    <div
                      className="w-20 h-20 border-4 border-luxury-gold-500/20 border-t-luxury-gold-500 
                                  rounded-full animate-spin mx-auto mb-6"
                    />
                    <h3 className="text-2xl text-white mb-2">
                      Processing Transaction
                    </h3>
                    <p className="text-pearl-300">
                      Please wait while we process your purchase...
                    </p>
                  </motion.div>
                )}

                {step === "success" && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", duration: 0.5 }}
                      className="w-20 h-20 bg-luxury-gold-500 rounded-full flex items-center 
                               justify-center mx-auto mb-6"
                    >
                      <Check className="w-10 h-10 text-obsidian-500" />
                    </motion.div>
                    <h3 className="text-2xl text-white mb-2">
                      Purchase Successful!
                    </h3>
                    <p className="text-pearl-300 mb-6">
                      You now own {quantity} fraction{quantity > 1 ? "s" : ""}{" "}
                      of the Pink Diamond Turtle
                    </p>
                    <button
                      onClick={resetModal}
                      className="bg-luxury-gold-500 text-obsidian-500 px-8 py-3 rounded-lg 
                               font-medium hover:bg-luxury-gold-400 transition-colors"
                    >
                      Close
                    </button>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default PurchaseModal;
