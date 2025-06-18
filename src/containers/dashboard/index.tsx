// src/containers/dashboard/index.tsx
import { appRoutes } from "@/shared/constants/routes";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { GlobalSelectors } from "../global/selectors";

// Import all 360 view images
const images360 = Array.from({ length: 9 }, (_, i) => {
  const angle = i * 15;
  return import(`../../assets/images/turtle${angle}.png`);
});

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
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [loadedImages, setLoadedImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const authData = useSelector(GlobalSelectors.authData);
  const totalFractions = 100;
  const availableFractions = 37;
  const pricePerFraction = 50000;

  // Load 360 images
  useEffect(() => {
    Promise.all(images360).then((modules) => {
      const imagePaths = modules.map((module) => module.default);
      setLoadedImages(imagePaths);
      setIsLoading(false);
    });
  }, []);

  // Parallax effect
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 360 view handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || loadedImages.length === 0) return;

    const deltaX = e.clientX - startX;
    const sensitivity = 5;
    const imageChange = Math.floor(deltaX / sensitivity);

    let newIndex = currentImageIndex - imageChange;
    newIndex =
      ((newIndex % loadedImages.length) + loadedImages.length) %
      loadedImages.length;

    setCurrentImageIndex(newIndex);
    setStartX(e.clientX);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || loadedImages.length === 0) return;

    const deltaX = e.touches[0].clientX - startX;
    const sensitivity = 5;
    const imageChange = Math.floor(deltaX / sensitivity);

    let newIndex = currentImageIndex - imageChange;
    newIndex =
      ((newIndex % loadedImages.length) + loadedImages.length) %
      loadedImages.length;

    setCurrentImageIndex(newIndex);
    setStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

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

            {/* Right: 360 View */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="relative"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <div className="relative w-full aspect-square cursor-grab active:cursor-grabbing select-none">
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-radial from-luxury-gold-500/20 via-transparent to-transparent blur-3xl" />

                {/* 360 View Images */}
                {isLoading ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 border-4 border-luxury-gold-500/20 border-t-luxury-gold-500 rounded-full animate-spin" />
                  </div>
                ) : (
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={currentImageIndex}
                      src={loadedImages[currentImageIndex]}
                      alt="Pink Diamond Turtle"
                      className="w-full h-full object-contain relative z-10"
                      draggable={false}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.1 }}
                    />
                  </AnimatePresence>
                )}

                {/* Interaction hint */}
                <motion.div
                  className="absolute bottom-4 left-1/2 transform -translate-x-1/2 
                             text-pearl-300 text-sm flex items-center gap-2 bg-obsidian-400/50 
                             px-4 py-2 rounded-full backdrop-blur-sm"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M7.47 21.5C4.2 19.94 1.86 16.76 1.5 13H0C.51 19.16 5.66 24 12 24l.66-.03L8.8 20.11 7.47 21.5zm.89-6.52c-.19 0-.37-.03-.52-.08-.16-.06-.29-.13-.4-.24-.11-.1-.2-.22-.26-.37-.06-.14-.09-.3-.09-.47h-1.3c0 .36.07.68.21.95.14.27.33.5.56.69.24.18.51.32.82.41.3.1.62.15.96.15.37 0 .72-.05 1.03-.15.32-.1.6-.25.83-.44s.42-.43.55-.72.2-.61.2-.97c0-.19-.02-.38-.07-.56-.05-.18-.12-.35-.23-.51-.1-.16-.24-.3-.4-.43-.17-.13-.37-.23-.61-.31.2-.09.37-.2.52-.33.15-.13.27-.27.37-.42.1-.15.17-.3.22-.46s.07-.32.07-.48c0-.36-.06-.68-.18-.96s-.29-.52-.51-.69c-.2-.19-.47-.33-.77-.43C9.1 8.05 8.76 8 8.39 8c-.36 0-.69.05-1 .16-.3.11-.57.26-.79.45-.21.19-.38.42-.51.68-.12.26-.18.54-.18.85h1.3c0-.17.03-.32.09-.45s.14-.25.25-.34.23-.17.38-.22.3-.08.48-.08c.4 0 .7.1.89.31.19.2.29.49.29.86 0 .18-.03.34-.08.49s-.14.27-.25.37c-.11.1-.25.18-.41.24-.16.06-.36.09-.58.09h-.77v1.03h.77c.22 0 .42.02.6.07s.33.13.45.23c.12.11.22.24.29.4s.1.35.1.57c0 .41-.12.72-.35.93-.23.23-.55.33-.95.33zm8.55-5.92c-.32-.33-.7-.59-1.14-.77-.44-.18-.92-.27-1.46-.27H12v8h2.3c.55 0 1.06-.09 1.51-.27s.84-.43 1.16-.76c.32-.33.57-.73.74-1.19.17-.47.26-.99.26-1.57v-.4c0-.58-.09-1.1-.26-1.57s-.42-.87-.74-1.2zm-.39 3.16c0 .42-.05.79-.14 1.13-.1.33-.24.62-.43.85-.19.23-.43.41-.71.53-.29.12-.62.18-.99.18h-.91V9.12h.97c.72 0 1.27.23 1.64.69.38.46.57 1.12.57 1.99v.4zM12 0l-.66.03 3.81 3.81L16.5 2.5C19.8 4.07 22.14 7.24 22.5 11H24c-.51-6.16-5.66-11-12-11z" />
                  </svg>
                  Drag to rotate
                </motion.div>
              </div>
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
