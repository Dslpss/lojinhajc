"use client";

import { Truck, ShieldCheck, CreditCard, Clock } from "lucide-react";
import { motion } from "framer-motion";

export default function TrustBar() {
  const benefits = [
    { 
      icon: Truck, 
      title: "Envio Expresso", 
      desc: "Entrega prioritária em todo o país",
      color: "text-blue-400"
    },
    { 
      icon: ShieldCheck, 
      title: "Compra Segura", 
      desc: "Ambiente 100% criptografado",
      color: "text-green-400"
    },
    { 
      icon: CreditCard, 
      title: "Pagamento Facilitado", 
      desc: "Até 12x sem juros no cartão",
      color: "text-emerald-400"
    },
    { 
      icon: Clock, 
      title: "Suporte WhatsApp", 
      desc: "Tire suas dúvidas na hora",
      color: "text-accent"
    },
  ];

  return (
    <section className="py-20 border-y border-white/5 bg-slate-900/20 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {benefits.map((benefit, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group flex items-start gap-4"
            >
              <div className={`p-4 rounded-2xl bg-white/5 border border-white/5 transition-all duration-500 group-hover:scale-110 group-hover:border-accent/20 group-hover:shadow-glow ${benefit.color}`}>
                <benefit.icon size={24} />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-black uppercase font-outfit tracking-wider text-white">
                  {benefit.title}
                </h3>
                <p className="text-[10px] uppercase font-mono tracking-widest text-slate-500 leading-relaxed">
                  {benefit.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
