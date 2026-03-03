"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ShoppingBag, Maximize2 } from "lucide-react";
import ProductGallery from "./ProductGallery";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  promoPrice?: number | null;
  isPromo?: boolean;
  images: string[];
  stock: number;
}

interface FeaturedSliderProps {
  products: Product[];
  whatsapp: string;
}

export default function FeaturedSlider({ products, whatsapp }: FeaturedSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 8000);
    return () => clearInterval(timer);
  }, [currentIndex]);

  const nextSlide = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % products.length);
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + products.length) % products.length);
  };

  if (products.length === 0) return null;

  const currentProduct = products[currentIndex];
  const cleanWhatsapp = whatsapp.replace(/\D/g, "");

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.9,
      filter: "blur(10px)",
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 1.1,
      filter: "blur(10px)",
    }),
  };

  return (
    <div className="relative w-full min-h-[600px] flex items-center overflow-hidden">
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.6 },
            scale: { duration: 0.8 },
            filter: { duration: 0.5 }
          }}
          className="absolute inset-0 w-full h-full"
        >
          <div className="max-w-7xl mx-auto px-6 h-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Image Stage */}
            <div 
              className="relative group cursor-zoom-in reveal"
              onClick={() => setIsGalleryOpen(true)}
            >
              <div className="absolute -inset-10 bg-accent/10 blur-[100px] rounded-full opacity-50 group-hover:opacity-100 transition-opacity duration-1000" />
              <div className="relative aspect-[4/5] md:aspect-square lg:aspect-[4/5] rounded-[2.5rem] md:rounded-[4rem] overflow-hidden border border-white/5 shadow-2xl bg-slate-900/40">
                <Image 
                  src={currentProduct.images[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800'} 
                  alt={currentProduct.name} 
                  fill 
                  className="object-cover transition-transform duration-[3000ms] group-hover:scale-110" 
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                
                {/* Promo Badge */}
                {currentProduct.isPromo && (
                  <div className="absolute top-8 left-8">
                     <div className="px-6 py-2 bg-accent text-slate-950 font-black text-xs uppercase tracking-[0.2em] rounded-full shadow-[0_0_30px_rgba(56,189,248,0.5)]">
                        Mega Oferta
                     </div>
                  </div>
                )}

                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-700 scale-50 group-hover:scale-100">
                   <div className="p-6 rounded-full bg-accent/20 backdrop-blur-3xl border border-accent/30 text-accent">
                      <Maximize2 size={40} strokeWidth={1} />
                   </div>
                </div>
              </div>
            </div>

            {/* Content Stage */}
            <div className="space-y-8 md:space-y-12">
              <div className="space-y-4">
                <motion.span 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={`tag-${currentIndex}`}
                  className="text-accent font-black tracking-[0.4em] uppercase text-[10px] md:text-xs italic"
                >
                  {currentProduct.isPromo ? "Destaque com Desconto" : "Destaque da Loja"}
                </motion.span>
                <motion.h2 
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={`title-${currentIndex}`}
                  className="text-5xl md:text-8xl font-black font-outfit tracking-tighter text-white leading-[0.85] uppercase italic"
                >
                  {currentProduct.name}
                </motion.h2>

                {/* Stock Badge */}
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={`stock-${currentIndex}`}
                  transition={{ delay: 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className={`h-2 w-2 rounded-full animate-pulse ${currentProduct.stock > 0 ? 'bg-emerald-500 shadow-glow-emerald' : 'bg-red-500 shadow-glow-red'}`} />
                  <span className="text-[10px] md:text-xs font-black font-mono uppercase tracking-[0.3em] text-white/50">
                    {currentProduct.stock > 0 ? `${currentProduct.stock} Unidades em estoque` : 'Produto Esgotado'}
                  </span>
                </motion.div>
              </div>

              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                key={`desc-${currentIndex}`}
                transition={{ delay: 0.2 }}
                className="text-lg md:text-xl text-slate-400 font-inter leading-relaxed border-l-4 border-white/10 pl-6 md:pl-10 italic"
              >
                {currentProduct.description}
              </motion.p>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8 md:gap-12">
                <div className="space-y-1">
                  <span className="text-slate-500 text-[10px] uppercase font-mono tracking-widest">
                    {currentProduct.isPromo ? "De R$ " + currentProduct.price.toLocaleString('pt-BR') : "Preço Especial"}
                  </span>
                  <div className="flex items-baseline gap-3">
                    <h4 className="text-4xl md:text-6xl font-black text-white font-inter tracking-tighter">
                      R$ {(currentProduct.isPromo && currentProduct.promoPrice ? currentProduct.promoPrice : currentProduct.price).toLocaleString('pt-BR')}
                    </h4>
                  </div>
                </div>

                <a 
                  href={`https://wa.me/${cleanWhatsapp}?text=Olá! Vi o destaque ${currentProduct.name} e quero garantir o meu!`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="premium-button py-5 md:py-7 px-10 md:px-14 group hover:gap-6 flex items-center gap-4 transition-all w-full sm:w-auto justify-center"
                >
                  <ShoppingBag size={22} />
                  Garanta o Seu
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Controls */}
      {products.length > 1 && (
        <>
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-4 z-20">
            {products.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setDirection(idx > currentIndex ? 1 : -1);
                  setCurrentIndex(idx);
                }}
                className={`h-1.5 transition-all duration-500 rounded-full ${
                  idx === currentIndex ? "w-12 bg-accent shadow-glow" : "w-3 bg-white/10 hover:bg-white/30"
                }`}
              />
            ))}
          </div>

          <button 
            onClick={prevSlide}
            className="absolute left-4 md:left-10 top-1/2 -translate-y-1/2 p-4 md:p-6 rounded-full bg-white/5 border border-white/5 text-white/20 hover:text-white hover:bg-white/10 hover:scale-110 transition-all z-20 backdrop-blur-xl"
          >
            <ChevronLeft size={30} strokeWidth={1.5} />
          </button>
          <button 
            onClick={nextSlide}
            className="absolute right-4 md:right-10 top-1/2 -translate-y-1/2 p-4 md:p-6 rounded-full bg-white/5 border border-white/5 text-white/20 hover:text-white hover:bg-white/10 hover:scale-110 transition-all z-20 backdrop-blur-xl"
          >
            <ChevronRight size={30} strokeWidth={1.5} />
          </button>
        </>
      )}

      {isGalleryOpen && (
        <ProductGallery 
          images={currentProduct.images} 
          isOpen={isGalleryOpen}
          productName={currentProduct.name}
          onClose={() => setIsGalleryOpen(false)} 
        />
      )}
    </div>
  );
}
