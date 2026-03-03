"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Lock, User } from "lucide-react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    console.log("Iniciando login para:", email);
    
    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      console.log("Resultado do signIn:", res);

      if (res?.ok) {
          router.push("/admin/dashboard");
      } else {
          alert("Credenciais inválidas ou erro no servidor");
      }
    } catch (error) {
      console.error("Erro no login:", error);
      alert("Ocorreu um erro inesperado. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="glass-card max-w-md w-full p-10 space-y-8 animate-fade-in">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-black font-outfit uppercase tracking-widest">
            Admin <span className="text-accent">Panel</span>
          </h1>
          <p className="text-slate-400 text-sm">Acesse sua central de controle</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="relative">
              <User className="absolute left-3 top-3.5 text-slate-500" size={20} />
              <input
                type="text"
                placeholder="Usuário Admin"
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3 pl-10 pr-4 focus:border-accent outline-none transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 text-slate-500" size={20} />
              <input
                type="password"
                placeholder="Senha"
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3 pl-10 pr-4 focus:border-accent outline-none transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="premium-button w-full disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? "Autenticando..." : "Entrar no Sistema"}
          </button>
        </form>
      </div>
    </main>
  );
}
