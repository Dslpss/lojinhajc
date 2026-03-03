import { Plus, Package, TrendingUp, Users } from "lucide-react";
import Link from "next/link";
import { getProducts } from "../products/actions";

export default async function AdminDashboard() {
  const products = await getProducts();
  const totalProducts = products.length;
  const lowStock = products.filter(p => p.stock < 5).length;

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-black font-outfit uppercase italic italic tracking-tighter">Dashboard</h2>
        <Link 
          href="/admin/products"
          className="premium-button flex items-center gap-2 px-6 py-3"
        >
          <Plus size={20} />
          Novo Produto
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Total Produtos", value: totalProducts.toString(), icon: Package, color: "text-blue-400" },
          { label: "Estoque Baixo", value: lowStock.toString(), icon: TrendingUp, color: "text-orange-400" },
          { label: "Categorias", value: "Geral", icon: Users, color: "text-emerald-400" },
        ].map((stat, i) => (
          <div key={i} className="glass-card p-6 flex items-center gap-4 border-white/5 bg-slate-900/40">
            <div className={`p-4 rounded-2xl bg-slate-800/50 ${stat.color} border border-white/5`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-slate-500 text-[10px] font-mono uppercase tracking-widest">{stat.label}</p>
              <p className="text-2xl font-black font-outfit uppercase italic italic">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="glass-card overflow-hidden border-white/5 bg-slate-900/40">
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
            <h3 className="font-outfit font-black uppercase tracking-wider italic">Gerenciamento de Estoque</h3>
            <span className="text-[10px] text-slate-500 uppercase font-mono tracking-widest">Tempo Real</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-900/50 text-slate-500 text-[10px] font-black uppercase tracking-widest border-b border-white/5">
              <tr>
                <th className="px-6 py-4">Produto</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Preço</th>
                <th className="px-6 py-4">Stock</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {products.slice(0, 5).map((product: any) => (
                <tr key={product.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-4 font-bold text-white group-hover:text-accent transition-colors">{product.name}</td>
                  <td className="px-6 py-4">
                     {product.isFeatured && (
                        <span className="bg-accent/10 border border-accent/20 text-accent text-[8px] font-black uppercase px-2 py-0.5 rounded-full mr-2">Destaque</span>
                     )}
                     {product.isPromo && (
                        <span className="bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[8px] font-black uppercase px-2 py-0.5 rounded-full">Promoção</span>
                     )}
                  </td>
                  <td className="px-6 py-4 text-slate-300 font-mono text-sm">R$ {product.price.toLocaleString('pt-BR')}</td>
                  <td className={`px-6 py-4 font-black ${product.stock < 5 ? "text-red-400" : "text-green-400"}`}>
                    {product.stock}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link href="/admin/products" className="text-accent hover:underline text-[10px] font-black uppercase tracking-widest">
                      Gerenciar
                    </Link>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-slate-500 font-inter italic">Nenhum produto cadastrado</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
