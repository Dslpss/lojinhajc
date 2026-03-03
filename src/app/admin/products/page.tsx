"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Edit, Loader2, Image as ImageIcon, Check, X, Package, Upload, Box } from "lucide-react";
import { getProducts, createProduct, updateProduct, deleteProduct } from "./actions";
import Image from "next/image";

// 🤖 Applying knowledge of @frontend-specialist...

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    images: "", // String for the manual input
    description: "",
    category: "Geral",
    stock: "0",
    isFeatured: false,
    isPromo: false,
    promoPrice: "",
    technicalSpecs: "",
    condition: "Novo"
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const data = await getProducts();
    setProducts(data);
    setLoading(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const uploadData = new FormData();
    for (let i = 0; i < files.length; i++) {
      uploadData.append("files", files[i]);
    }

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: uploadData,
      });

      const result = await response.json();
      if (result.success) {
        // Append new URLs to current images string
        const currentImages = formData.images ? formData.images.split(",").map((u: string) => u.trim()).filter((u: string) => u) : [];
        const newImages = [...currentImages, ...result.urls];
        setFormData({ ...formData, images: newImages.join(", ") });
      } else {
        alert(result.error || "Erro no upload");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Falha na conexão com servidor de upload");
    } finally {
      setIsUploading(false);
      // Reset input
      if (e.target) e.target.value = "";
    }
  };

  const removeImage = (index: number) => {
    const currentImages = formData.images.split(",").map((u: string) => u.trim()).filter((u: string) => u);
    currentImages.splice(index, 1);
    setFormData({ ...formData, images: currentImages.join(", ") });
  };

  const handleEdit = (product: any) => {
    setEditingId(product.id);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      images: product.images.join(", "),
      description: product.description,
      category: product.category,
      stock: product.stock.toString(),
      isFeatured: product.isFeatured || false,
      isPromo: product.isPromo || false,
      promoPrice: product.promoPrice?.toString() || "",
      technicalSpecs: product.technicalSpecs || "",
      condition: product.condition || "Novo"
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Tem certeza que deseja excluir o produto "${name}"?`)) return;
    
    const res = await deleteProduct(id);
    if (res.success) {
      setProducts(products.filter(p => p.id !== id));
    } else {
      alert(res.error);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const dataToSend = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      images: formData.images.split(",").map((url: string) => url.trim()).filter((url: string) => url !== ""),
      category: formData.category,
      stock: parseInt(formData.stock),
      isFeatured: formData.isFeatured,
      isPromo: formData.isPromo,
      promoPrice: formData.isPromo ? parseFloat(formData.promoPrice) : null,
      technicalSpecs: formData.technicalSpecs,
      condition: formData.condition
    };

    let res;
    if (editingId) {
      res = await updateProduct(editingId, dataToSend);
    } else {
      res = await createProduct(dataToSend);
    }

    if (res.success) {
      setShowForm(false);
      setEditingId(null);
      setFormData({ 
        name: "", 
        price: "", 
        images: "", 
        description: "", 
        category: "Geral", 
        stock: "0",
        isFeatured: false,
        isPromo: false,
        promoPrice: "",
        technicalSpecs: "",
        condition: "Novo"
      });
      fetchProducts();
    } else {
      alert(res.error);
    }
    setIsSaving(false);
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ 
      name: "", 
      price: "", 
      images: "", 
      description: "", 
      category: "Geral", 
      stock: "0",
      isFeatured: false,
      isPromo: false,
      promoPrice: "",
      technicalSpecs: "",
      condition: "Novo"
    });
  };

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-4xl font-black font-outfit uppercase italic tracking-tighter">
            Gerenciar <span className="text-accent">Produtos</span>
          </h2>
          <p className="text-slate-500 font-mono text-xs uppercase tracking-widest mt-1">
            Controle de Inventário de Luxo
          </p>
        </div>
        <button 
          onClick={() => showForm ? resetForm() : setShowForm(true)}
          className={`premium-button flex items-center gap-2 px-8 py-4 ${showForm ? "bg-red-500/10 border-red-500/20 text-red-500" : ""}`}
        >
          {showForm ? <X size={20} /> : <Plus size={20} />}
          {showForm ? "Cancelar" : "Novo Produto"}
        </button>
      </div>

      {showForm && (
        <div className="glass-card p-8 md:p-12 animate-in slide-in-from-top-4 duration-500 border-accent/20">
          <div className="mb-8">
             <h3 className="text-xl font-bold font-outfit uppercase italic">
               {editingId ? "Editar Produto" : "Novo Cadastro"}
             </h3>
             <div className="h-1 w-12 bg-accent mt-2 rounded-full" />
          </div>

          <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Nome do Produto</label>
              <input 
                required
                type="text" 
                className="w-full bg-slate-900/50 border border-slate-700/50 rounded-2xl py-4 px-6 focus:border-accent outline-none transition-all placeholder:text-slate-700" 
                placeholder="Ex: iPhone 15 Pro Max Titanium"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Preço (R$)</label>
                <input 
                  required
                  type="number" 
                  step="0.01"
                  className="w-full bg-slate-900/50 border border-slate-700/50 rounded-2xl py-4 px-6 focus:border-accent outline-none transition-all" 
                  placeholder="0.00"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Estoque</label>
                <input 
                  required
                  type="number" 
                  className="w-full bg-slate-900/50 border border-slate-700/50 rounded-2xl py-4 px-6 focus:border-accent outline-none transition-all" 
                  placeholder="0"
                  value={formData.stock}
                  onChange={(e) => setFormData({...formData, stock: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Estado do Produto</label>
              <select 
                className="w-full bg-slate-900/50 border border-slate-700/50 rounded-2xl py-4 px-6 focus:border-accent outline-none transition-all appearance-none cursor-pointer text-slate-300"
                value={formData.condition}
                onChange={(e) => setFormData({...formData, condition: e.target.value})}
              >
                <option value="Novo">🔥 Novo (Lacre de Fábrica)</option>
                <option value="Vitrine">✨ Vitrine (Exposição)</option>
                <option value="Recondicionado">🛠️ Recondicionado (Grade A)</option>
                <option value="Usado">🏷️ Usado (Bem Preservado)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Categoria</label>
              <input 
                required
                type="text" 
                className="w-full bg-slate-900/50 border border-slate-700/50 rounded-2xl py-4 px-6 focus:border-accent outline-none transition-all" 
                placeholder="Ex: Smartphones"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
              />
            </div>
            
            <div className="md:col-span-2 space-y-4">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center justify-between">
                Imagens do Produto
                <span className="text-[8px] normal-case opacity-40 italic">Suporte para upload e links externos</span>
              </label>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Upload Zone */}
                <div className="relative group">
                  <input 
                    type="file" 
                    multiple
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    disabled={isUploading}
                  />
                  <div className={`h-32 border-2 border-dashed rounded-[2rem] flex flex-col items-center justify-center gap-2 transition-all group-hover:bg-accent/5 group-hover:border-accent/40 ${isUploading ? "border-accent animate-pulse" : "border-slate-800"}`}>
                    {isUploading ? (
                      <Loader2 className="animate-spin text-accent" size={24} />
                    ) : (
                      <Upload className="text-slate-600 group-hover:text-accent transition-colors" size={24} />
                    )}
                    <span className="text-[10px] font-bold text-slate-500 group-hover:text-accent transition-colors">
                      {isUploading ? "Subindo arquivos..." : "Subir do Computador"}
                    </span>
                  </div>
                </div>

                {/* Manual URL Input */}
                <div className="space-y-2">
                  <textarea 
                    className="w-full h-32 bg-slate-900/50 border border-slate-700/50 rounded-[2rem] py-4 px-6 focus:border-accent outline-none transition-all placeholder:text-slate-700 font-mono text-[10px] resize-none" 
                    placeholder="Ou cole links diretos aqui (separados por vírgula)..."
                    value={formData.images}
                    onChange={(e) => setFormData({...formData, images: e.target.value})}
                  />
                </div>
              </div>

              {/* Previews */}
              {formData.images && (
                <div className="flex flex-wrap gap-4 p-4 bg-slate-950/50 rounded-3xl border border-white/5">
                  {formData.images.split(",").map((url: string, idx: number) => url.trim() && (
                    <div key={idx} className="relative w-20 h-20 rounded-xl overflow-hidden border border-white/10 group">
                      <Image src={url.trim()} alt="Preview" fill className="object-cover" />
                      <button 
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute top-1 right-1 bg-red-500 p-1 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={10} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Descrição Comercial (Curta)</label>
              <textarea 
                required
                className="w-full bg-slate-900/50 border border-slate-700/50 rounded-2xl py-4 px-6 focus:border-accent outline-none transition-all h-24 placeholder:text-slate-700" 
                placeholder="Frase de impacto para o card..."
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                <Box size={12} />
                Ficha Técnica (Detalhada)
              </label>
              <textarea 
                className="w-full bg-indigo-500/5 border border-indigo-500/10 rounded-2xl py-4 px-6 focus:border-indigo-500 outline-none transition-all h-40 placeholder:text-slate-700 font-mono text-xs" 
                placeholder="Insira as especificações detalhadas, dimensões, peso, etc..."
                value={formData.technicalSpecs}
                onChange={(e) => setFormData({...formData, technicalSpecs: e.target.value})}
              />
            </div>

            {/* Featured & Promo Toggles */}
            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-8 p-6 bg-white/5 rounded-[2rem] border border-white/5 shadow-inner">
               <div className="flex items-center justify-between p-4 bg-slate-950/50 rounded-2xl border border-white/5">
                  <div className="space-y-1">
                     <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Produto em Destaque</p>
                     <p className="text-[8px] text-slate-600 uppercase">Aparece no topo da página inicial</p>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setFormData({...formData, isFeatured: !formData.isFeatured})}
                    className={`w-12 h-6 rounded-full transition-all relative ${formData.isFeatured ? "bg-accent shadow-[0_0_15px_rgba(56,189,248,0.4)]" : "bg-slate-800"}`}
                  >
                     <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${formData.isFeatured ? "left-7" : "left-1"}`} />
                  </button>
               </div>

               <div className="flex items-center justify-between p-4 bg-slate-950/50 rounded-2xl border border-white/5">
                  <div className="space-y-1">
                     <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Produto em Promoção</p>
                     <p className="text-[8px] text-slate-600 uppercase">Exibe selo de oferta e preço riscado</p>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setFormData({...formData, isPromo: !formData.isPromo})}
                    className={`w-12 h-6 rounded-full transition-all relative ${formData.isPromo ? "bg-accent shadow-[0_0_15px_rgba(56,189,248,0.4)]" : "bg-slate-800"}`}
                  >
                     <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${formData.isPromo ? "left-7" : "left-1"}`} />
                  </button>
               </div>

               {formData.isPromo && (
                  <div className="sm:col-span-2 space-y-2 animate-in slide-in-from-top-2 duration-300">
                    <label className="text-[10px] font-bold text-accent uppercase tracking-widest">Preço Promocional (R$)</label>
                    <input 
                      required={formData.isPromo}
                      type="number" 
                      step="0.01"
                      className="w-full bg-accent/5 border border-accent/20 rounded-2xl py-4 px-6 focus:border-accent outline-none transition-all text-accent font-bold" 
                      placeholder="0.00"
                      value={formData.promoPrice}
                      onChange={(e) => setFormData({...formData, promoPrice: e.target.value})}
                    />
                  </div>
               )}
            </div>
            <button 
              disabled={isSaving}
              type="submit" 
              className="premium-button md:col-span-2 py-5 flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {isSaving ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <Check size={20} />
              )}
              {isSaving ? "Processando..." : editingId ? "Atualizar Produto" : "Cadastrar Produto Real"}
            </button>
          </form>
        </div>
      )}

      {/* Tabela de Produtos Real */}
      <div className="glass-card overflow-hidden border-white/5">
        <div className="p-8 border-b border-white/5 bg-white/5 flex items-center justify-between">
            <h3 className="font-outfit font-black uppercase tracking-wider italic text-lg">Seu Inventário</h3>
            <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500 uppercase">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Sincronizado com MongoDB
            </div>
        </div>
        
        {loading ? (
          <div className="p-20 flex flex-col items-center justify-center gap-4 text-slate-500">
            <Loader2 className="animate-spin text-accent" size={40} />
            <span className="font-mono text-xs uppercase tracking-[0.5em]">Carregando Catálogo...</span>
          </div>
        ) : products.length === 0 ? (
          <div className="p-20 text-center space-y-4">
             <div className="inline-block p-6 rounded-full bg-white/5 text-slate-700">
               <Package size={48} />
             </div>
             <p className="text-slate-500 font-medium">Nenhum produto cadastrado no banco de dados.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-900/50 text-slate-500 text-[10px] font-black uppercase tracking-widest border-b border-white/5">
                <tr>
                  <th className="px-8 py-5">Visual</th>
                  <th className="px-8 py-5">Identificação</th>
                  <th className="px-8 py-5">Preço</th>
                  <th className="px-8 py-5">Status</th>
                  <th className="px-8 py-5 text-right">Controle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {products.map((product: any) => (
                  <tr key={product.id} className="group hover:bg-white/[0.02] transition-colors">
                    <td className="px-8 py-5">
                      <div className="w-16 h-16 rounded-2xl bg-slate-800 overflow-hidden relative border border-white/5">
                          {product.images?.[0] ? (
                            <Image 
                              src={product.images[0]} 
                              alt={product.name} 
                              fill 
                              className="object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-600">
                              <ImageIcon size={24} />
                            </div>
                          )}
                          <div className="absolute top-1 right-1 bg-black/60 rounded-full px-1.5 py-0.5 text-[8px] text-white">
                            {product.images?.length || 0}
                          </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <h4 className="font-bold text-white group-hover:text-accent transition-colors">{product.name}</h4>
                      <p className="text-slate-500 text-[10px] uppercase font-mono mt-1">{product.category}</p>
                    </td>
                    <td className="px-8 py-5 font-bold text-white tracking-tight">
                      R$ {product.price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex flex-col gap-2">
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                          product.stock > 0 ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${product.stock > 0 ? "bg-green-400" : "bg-red-400"}`} />
                          {product.stock} em estoque
                        </div>
                        {product.isFeatured && (
                          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-[9px] font-black uppercase tracking-widest border border-accent/20">
                            Destaque
                          </div>
                        )}
                        {product.isPromo && (
                          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 text-[9px] font-black uppercase tracking-widest border border-orange-500/20">
                            Em Promoção
                          </div>
                        )}
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 text-slate-400 text-[9px] font-black uppercase tracking-widest border border-white/10">
                          {product.condition || "Novo"}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex justify-end gap-3">
                        <button 
                          onClick={() => handleEdit(product)}
                          className="p-3 rounded-xl bg-slate-800/50 hover:bg-accent/10 hover:text-accent transition-all duration-300 border border-transparent hover:border-accent/20"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(product.id, product.name)}
                          className="p-3 rounded-xl bg-red-500/5 hover:bg-red-500/20 text-red-400/50 hover:text-red-400 transition-all duration-300 border border-transparent hover:border-red-500/20"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
