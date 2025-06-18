// src/containers/dashboard/index.tsx
import { appRoutes } from "@/shared/constants/routes";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { GlobalSelectors } from "../global/selectors";
import Smooth360View from "./Smooth360View";

// Import angle views for slider
import turtleAngle1 from "../../assets/images/turtle-angle-1.png";
import turtleAngle2 from "../../assets/images/turtle-angle-2.png";
import turtleAngle3 from "../../assets/images/turtle-angle-3.png";

const angleViews = [
  { src: turtleAngle1, label: "Side View" },
  { src: turtleAngle2, label: "Top View" },
  { src: turtleAngle3, label: "Detail View" },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const authData = useSelector(GlobalSelectors.authData);
  const totalFractions = 100;
  const availableFractions = 37;
  const pricePerFraction = 50000;

  // Parallax effect
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-obsidian-500 via-obsidian-400 to-obsidian-500">
      {/* Hero Section with Parallax */}
      <section className="relative h-screen overflow-hidden">
        <motion.div className="absolute inset-0" style={{ y: scrollY * 0.5 }}>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-obsidian-500/50 to-obsidian-500" />
          <div className="absolute inset-0 bg-gradient-radial from-luxury-gold-500/10 via-transparent to-transparent" />
        </motion.div>

        {/* 360 Turtle View */}
        <div className="relative z-10 h-full flex items-center justify-center px-8">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="text-center lg:text-left"
            >
              <h1 className="luxury-heading text-luxury-gold-500 text-2xl mb-4">
                Exclusive Offering
              </h1>
              <h2 className="font-playfair text-5xl lg:text-7xl text-white mb-6 leading-tight">
                The Pink Diamond
                <br />
                Turtle
              </h2>
              <p className="text-pearl-200 text-lg mb-8 max-w-lg mx-auto lg:mx-0">
                A masterpiece of artistry and rarity. 247 carats of the world's
                finest pink diamonds, meticulously crafted into an eternal
                symbol of prosperity.
              </p>

              {/* Fraction Info */}
              <div className="bg-obsidian-300/30 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-luxury-gold-500/20">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-pearl-300">Available Fractions</span>
                  <span className="text-2xl font-light text-luxury-gold-500">
                    {availableFractions}/{totalFractions}
                  </span>
                </div>
                <div className="w-full bg-obsidian-200 rounded-full h-2 mb-4">
                  <motion.div
                    className="bg-gradient-to-r from-luxury-gold-400 to-luxury-gold-600 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{
                      width: `${(availableFractions / totalFractions) * 100}%`,
                    }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                  />
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-pearl-300">Price per fraction</span>
                  <span className="luxury-price text-3xl text-white">
                    ${pricePerFraction.toLocaleString()}{" "}
                    <span className="text-lg text-pearl-400">USDC</span>
                  </span>
                </div>
              </div>

              {authData ? (
                <motion.button
                  onClick={() => navigate(appRoutes.attachments.path)}
                  className="bg-luxury-gold-500 text-obsidian-500 px-10 py-4 rounded-lg text-lg font-medium 
                           hover:bg-luxury-gold-400 transition-all duration-300 transform hover:scale-105
                           shadow-lg hover:shadow-glow"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  View Documentation & Purchase
                </motion.button>
              ) : (
                <p className="text-pearl-300">Connect wallet to continue</p>
              )}
            </motion.div>

            {/* Right: Smooth 360 View */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="relative"
            >
              <Smooth360View
                autoRotate={true}
                rotationSpeed={15}
                sensitivity={10}
                className="w-full aspect-square"
              />
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <svg
            width="30"
            height="50"
            viewBox="0 0 30 50"
            className="text-luxury-gold-500/50"
          >
            <rect
              x="10"
              y="10"
              width="10"
              height="20"
              rx="5"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
            />
            <circle
              cx="15"
              cy="20"
              r="3"
              fill="currentColor"
              className="animate-pulse"
            />
          </svg>
        </motion.div>
      </section>

      {/* Angle Views Slider */}
      <section className="py-16 px-8 bg-obsidian-500">
        <div className="max-w-6xl mx-auto">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center luxury-heading text-luxury-gold-500 text-xl mb-8"
          >
            Multiple Perspectives
          </motion.h3>

          <div className="relative">
            <div className="overflow-hidden rounded-xl">
              <motion.div
                className="flex"
                animate={{ x: `-${currentSlideIndex * 100}%` }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                {angleViews.map((view, index) => (
                  <div key={index} className="min-w-full relative">
                    <img
                      src={view.src}
                      alt={view.label}
                      className="w-full h-[400px] object-contain bg-obsidian-400"
                    />
                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-obsidian-500 to-transparent">
                      <p className="text-luxury-gold-500 text-lg font-light">
                        {view.label}
                      </p>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Navigation Buttons */}
            <button
              onClick={() =>
                setCurrentSlideIndex(Math.max(0, currentSlideIndex - 1))
              }
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-obsidian-400/80 backdrop-blur-sm 
                       rounded-full text-luxury-gold-500 hover:bg-obsidian-300 transition-colors"
              disabled={currentSlideIndex === 0}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={() =>
                setCurrentSlideIndex(
                  Math.min(angleViews.length - 1, currentSlideIndex + 1)
                )
              }
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-obsidian-400/80 backdrop-blur-sm 
                       rounded-full text-luxury-gold-500 hover:bg-obsidian-300 transition-colors"
              disabled={currentSlideIndex === angleViews.length - 1}
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Slide Indicators */}
            <div className="flex justify-center gap-2 mt-4">
              {angleViews.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlideIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    currentSlideIndex === index
                      ? "w-8 bg-luxury-gold-500"
                      : "bg-luxury-gold-500/30"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Details Section */}
      <section className="py-24 px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="grid md:grid-cols-3 gap-8"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            {[
              { label: "Total Carats", value: "247", suffix: "ct" },
              { label: "Diamond Type", value: "Argyle Pink", suffix: "" },
              { label: "Minimum Investment", value: "$50,000", suffix: "USDC" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                className="text-center p-8 border border-luxury-gold-500/20 rounded-xl bg-obsidian-400/30 backdrop-blur-sm"
                whileHover={{ y: -5, borderColor: "rgba(212, 175, 55, 0.4)" }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="luxury-heading text-luxury-gold-500 mb-2">
                  {stat.label}
                </h3>
                <p className="text-4xl font-light text-white">
                  {stat.value}
                  <span className="text-2xl text-pearl-400">{stat.suffix}</span>
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
