"use client";

import { useState, useEffect } from "react";
import { 
  Settings as SettingsIcon, 
  ShieldCheck, 
  Store, 
  MessageSquare, 
  Save, 
  Loader2, 
  CheckCircle2, 
  AlertCircle 
} from "lucide-react";
import { getSettings, updateSettings, changePassword } from "./actions";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"branding" | "security">("branding");
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Branding Form State
  const [brandingData, setBrandingData] = useState({
    storeName: "",
    storeDescription: "",
    supportWhatsApp: "",
  });

  // Security Form State
  const [securityData, setSecurityData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    const data = await getSettings() as any;
    if (data) {
      setBrandingData({
        storeName: data.storeName,
        storeDescription: data.storeDescription,
        supportWhatsApp: data.supportWhatsApp,
      });
    }
    setLoading(false);
  };

  const handleUpdateBranding = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    const res = await updateSettings(brandingData);
    if (res.success) {
      setMessage({ type: "success", text: "Configurações salvas com sucesso!" });
    } else {
      setMessage({ type: "error", text: res.error || "Erro ao salvar." });
    }
    setIsSaving(false);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (securityData.newPassword !== securityData.confirmPassword) {
      setMessage({ type: "error", text: "As senhas novas não coincidem." });
      return;
    }

    setIsSaving(true);
    setMessage(null);

    const res = await changePassword({
      oldPassword: securityData.oldPassword,
      newPassword: securityData.newPassword,
    });

    if (res.success) {
      setMessage({ type: "success", text: "Senha alterada com sucesso!" });
      setSecurityData({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } else {
      setMessage({ type: "error", text: res.error || "Erro ao alterar senha." });
    }
    setIsSaving(false);
  };

  if (loading) {
    return (
      <div className="p-20 flex flex-col items-center justify-center gap-4 text-slate-500">
        <Loader2 className="animate-spin text-accent" size={40} />
        <span className="font-mono text-xs uppercase tracking-[0.5em]">Carregando Configurações...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-8 animate-fade-in pb-20">
      <div>
        <h2 className="text-4xl font-black font-outfit uppercase italic tracking-tighter">
          Configurações <span className="text-accent">Globais</span>
        </h2>
        <p className="text-slate-500 font-mono text-xs uppercase tracking-widest mt-1">
          Personalize a identidade e segurança da sua loja
        </p>
      </div>

      <div className="flex gap-4">
        <button 
          onClick={() => { setActiveTab("branding"); setMessage(null); }}
          className={`flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-2xl border transition-all duration-300 font-bold uppercase tracking-wider text-xs ${
            activeTab === "branding" 
            ? "bg-accent/10 border-accent/20 text-accent" 
            : "bg-white/5 border-white/5 text-slate-500 hover:bg-white/10"
          }`}
        >
          <Store size={18} />
          Branding & Loja
        </button>
        <button 
          onClick={() => { setActiveTab("security"); setMessage(null); }}
          className={`flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-2xl border transition-all duration-300 font-bold uppercase tracking-wider text-xs ${
            activeTab === "security" 
            ? "bg-accent/10 border-accent/20 text-accent" 
            : "bg-white/5 border-white/5 text-slate-500 hover:bg-white/10"
          }`}
        >
          <ShieldCheck size={18} />
          Segurança (Senha)
        </button>
      </div>

      {message && (
        <div className={`p-4 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 border ${
          message.type === "success" 
          ? "bg-green-500/10 border-green-500/20 text-green-400" 
          : "bg-red-500/10 border-red-500/20 text-red-400"
        }`}>
          {message.type === "success" ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
          <span className="text-sm font-medium">{message.text}</span>
        </div>
      )}

      {activeTab === "branding" ? (
        <div className="glass-card p-8 md:p-12 animate-in fade-in duration-500 border-white/5">
           <form onSubmit={handleUpdateBranding} className="space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <Store size={14} className="text-accent" /> Nome da Loja
                </label>
                <input 
                  required
                  type="text" 
                  className="w-full bg-slate-900/50 border border-slate-700/50 rounded-2xl py-4 px-6 focus:border-accent outline-none transition-all placeholder:text-slate-700" 
                  placeholder="Premium Store"
                  value={brandingData.storeName}
                  onChange={(e) => setBrandingData({...brandingData, storeName: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <MessageSquare size={14} className="text-accent" /> WhatsApp de Suporte
                </label>
                <div className="relative">
                  <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 font-mono">+</span>
                  <input 
                    required
                    type="text" 
                    className="w-full bg-slate-900/50 border border-slate-700/50 rounded-2xl py-4 pl-10 pr-6 focus:border-accent outline-none transition-all placeholder:text-slate-700 font-mono" 
                    placeholder="5511999999999"
                    value={brandingData.supportWhatsApp}
                    onChange={(e) => setBrandingData({...brandingData, supportWhatsApp: e.target.value.replace(/\D/g, "")})}
                  />
                </div>
                <p className="text-[10px] text-slate-600 mt-2">Somente números, incluindo 55 (Brasil) e DDD.</p>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Descrição da Loja (SEO)</label>
                <textarea 
                  required
                  className="w-full bg-slate-900/50 border border-slate-700/50 rounded-2xl py-4 px-6 focus:border-accent outline-none transition-all h-32 placeholder:text-slate-700" 
                  placeholder="A melhor curadoria de itens premium..."
                  value={brandingData.storeDescription}
                  onChange={(e) => setBrandingData({...brandingData, storeDescription: e.target.value})}
                />
              </div>

              <button 
                disabled={isSaving}
                type="submit" 
                className="premium-button w-full py-5 flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {isSaving ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <Save size={20} />
                )}
                {isSaving ? "Salvando..." : "Salvar Configurações de Marca"}
              </button>
           </form>
        </div>
      ) : (
        <div className="glass-card p-8 md:p-12 animate-in fade-in duration-500 border-red-500/10">
           <div className="mb-8 flex items-center gap-4 text-red-500/40">
              <ShieldCheck size={32} />
              <p className="text-xs font-medium max-w-sm">
                A troca de senha é instantânea. Após alterada, você deverá usar a nova credencial no próximo acesso.
              </p>
           </div>

           <form onSubmit={handleChangePassword} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Senha Atual</label>
                <input 
                  required
                  type="password" 
                  className="w-full bg-slate-900/50 border border-slate-700/50 rounded-2xl py-4 px-6 focus:border-accent outline-none transition-all" 
                  value={securityData.oldPassword}
                  onChange={(e) => setSecurityData({...securityData, oldPassword: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Nova Senha</label>
                  <input 
                    required
                    type="password" 
                    className="w-full bg-slate-900/50 border border-slate-700/50 rounded-2xl py-4 px-6 focus:border-accent outline-none transition-all" 
                    value={securityData.newPassword}
                    onChange={(e) => setSecurityData({...securityData, newPassword: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Confirmar Nova Senha</label>
                  <input 
                    required
                    type="password" 
                    className="w-full bg-slate-900/50 border border-slate-700/50 rounded-2xl py-4 px-6 focus:border-accent outline-none transition-all" 
                    value={securityData.confirmPassword}
                    onChange={(e) => setSecurityData({...securityData, confirmPassword: e.target.value})}
                  />
                </div>
              </div>

              <button 
                disabled={isSaving}
                type="submit" 
                className="premium-button w-full py-5 bg-slate-900 border-red-500/20 text-red-500 hover:bg-red-500/10 flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {isSaving ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <ShieldCheck size={20} />
                )}
                {isSaving ? "Alterando..." : "Confirmar Troca de Senha"}
              </button>
           </form>
        </div>
      )}
    </div>
  );
}
