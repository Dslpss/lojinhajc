"use client";

import { useState } from "react";
import Image from "next/image";
import { ShoppingCart, Maximize2, Layers, Heart, Box } from "lucide-react";
import ProductGallery from "./ProductGallery";
import ProductDetailsModal from "./ProductDetailsModal";
import { motion } from "framer-motion";

interface ProductProps {
  name: string;
  price: number;
  promoPrice?: number | null;
  isPromo?: boolean;
  images: string[];
  description: string;
  whatsapp?: string;
  stock?: number;
  technicalSpecs?: string | null;
  condition?: string;
}

export default function ProductCard({ name, price, promoPrice, isPromo, images, description, whatsapp, stock = 0, technicalSpecs, condition = "Novo" }: ProductProps) {
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const cleanWhatsapp = whatsapp?.replace(/\D/g, "") || "5511999999999";
  
  const displayPrice = isPromo && promoPrice ? promoPrice : price;
  const whatsappLink = `https://wa.me/${cleanWhatsapp}?text=Olá! Tenho interesse no produto: ${name} (R$ ${displayPrice.toLocaleString('pt-BR')})`;

  return (
    <>
      <motion.div 
        whileHover={{ y: -12, scale: 1.02 }}
        className={`glass-card group relative flex flex-col h-full overflow-hidden transition-all duration-500 ${
          isPromo 
            ? "bg-accent/10 border-accent/30 shadow-[0_0_40px_rgba(56,189,248,0.1)]" 
            : "bg-slate-900/40 border-white/5"
        }`}
      >
        {/* Glow Overlay */}
        <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none ${isPromo ? 'bg-accent/20' : 'bg-accent/5'}`} />
        
        {/* Image Container */}
        <div 
          className="relative aspect-square overflow-hidden bg-slate-950/50 cursor-zoom-in"
          onClick={() => setIsGalleryOpen(true)}
        >
          <Image
            src={images[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800'}
            alt={name}
            fill
            className="object-cover transition-all duration-1000 group-hover:scale-110 group-hover:grayscale-0 grayscale-[0.3]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
          
          {/* Promo Badge */}
          {isPromo && (
            <div className="absolute top-4 left-4 z-20">
              <motion.div 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="px-2 py-0.5 bg-accent text-slate-950 font-black text-[7px] uppercase tracking-[0.2em] rounded-full shadow-[0_0_15px_rgba(56,189,248,0.5)] italic"
              >
                Mega Oferta
              </motion.div>
            </div>
          )}
          
          <div className="absolute top-4 right-4 flex flex-col gap-2">
             <button className="p-2 rounded-full bg-slate-900/60 backdrop-blur-md border border-white/10 text-white/50 hover:text-red-400 transition-colors">
                <Heart size={14} />
             </button>
             <button 
               className="p-2 rounded-full bg-accent/20 backdrop-blur-md border border-accent/30 text-accent hover:bg-accent hover:text-slate-950 transition-all duration-300 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0"
               onClick={(e) => { e.stopPropagation(); setIsGalleryOpen(true); }}
             >
                <Maximize2 size={14} />
             </button>
          </div>

          <div className="absolute bottom-4 left-4">
            <div className="px-2 py-0.5 rounded-full bg-accent/20 backdrop-blur-md border border-accent/30 text-[8px] font-black font-outfit uppercase tracking-widest text-accent italic">
              {condition}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-3.5 flex flex-col flex-grow space-y-1.5 relative z-10">
          <div className="space-y-1">
            <div className="flex justify-between items-start gap-2">
              <h3 className="text-lg font-black font-outfit tracking-tight text-white uppercase italic group-hover:text-accent transition-colors">
                {name}
              </h3>
            </div>
            <div className="flex flex-col">
              {isPromo && promoPrice && (
                 <span className="text-[10px] text-slate-500 line-through font-mono">De R$ {price.toLocaleString('pt-BR')}</span>
              )}
              <div className="flex items-center gap-2">
                <span className={`${isPromo ? 'text-white' : 'text-accent'} font-mono text-xs tracking-tighter opacity-70 italic font-bold`}>
                  {isPromo ? 'OFERTA' : 'POR'}
                </span>
                <span className={`text-2xl font-black font-inter tracking-tighter ${isPromo ? 'text-accent' : 'text-white'}`}>
                  R$ {displayPrice.toLocaleString('pt-BR')}
                </span>
              </div>
            </div>
            {/* Stock Display */}
            <div className="flex items-center gap-2">
              <div className={`h-1.5 w-1.5 rounded-full animate-pulse ${stock > 0 ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]'}`} />
              <span className="text-[10px] font-black font-mono uppercase tracking-[0.2em] text-slate-400">
                {stock > 0 ? `${stock} EM ESTOQUE` : 'ESGOTADO'}
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-500 font-inter leading-relaxed line-clamp-2 uppercase tracking-wider">
            {description}
          </p>

          <button 
            onClick={() => setIsDetailsOpen(true)}
            className="flex items-center gap-1.5 text-[10px] font-black text-accent uppercase tracking-widest hover:text-white transition-colors text-left w-fit py-1"
          >
            <Box size={10} />
            Acessar Ficha Técnica
          </button>

          <div className="pt-2 mt-auto flex flex-col gap-2">
             <div className="h-[1px] w-full bg-white/5 mb-2" />
            <a 
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="premium-button py-2.5 text-center flex items-center justify-center gap-2 shadow-glow hover:shadow-glow-accent group-hover:scale-[1.02]"
            >
              <ShoppingCart size={16} />
              Comprar Agora
            </a>
          </div>
        </div>
      </motion.div>

      {isGalleryOpen && (
        <ProductGallery 
          images={images} 
          isOpen={isGalleryOpen}
          productName={name}
          onClose={() => setIsGalleryOpen(false)} 
        />
      )}

      {isDetailsOpen && (
        <ProductDetailsModal 
          isOpen={isDetailsOpen}
          onClose={() => setIsDetailsOpen(false)}
          product={{
            name,
            description,
            price,
            promoPrice,
            isPromo,
            images,
            stock,
            whatsapp,
            technicalSpecs,
            condition
          }}
        />
      )}
    </>
  );
}
