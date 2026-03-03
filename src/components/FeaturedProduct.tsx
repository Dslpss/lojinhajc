"use client";

import { useState } from "react";
import Image from "next/image";
import { ShoppingBag, Maximize2 } from "lucide-react";
import ProductGallery from "./ProductGallery";

interface FeaturedProductProps {
  product: {
    name: string;
    description: string;
    price: number;
    images: string[];
  };
  whatsapp: string;
}

export default function FeaturedProduct({ product, whatsapp }: FeaturedProductProps) {
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <div 
          className="relative group reveal cursor-zoom-in"
          onClick={() => setIsGalleryOpen(true)}
        >
          <div className="absolute -inset-4 bg-accent/20 blur-[60px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden border border-white/5 shadow-2xl">
            <Image 
              src={product.images[0]} 
              alt={product.name} 
              fill 
              className="object-cover transition-transform duration-[2000ms] group-hover:scale-110" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
            
            {/* Zoom Indicator */}
            <div className="absolute top-8 right-8 scale-150 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
               <div className="p-4 rounded-full bg-accent/20 backdrop-blur-md border border-accent/30 text-accent">
                  <Maximize2 size={24} />
               </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-10 reveal stagger-2">
          <div className="space-y-4">
            <span className="text-accent font-black tracking-[0.3em] uppercase text-xs italic">Promoção do Dia</span>
            <h2 className="text-6xl md:text-8xl font-black font-outfit tracking-tighter text-white leading-none">
              {product.name.toUpperCase()}
            </h2>
          </div>
          <p className="text-xl text-slate-400 font-inter leading-relaxed italic border-l-4 border-accent pl-8">
            "{product.description}"
          </p>
          <div className="flex items-center gap-10">
            <div className="space-y-1">
              <span className="text-slate-500 text-[10px] uppercase font-mono tracking-widest">Preço Sugerido</span>
              <h4 className="text-4xl font-black text-white font-inter">R$ {product.price.toLocaleString('pt-BR')}</h4>
            </div>
            <a 
              href={`https://wa.me/${whatsapp?.replace(/\D/g, "") || "5511999999999"}?text=Olá, quero o destaque: ${product.name}`}
              target="_blank"
              rel="noopener noreferrer"
              className="premium-button py-6 px-12 group hover:gap-6 flex items-center gap-4 transition-all"
            >
              <ShoppingBag size={20} />
              Garanta o Seu
            </a>
          </div>
        </div>
      </div>

      {isGalleryOpen && (
        <ProductGallery 
          images={product.images} 
          isOpen={isGalleryOpen}
          productName={product.name}
          onClose={() => setIsGalleryOpen(false)} 
        />
      )}
    </>
  );
}
