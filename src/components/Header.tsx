"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingBag, Menu, X, ShieldCheck, Heart } from "lucide-react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

interface HeaderProps {
  storeName: string;
}

export default function Header({ storeName }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const pathname = usePathname();

  const isAdminPage = pathname.startsWith("/admin");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (isAdminPage) return null;

  const navLinks = [
    { name: "Início", href: "/" },
    { name: "Novidades", href: "#" },
    { name: "Mais Vendidos", href: "#" },
    { name: "Suporte", href: "#" },
  ];

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-700 px-6 ${
          isScrolled 
            ? "py-4" 
            : "py-8"
        }`}
      >
        <div 
          className={`max-w-7xl mx-auto transition-all duration-700 rounded-none border-b relative ${
            isScrolled 
              ? "bg-slate-950/80 backdrop-blur-3xl border-white/10 py-4 px-8" 
              : "bg-transparent border-transparent py-0 px-0"
          }`}
        >
          <div className="flex items-center justify-between relative z-10">
            {/* Logo - Minimalist Upgrade */}
            <Link href="/" className="group flex items-center gap-4">
              <div className="relative">
                <div className="w-10 h-10 bg-white text-slate-950 flex items-center justify-center transition-transform duration-500 group-hover:scale-90">
                  <ShoppingBag size={20} />
                </div>
                <div className="absolute -inset-1 border border-white/20 scale-0 group-hover:scale-100 transition-transform duration-500" />
              </div>
              <span className="text-xl font-black font-outfit tracking-[0.1em] text-white uppercase italic">
                {storeName || "Premium"}<span className="text-accent">.</span>
              </span>
            </Link>

            {/* Boutique Desktop Nav */}
            <nav 
              className="hidden lg:flex items-center gap-12"
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {navLinks.map((link, index) => (
                <Link 
                  key={link.name} 
                  href={link.href}
                  onMouseEnter={() => setHoveredIndex(index)}
                  className="group relative py-2"
                >
                   {/* Main Text with Spacing Animation */}
                   <span className={`text-[10px] font-black uppercase tracking-[0.25em] transition-all duration-500 ${
                      hoveredIndex === index ? "text-white tracking-[0.4em]" : "text-slate-500"
                   }`}>
                      {link.name}
                   </span>

                   {/* Precision Underline */}
                   <div className={`absolute bottom-0 left-0 h-[1px] bg-accent transition-all duration-500 ease-out ${
                      hoveredIndex === index ? "w-full opacity-100" : "w-0 opacity-0"
                   }`} />
                </Link>
              ))}
            </nav>

            {/* High-Fashion Actions */}
            <div className="flex items-center gap-6">
               <button className="hidden md:flex text-slate-500 hover:text-white transition-colors">
                  <Heart size={18} strokeWidth={1.5} />
               </button>
               <button className="group flex items-center gap-4">
                  <div className="flex flex-col items-end">
                    <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">Shop Bag</span>
                    <span className="text-[10px] font-black uppercase text-white tracking-[0.2em] group-hover:text-accent transition-colors">(0)</span>
                  </div>
                  <div className="w-10 h-10 border border-white/10 flex items-center justify-center group-hover:border-accent group-hover:bg-accent group-hover:text-slate-950 transition-all duration-500">
                    <ShoppingBag size={16} />
                  </div>
               </button>
               
               {/* Mobile Toggle */}
               <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden w-10 h-10 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white"
               >
                 {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
               </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay - Boutique Style */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="fixed inset-0 z-[1000] bg-slate-950 flex flex-col items-center justify-center p-10 lg:hidden"
          >
            <div className="absolute top-10 right-10">
               <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-12 h-12 border border-white/10 flex items-center justify-center text-white"
               >
                 <X size={24} />
               </button>
            </div>

            <div className="space-y-12 text-center w-full max-w-sm">
              {navLinks.map((link, idx) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Link 
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="group flex flex-col items-center"
                  >
                    <span className="text-5xl font-black font-outfit uppercase tracking-tighter text-white group-hover:tracking-widest transition-all duration-700">
                      {link.name}
                    </span>
                  </Link>
                </motion.div>
              ))}
              
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="pt-20"
              >
                  <div className="h-[1px] w-20 bg-accent/30 mx-auto mb-10" />
                  <div className="flex flex-col items-center gap-4 text-slate-500">
                    <span className="text-[10px] uppercase font-black tracking-[0.4em]">Exclusive Access</span>
                    <ShieldCheck size={20} className="text-accent" />
                  </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
