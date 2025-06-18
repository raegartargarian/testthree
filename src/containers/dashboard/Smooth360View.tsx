// src/containers/dashboard/components/Smooth360View.tsx
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";

const images360 = Array.from({ length: 9 }, (_, i) => {
  const angle = i * 15;
  return import(`../../assets/images/turtle${angle}.png`);
});

interface Smooth360ViewProps {
  autoRotate?: boolean;
  rotationSpeed?: number;
  sensitivity?: number;
  className?: string;
}

const Smooth360View: React.FC<Smooth360ViewProps> = ({
  autoRotate = true,
  rotationSpeed = 15, // slower for 9 images
  sensitivity = 10, // less sensitive for 9 images
  className = "",
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [loadedImages, setLoadedImages] = useState<string[]>([]);
  const animationRef = useRef<number>();
  const lastRotationTime = useRef<number>(Date.now());
  const floatIndex = useRef<number>(0);

  useEffect(() => {
    Promise.all(images360).then((modules) => {
      const imagePaths = modules.map((module) => module.default);
      setLoadedImages(imagePaths);
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    if (autoRotate && !isDragging && loadedImages.length > 0) {
      const animate = () => {
        const now = Date.now();
        const delta = now - lastRotationTime.current;
        lastRotationTime.current = now;

        const rotationIncrement =
          (delta / (rotationSpeed * 1000)) * loadedImages.length;
        floatIndex.current =
          (floatIndex.current + rotationIncrement) % loadedImages.length;

        setCurrentImageIndex(Math.floor(floatIndex.current));
        animationRef.current = requestAnimationFrame(animate);
      };

      animationRef.current = requestAnimationFrame(animate);

      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }
  }, [autoRotate, isDragging, loadedImages.length, rotationSpeed]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
    e.preventDefault();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || loadedImages.length === 0) return;

    const deltaX = e.clientX - startX;
    const imageChange = deltaX / sensitivity;

    if (Math.abs(imageChange) >= 1) {
      floatIndex.current =
        (floatIndex.current - Math.floor(imageChange) + loadedImages.length) %
        loadedImages.length;
      setCurrentImageIndex(Math.floor(floatIndex.current));
      setStartX(e.clientX);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    lastRotationTime.current = Date.now();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || loadedImages.length === 0) return;

    const deltaX = e.touches[0].clientX - startX;
    const imageChange = deltaX / sensitivity;

    if (Math.abs(imageChange) >= 1) {
      floatIndex.current =
        (floatIndex.current - Math.floor(imageChange) + loadedImages.length) %
        loadedImages.length;
      setCurrentImageIndex(Math.floor(floatIndex.current));
      setStartX(e.touches[0].clientX);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    lastRotationTime.current = Date.now();
  };

  return (
    <div
      className={`relative select-none ${className}`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="absolute inset-0 bg-gradient-radial from-luxury-gold-500/20 via-transparent to-transparent blur-3xl" />

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
            className={`w-full h-full object-contain relative z-10 ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
            draggable={false}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          />
        </AnimatePresence>
      )}

      {!isLoading && (
        <motion.div
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 
                   text-pearl-300 text-sm flex items-center gap-2 bg-obsidian-400/50 
                   px-4 py-2 rounded-full backdrop-blur-sm"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M7.47 21.5C4.2 19.94 1.86 16.76 1.5 13H0C.51 19.16 5.66 24 12 24l.66-.03L8.8 20.11 7.47 21.5zm.89-6.52c-.19 0-.37-.03-.52-.08-.16-.06-.29-.13-.4-.24-.11-.1-.2-.22-.26-.37-.06-.14-.09-.3-.09-.47h-1.3c0 .36.07.68.21.95.14.27.33.5.56.69.24.18.51.32.82.41.3.1.62.15.96.15.37 0 .72-.05 1.03-.15.32-.1.6-.25.83-.44s.42-.43.55-.72.2-.61.2-.97c0-.19-.02-.38-.07-.56-.05-.18-.12-.35-.23-.51-.1-.16-.24-.3-.4-.43-.17-.13-.37-.23-.61-.31.2-.09.37-.2.52-.33.15-.13.27-.27.37-.42.1-.15.17-.3.22-.46s.07-.32.07-.48c0-.36-.06-.68-.18-.96s-.29-.52-.51-.69c-.2-.19-.47-.33-.77-.43C9.1 8.05 8.76 8 8.39 8c-.36 0-.69.05-1 .16-.3.11-.57.26-.79.45-.21.19-.38.42-.51.68-.12.26-.18.54-.18.85h1.3c0-.17.03-.32.09-.45s.14-.25.25-.34.23-.17.38-.22.3-.08.48-.08c.4 0 .7.1.89.31.19.2.29.49.29.86 0 .18-.03.34-.08.49s-.14.27-.25.37c-.11.1-.25.18-.41.24-.16.06-.36.09-.58.09h-.77v1.03h.77c.22 0 .42.02.6.07s.33.13.45.23c.12.11.22.24.29.4s.1.35.1.57c0 .41-.12.72-.35.93-.23.23-.55.33-.95.33zm8.55-5.92c-.32-.33-.7-.59-1.14-.77-.44-.18-.92-.27-1.46-.27H12v8h2.3c.55 0 1.06-.09 1.51-.27s.84-.43 1.16-.76c.32-.33.57-.73.74-1.19.17-.47.26-.99.26-1.57v-.4c0-.58-.09-1.1-.26-1.57s-.42-.87-.74-1.2zm-.39 3.16c0 .42-.05.79-.14 1.13-.1.33-.24.62-.43.85-.19.23-.43.41-.71.53-.29.12-.62.18-.99.18h-.91V9.12h.97c.72 0 1.27.23 1.64.69.38.46.57 1.12.57 1.99v.4zM12 0l-.66.03 3.81 3.81L16.5 2.5C19.8 4.07 22.14 7.24 22.5 11H24c-.51-6.16-5.66-11-12-11z" />
          </svg>
          Drag to rotate
        </motion.div>
      )}
    </div>
  );
};

export default Smooth360View;
