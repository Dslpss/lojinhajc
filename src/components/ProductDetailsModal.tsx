"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X, ShoppingCart, ShieldCheck, Box, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";

interface ProductDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    name: string;
    description: string;
    price: number;
    promoPrice?: number | null;
    isPromo?: boolean;
    images: string[];
    stock: number;
    whatsapp?: string;
    technicalSpecs?: string | null;
    condition?: string;
  };
}

export default function ProductDetailsModal({ isOpen, onClose, product }: ProductDetailsModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  const displayPrice = product.isPromo && product.promoPrice ? product.promoPrice : product.price;
  const cleanWhatsapp = product.whatsapp?.replace(/\D/g, "") || "5511999999999";
  const whatsappLink = `https://wa.me/${cleanWhatsapp}?text=Olá! Gostaria de mais detalhes sobre o produto: ${product.name}`;

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4 md:p-10 overflow-hidden">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl"
        />

        {/* Modal Container */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-5xl max-h-[90vh] bg-slate-900/60 border border-white/10 rounded-[2.5rem] overflow-hidden flex flex-col md:flex-row shadow-[0_0_100px_rgba(0,0,0,0.5)] z-10"
        >
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all z-50 text-white/50 hover:text-white"
          >
            <X size={20} />
          </button>

          {/* Left: Image Gallery Preview (Simplified) */}
          <div className="w-full md:w-1/2 h-64 md:h-auto relative bg-slate-950/50">
            <Image 
              src={product.images[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800'} 
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
          </div>

          {/* Right: Content Section */}
          <div className="w-full md:w-1/2 p-8 md:p-12 overflow-y-auto flex flex-col min-h-0 flex-1 scrollbar-thin scrollbar-thumb-accent/20 scrollbar-track-transparent">
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-accent font-black tracking-[0.4em] uppercase text-[9px] italic">Detalhes do Produto</span>
                  <span className="px-2 py-0.5 bg-white/5 border border-white/10 text-slate-500 font-mono text-[8px] uppercase tracking-widest rounded-full">
                    Estado: {product.condition || "Novo"}
                  </span>
                </div>
                <h2 className="text-3xl md:text-4xl font-black font-outfit text-white uppercase italic leading-tight">
                  {product.name}
                </h2>
              </div>

              <div className="flex flex-col gap-1">
                {product.isPromo && (
                  <span className="text-xs text-slate-500 line-through font-mono">De R$ {product.price.toLocaleString('pt-BR')}</span>
                )}
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-black text-white font-inter tracking-tighter">
                    R$ {displayPrice.toLocaleString('pt-BR')}
                  </span>
                  {product.isPromo && (
                    <span className="px-3 py-1 bg-accent text-slate-950 font-black text-[8px] uppercase tracking-widest rounded-full shadow-glow">
                      Oferta VIP
                    </span>
                  )}
                </div>
              </div>

              <div className="h-[1px] w-full bg-white/5" />

              <div className="space-y-4">
                <h3 className="text-white font-black font-outfit uppercase text-xs tracking-widest italic opacity-50">Descrição Comercial</h3>
                <p className="text-slate-400 font-inter leading-relaxed whitespace-pre-line text-sm md:text-base italic">
                  {product.description}
                </p>
              </div>

              {product.technicalSpecs && (
                <div className="space-y-4 p-6 bg-emerald-500/5 border border-emerald-500/10 rounded-3xl flex flex-col max-h-60">
                  <h3 className="text-emerald-400 font-black font-outfit uppercase text-xs tracking-widest italic flex items-center gap-2 shrink-0">
                    <Box size={14} />
                    Especificações Técnicas
                  </h3>
                  <div className="overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-emerald-500/20 scrollbar-track-transparent">
                    <p className="text-slate-300 font-mono leading-relaxed whitespace-pre-line text-[11px] md:text-xs">
                      {product.technicalSpecs}
                    </p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 bg-white/5 p-4 rounded-3xl border border-white/5 px-5">
                  <ShieldCheck size={20} className="text-accent" />
                  <div className="flex flex-col">
                    <span className="text-[8px] font-black font-mono text-slate-500 uppercase">Garantia</span>
                    <span className="text-[10px] font-black text-white uppercase italic">Original</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-white/5 p-4 rounded-3xl border border-white/5 px-5">
                  <Box size={20} className="text-emerald-500" />
                  <div className="flex flex-col">
                    <span className="text-[8px] font-black font-mono text-slate-500 uppercase">Estoque</span>
                    <span className="text-[10px] font-black text-white uppercase italic">{product.stock} Unidades</span>
                  </div>
                </div>
              </div>

              <div className="pt-8 mt-auto">
                <a 
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="premium-button w-full py-6 flex items-center justify-center gap-3 shadow-glow group hover:scale-[1.02] transition-transform"
                >
                  <MessageCircle size={20} />
                  Falar com Consultor
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
}
