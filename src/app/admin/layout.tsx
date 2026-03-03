"use client";

import Link from "next/link";
import { LayoutDashboard, Package, Settings, LogOut, Home } from "lucide-react";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Se não estiver na página de login, mostra o sidebar
  if (pathname === "/admin/login") return <>{children}</>;

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-800 bg-slate-900/50 backdrop-blur-xl p-6 flex flex-col justify-between">
        <div className="space-y-10">
          <div className="px-2">
            <h1 className="text-xl font-black font-outfit text-white tracking-widest uppercase">
              LOJA<span className="text-accent">PRO</span>
            </h1>
          </div>

          <nav className="space-y-2">
            {[
              { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
              { label: "Produtos", href: "/admin/products", icon: Package },
              { label: "Configurações", href: "/admin/settings", icon: Settings },
            ].map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    active 
                      ? "bg-accent/10 text-accent border border-accent/20" 
                      : "text-slate-400 hover:text-white hover:bg-slate-800"
                  }`}
                >
                  <item.icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="space-y-4">
          <Link href="/" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white">
            <Home size={20} />
            <span>Ver Loja</span>
          </Link>
          <button 
            onClick={() => signOut()}
            className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl w-full transition-colors"
          >
            <LogOut size={20} />
            <span>Sair</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
