"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, ZoomOut, Move, Maximize2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";

interface ProductGalleryProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  productName: string;
}

export default function ProductGallery({ isOpen, onClose, images, productName }: ProductGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dragConstraintsRef = useRef<HTMLDivElement>(null);

  // Set mounted state
  useEffect(() => {
    setMounted(true);
  }, []);

  // Reset state when opening
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setIsZoomed(false);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  useEffect(() => {
    setIsZoomed(false);
  }, [currentIndex]);

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") onClose();
      if (!isZoomed) {
        if (e.key === "ArrowRight") setCurrentIndex((prev) => (prev + 1) % images.length);
        if (e.key === "ArrowLeft") setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isZoomed, images.length, onClose]);

  if (!isOpen || !mounted) return null;

  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
  };

  return createPortal(
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[1000] flex flex-col bg-[#020617]/98 backdrop-blur-[100px] overflow-hidden select-none"
    >
      {/* Background Overlay (Dedicated Click Layer) */}
      <div 
        className="absolute inset-0 z-[1005]" 
        onClick={onClose}
      />

      {/* Dynamic Background Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-accent/10 blur-[150px] rounded-full" />
      </div>

      {/* Ultra Slim Progress Bar */}
      <div className="absolute top-0 left-0 w-full h-1 bg-white/5 z-[1010]">
         <motion.div 
           className="h-full bg-accent shadow-[0_0_15px_rgba(56,189,248,0.8)]"
           initial={{ width: 0 }}
           animate={{ width: `${((currentIndex + 1) / images.length) * 100}%` }}
           transition={{ duration: 0.5, ease: "circOut" }}
         />
      </div>

      {/* Modern Header */}
      <motion.header 
        animate={{ 
          y: isZoomed ? -20 : 0,
          opacity: isZoomed ? 0.3 : 1,
          scale: isZoomed ? 0.9 : 1
        }}
        className="relative w-full p-6 md:p-10 flex items-center justify-between z-[1020] transition-all duration-700"
      >
        <div className="flex flex-col gap-0 pointer-events-none">
          <motion.span 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 0.4, y: 0 }}
            className="text-white font-mono text-[8px] uppercase tracking-[0.6em]"
          >
            {isZoomed ? "Zoom Máximo" : "Galeria de Fotos"}
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl md:text-3xl font-black text-white font-outfit uppercase italic tracking-tighter"
          >
            {productName}
          </motion.h2>
        </div>

        <button 
          onClick={onClose}
          className="group relative p-3 md:p-5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-3xl transition-all duration-500 scale-90 md:scale-100 z-[1030]"
        >
          <X size={20} className="text-white opacity-40 group-hover:opacity-100 group-hover:rotate-90 transition-all duration-500" />
        </button>
      </motion.header>

      {/* Cinema viewport */}
      <div className="relative flex-1 w-full flex items-center justify-center p-0 md:p-10 overflow-hidden z-[1015]" ref={dragConstraintsRef}>
        
        {/* Navigation Controls (Floating) */}
        {!isZoomed && images.length > 1 && (
           <>
            <button 
              className="absolute left-8 md:left-12 z-[1050] p-6 text-white/20 hover:text-white transition-all bg-white/5 hover:bg-white/10 border border-white/5 rounded-full backdrop-blur-2xl hover:scale-110 active:scale-95"
              onClick={(e) => { e.stopPropagation(); setCurrentIndex((prev) => (prev - 1 + images.length) % images.length); }}
            >
              <ChevronLeft size={32} strokeWidth={1.5} />
            </button>
            <button 
              className="absolute right-8 md:right-12 z-[1050] p-6 text-white/20 hover:text-white transition-all bg-white/5 hover:bg-white/10 border border-white/5 rounded-full backdrop-blur-2xl hover:scale-110 active:scale-95"
              onClick={(e) => { e.stopPropagation(); setCurrentIndex((prev) => (prev + 1) % images.length); }}
            >
              <ChevronRight size={32} strokeWidth={1.5} />
            </button>
           </>
        )}

        {/* Main Stage */}
        <div className="relative w-full h-full flex items-center justify-center pointer-events-none">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.9, filter: "blur(20px)" }}
              animate={{ 
                opacity: 1, 
                scale: isZoomed ? 3 : 1, 
                filter: "blur(0px)",
                x: isZoomed ? undefined : 0, 
                y: isZoomed ? undefined : 0
              }}
              exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
              transition={{ 
                opacity: { duration: 0.6 },
                scale: { type: "spring", stiffness: 150, damping: 25 },
                default: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
              }}
              className={`relative aspect-square w-full max-w-4xl h-full flex items-center justify-center pointer-events-auto ${isZoomed ? "cursor-grab active:cursor-grabbing" : "cursor-zoom-in"}`}
              drag={isZoomed}
              // 🤖 @frontend-specialist: Using soft constraints for fluid panning
              dragConstraints={isZoomed ? { left: -800, right: 800, top: -800, bottom: 800 } : dragConstraintsRef}
              dragElastic={0.2}
              dragMomentum={true}
              // 🤖 @performance-optimizer: Smooth momentum decay
              dragTransition={{ bounceStiffness: 200, bounceDamping: 20 }}
              onTap={() => {
                if (!isZoomed) toggleZoom();
              }}
              onDoubleClick={toggleZoom}
            >
              <Image 
                src={images[currentIndex] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800'} 
                alt={productName}
                fill
                className="object-contain drop-shadow-[0_40px_100px_rgba(0,0,0,0.6)]"
                priority
                draggable={false}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Modern Footer Controls */}
      <motion.footer 
        animate={{ 
          y: isZoomed ? 20 : 0,
          opacity: isZoomed ? 0.3 : 1,
          scale: isZoomed ? 0.9 : 1
        }}
        className="relative w-full p-6 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 z-[1020] transition-all duration-700"
      >
        
        {/* Thumbnails Tray */}
        <div className="flex items-center gap-2 bg-white/5 p-2 rounded-full border border-white/10 backdrop-blur-2xl">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={(e) => { e.stopPropagation(); setCurrentIndex(idx); }}
              className={`relative h-10 w-10 rounded-full overflow-hidden border-2 transition-all duration-500 hover:scale-110 ${
                idx === currentIndex ? "border-accent ring-4 ring-accent/10" : "border-white/5 opacity-40 hover:opacity-100"
              }`}
            >
              <Image 
                src={img || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=100'} 
                alt={`thumb ${idx}`} 
                fill 
                className="object-cover" 
              />
            </button>
          ))}
        </div>

        {/* Action Center */}
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end">
            <span className="text-white/20 font-mono text-[8px] uppercase tracking-[0.4em]">Index</span>
            <span className="text-xl font-black text-white font-outfit italic">0{currentIndex + 1} <span className="text-accent">/</span> 0{images.length}</span>
          </div>

          <button 
            className="flex items-center gap-3 bg-accent text-slate-950 px-6 py-2.5 rounded-full font-black text-[9px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(56,189,248,0.4)]"
            onClick={(e) => { e.stopPropagation(); toggleZoom(); }}
          >
            {isZoomed ? (
              <><ZoomOut size={14} /> Reduzir</>
            ) : (
              <><Maximize2 size={14} /> Zoom Ultra</>
            )}
          </button>
        </div>
      </motion.footer>

      {/* Mode Overlay */}
      {isZoomed && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-3xl rounded-full border border-white/20 pointer-events-none z-[1060]"
        >
          <Move size={14} className="text-accent animate-pulse" />
          <span className="text-[9px] font-black text-white uppercase tracking-[0.2em]">Arraste para inspecionar cada detalhe</span>
        </motion.div>
      )}
    </motion.div>,
    document.body
  );
}
