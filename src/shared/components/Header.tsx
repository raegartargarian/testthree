// src/shared/components/Header.tsx
import { GlobalSelectors } from "@/containers/global/selectors";
import { globalActions } from "@/containers/global/slice";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, Wallet, X } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { appRoutes } from "../constants/routes";
import { useWalletAddress } from "../hooks/useWalletAddr";

export const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const dispatch = useDispatch();
  const walletAddr = useWalletAddress();
  const authData = useSelector(GlobalSelectors.authData);

  const navigation = [
    { name: "Home", path: appRoutes.dashboard.path },
    { name: "Documentation", path: appRoutes.attachments.path },
  ];

  const handleLogout = () => {
    dispatch(globalActions.logOut());
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="fixed top-0 w-full z-40 bg-obsidian-500/80 backdrop-blur-md border-b border-luxury-gold-500/10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-3"
            >
              <div className="w-10 h-10 bg-luxury-gold-500 rounded-full flex items-center justify-center">
                <span className="text-obsidian-500 font-bold text-xl">A</span>
              </div>
              <span className="text-2xl font-playfair text-white tracking-wider">
                AQUADUCT
              </span>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navigation.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`relative text-sm tracking-wider transition-colors ${
                  isActive(item.path)
                    ? "text-luxury-gold-500"
                    : "text-pearl-300 hover:text-white"
                }`}
              >
                {item.name}
                {isActive(item.path) && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute -bottom-6 left-0 right-0 h-0.5 bg-luxury-gold-500"
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* Wallet Connection */}
          <div className="flex items-center gap-4">
            {authData ? (
              <div className="hidden lg:flex items-center gap-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-obsidian-400/50 rounded-lg">
                  <Wallet className="w-4 h-4 text-luxury-gold-500" />
                  <span className="text-sm text-pearl-300">
                    {walletAddr?.slice(0, 6)}...{walletAddr?.slice(-4)}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-sm text-pearl-400 hover:text-luxury-gold-500 transition-colors"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <button
                className="hidden lg:flex items-center gap-2 px-6 py-2 bg-luxury-gold-500 
                               hover:bg-luxury-gold-400 text-obsidian-500 rounded-lg 
                               font-medium transition-colors"
              >
                Connect Wallet
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-pearl-300 hover:text-white"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-obsidian-400 border-t border-luxury-gold-500/10"
          >
            <div className="px-6 py-4 space-y-4">
              {navigation.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block py-2 text-sm ${
                    isActive(item.path)
                      ? "text-luxury-gold-500"
                      : "text-pearl-300"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              {authData ? (
                <div className="pt-4 border-t border-luxury-gold-500/10">
                  <div className="flex items-center gap-2 mb-3">
                    <Wallet className="w-4 h-4 text-luxury-gold-500" />
                    <span className="text-sm text-pearl-300">
                      {walletAddr?.slice(0, 6)}...{walletAddr?.slice(-4)}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="text-sm text-pearl-400"
                  >
                    Disconnect
                  </button>
                </div>
              ) : (
                <button
                  className="w-full py-2 bg-luxury-gold-500 text-obsidian-500 
                                 rounded-lg font-medium"
                >
                  Connect Wallet
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
