import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/auth.store';
import {
  LayoutDashboard,
  Ticket,
  Wallet,
  FileText,
  Landmark,
  LogOut,
  Building2,
  ExternalLink,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

export const ProducerLayout: React.FC = () => {
  const { user, logout, hasAnyRole } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/portal-produtor/dashboard', icon: LayoutDashboard },
    { label: 'Meus Eventos & Vendas', path: '/portal-produtor/eventos', icon: Ticket },
    { label: 'Repasses & Borderôs', path: '/portal-produtor/repasses', icon: Wallet },
    { label: 'Notas Fiscais & Documentos', path: '/portal-produtor/documentos', icon: FileText },
    { label: 'Dados Bancários & PIX', path: '/portal-produtor/conta-bancaria', icon: Landmark },
  ];

  const canSwitchToInternalErp = hasAnyRole(['ADMIN' as any, 'DIRETORIA' as any, 'FINANCEIRO' as any]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      {/* Top Navbar */}
      <header className="h-16 bg-slate-950 border-b border-slate-800 flex items-center justify-between px-6 sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-black flex items-center justify-center text-sm shadow-md shadow-indigo-900/40">
              P
            </div>
            <div>
              <span className="font-extrabold tracking-wider text-white text-sm">
                DISK<span className="text-indigo-400">INGRESSOS</span>
              </span>
              <span className="ml-2 px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                PORTAL DO PRODUTOR
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2 pl-4 border-l border-slate-800 text-xs text-slate-400">
            <Building2 className="w-4 h-4 text-indigo-400" />
            <span className="font-semibold text-slate-200">
              {user?.nome || 'Produtor Autorizado'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {canSwitchToInternalErp && (
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 transition"
              title="Voltar para a área interna corporativa da DiskIngressos"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              ERP Interno
            </button>
          )}

          <div className="flex items-center gap-2 pl-2">
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs uppercase">
              {user?.nome?.charAt(0) || 'P'}
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition"
              title="Sair do Portal"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Subnav Menu Bar */}
      <nav className="bg-slate-950/80 border-b border-slate-800 px-6 overflow-x-auto">
        <div className="flex items-center gap-1 max-w-7xl mx-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-3 text-xs font-semibold whitespace-nowrap border-b-2 transition ${
                  isActive
                    ? 'border-indigo-500 text-indigo-400 bg-indigo-500/5'
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`
              }
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-6">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="py-4 border-t border-slate-800 text-center text-xs text-slate-500 bg-slate-950">
        DiskIngressos Portal Contábil do Produtor &copy; {new Date().getFullYear()} — Ambiente
        Seguro e Auditado
      </footer>
    </div>
  );
};
