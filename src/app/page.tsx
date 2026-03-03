import Image from "next/image";
import ProductCard from "@/components/ProductCard";
import FeaturedProduct from "@/components/FeaturedProduct";
import TrustBar from "@/components/TrustBar";
import { getProducts } from "./admin/products/actions";
import { getSettings } from "./admin/settings/actions";
import FeaturedSlider from "@/components/FeaturedSlider";
import { ArrowRight, ShoppingBag } from "lucide-react";

export default async function Home() {
  const dbProducts = await getProducts();
  const settings = await getSettings();
  
  const storeName = (settings as any)?.storeName || "Premium Store";
  const whatsapp = (settings as any)?.supportWhatsApp || "5511999999999";
  
  const allProducts = dbProducts.filter((p: any) => p.stock > 0);
  const featuredProducts = allProducts.filter((p: any) => p.isFeatured);
  const gridProducts = allProducts.filter((p: any) => !p.isFeatured);

  return (
    <main className="min-h-screen bg-slate-950 overflow-x-hidden">
      {/* Hero / Slider Section */}
      {featuredProducts.length > 0 ? (
        <section className="relative pt-32 pb-20 overflow-hidden">
          <FeaturedSlider products={featuredProducts as any} whatsapp={whatsapp} />
        </section>
      ) : (
        <section className="relative min-h-screen flex items-center pt-32 pb-20 overflow-hidden">
          {/* Abstract Background */}
          <div className="absolute top-0 right-0 w-[60%] h-full bg-accent/5 skew-x-12 translate-x-1/4 -z-10 blur-[100px]" />
          <div className="absolute -bottom-1/4 left-0 w-[40%] h-1/2 bg-slate-500/10 rounded-full blur-[120px] -z-10" />
          
          <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-12 gap-20 items-center">
            <div className="lg:col-span-12 xl:col-span-7 space-y-10 z-10 reveal">
              <div className="space-y-4">
                 <div className="flex items-center gap-3 reveal stagger-1">
                    <div className="h-[2px] w-12 bg-accent" />
                    <span className="text-accent font-black tracking-[0.4em] uppercase text-[10px]">O Futuro é Agora</span>
                 </div>
                <h1 className="text-7xl md:text-[10rem] font-black font-outfit tracking-tighter leading-[0.75] text-white reveal stagger-1 transition-all duration-700 hover:tracking-[-0.05em]">
                  CADA <br />
                  DETALHE <span className="text-gradient underline decoration-accent/30 underline-offset-[20px]">CONTA</span>
                </h1>
              </div>
              
              <p className="text-xl md:text-2xl text-slate-500 max-w-2xl font-inter leading-relaxed reveal stagger-2">
                Os melhores eletrônicos com garantia e o menor preço do mercado. 
                <span className="text-white font-bold ml-2">Qualidade que você conhece, preço que você pode pagar.</span>
              </p>
              
              <div className="pt-10 flex flex-wrap items-center gap-8 reveal stagger-3">
                <button className="premium-button flex items-center gap-4 group">
                  Descobrir Agora
                  <ArrowRight size={18} className="transition-transform group-hover:translate-x-2" />
                </button>
                <div className="flex -space-x-4">
                   {[1,2,3].map(i => (
                      <div key={i} className="w-12 h-12 rounded-full border-2 border-slate-950 bg-slate-800 overflow-hidden ring-4 ring-white/5">
                         <Image src={`https://i.pravatar.cc/150?u=${i}`} alt="usuário" width={48} height={48} />
                      </div>
                   ))}
                   <div className="w-12 h-12 rounded-full border-2 border-slate-950 bg-accent flex items-center justify-center text-[10px] font-black text-slate-950 z-10 ring-4 ring-white/5">
                      +5k
                   </div>
                </div>
                <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest max-w-[100px] leading-tight opacity-50">Clientes satisfeitos em todo o Brasil</span>
              </div>
            </div>
          </div>

          {/* Floating Background Brand - Watermark */}
          <div className="absolute top-1/2 -translate-y-1/2 right-[-10%] hidden md:block -z-20 pointer-events-none transition-all duration-1000">
            <div className="reveal stagger-3">
              <div className="rotate-90 origin-center whitespace-nowrap opacity-15">
                <span className="text-[10rem] font-black font-outfit text-transparent border-text uppercase tracking-[0.1em]">
                  {storeName}
                </span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Trust Benefits Bar */}
      <TrustBar />

      {/* Collections Grid */}
      <section className="max-w-7xl mx-auto px-6 py-40">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-32 gap-10 reveal">
          <div className="space-y-6">
            <h2 className="text-6xl md:text-8xl font-black font-outfit tracking-tighter text-white uppercase italic">Ofertas<span className="text-accent">.</span></h2>
            <div className="h-1 w-40 bg-accent shadow-glow" />
          </div>
          <p className="text-slate-500 text-xl max-w-sm font-inter italic">
            Tecnologia moderna com <span className="text-white font-bold">preço justo</span> e facilidade no pagamento.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {gridProducts.length > 0 ? gridProducts.map((product: any, idx: number) => (
            <div key={idx} className="reveal" style={{ animationDelay: `${idx * 0.15}s` }}>
               <ProductCard 
                  name={product.name}
                  price={product.price}
                  promoPrice={product.promoPrice}
                  isPromo={product.isPromo}
                  images={product.images}
                   description={product.description}
                   whatsapp={whatsapp}
                   stock={product.stock}
                   technicalSpecs={product.technicalSpecs}
                   condition={product.condition}
                />
            </div>
          )) : (
            <div className="col-span-full py-20 text-center space-y-4">
              <div className="flex justify-center">
                <ShoppingBag size={48} className="text-slate-800" />
              </div>
              <p className="text-slate-500 font-inter italic">Novos produtos estão sendo preparados para você. Volte em breve!</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Footer Section */}
      <section className="py-40 border-t border-white/5 relative overflow-hidden">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-accent/5 blur-[120px] rounded-full -z-10" />
         <div className="max-w-4xl mx-auto px-6 text-center space-y-12 reveal">
            <h2 className="text-5xl md:text-7xl font-black font-outfit tracking-tighter text-white uppercase">Promoções por <span className="text-accent">E-mail</span></h2>
            <p className="text-xl text-slate-500 font-inter">Receba ofertas exclusivas e cupons de desconto direto na sua caixa de entrada.</p>
            <div className="flex justify-center">
               <form className="relative flex flex-col items-center">
                 <label htmlFor="promo-email" className="sr-only">E-mail para promoções</label>
                 <input id="promo-email" type="email" placeholder="Seu melhor e-mail" className="sr-only" />
                 <button className="premium-button py-6 px-16 group hover:scale-110 flex items-center gap-4 transition-all">
                    Receber Acesso VIP
                    <ArrowRight size={20} className="transition-transform group-hover:rotate-[-45deg]" />
                 </button>
               </form>
            </div>
         </div>
      </section>

      {/* Footer */}
      <footer className="py-10 bg-black border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-xl font-black tracking-tighter text-white italic">
            {storeName.toUpperCase()}<span className="text-accent text-3xl">.</span>
          </div>
          <div className="text-slate-600 text-[10px] font-mono tracking-[0.3em] uppercase text-center md:text-right">
            &copy; 2025 {storeName}. Excelência em Performance Exclusiva.
          </div>
        </div>
      </footer>
    </main>
  );
}
