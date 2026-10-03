import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Wallet,
  Ticket,
  Building2,
  Landmark,
  BookOpen,
  FileCheck2,
  LineChart,
  FolderOpen,
  FileText,
  ShieldCheck,
  Settings,
  Users,
  ChevronDown,
  ChevronRight,
  SlidersHorizontal,
  ExternalLink,
  Bell,
  HardDrive,
  ShieldAlert,
  TrendingUp,
  Split,
  BrainCircuit,
} from 'lucide-react';
import { useUiStore } from '../../stores/ui.store';
import { useAuthStore } from '../../stores/auth.store';
import { PerfilUsuario } from '@diskingressos/types';

interface MenuItem {
  title: string;
  icon: React.ElementType;
  path?: string;
  badge?: string;
  requiredRole?: PerfilUsuario[];
  subItems?: { title: string; path: string; badge?: string }[];
}

const menuItems: MenuItem[] = [
  {
    title: 'Dashboard',
    icon: LayoutDashboard,
    path: '/dashboard',
  },
  {
    title: 'Financeiro',
    icon: Wallet,
    subItems: [
      { title: 'Receitas', path: '/financeiro/receitas' },
      { title: 'Contas a Receber', path: '/financeiro/contas-receber' },
      { title: 'Contas a Pagar', path: '/financeiro/contas-pagar' },
      { title: 'Pagamentos', path: '/financeiro/pagamentos' },
      { title: 'Repasses', path: '/financeiro/repasses' },
      { title: 'Fluxo de Caixa', path: '/financeiro/fluxo-caixa' },
      { title: 'Lotes CNAB 240', path: '/financeiro/cnab', badge: 'FEBRABAN' },
      { title: 'Alçadas & SoD', path: '/governanca/alcadas', badge: 'SoD' },
      { title: 'Assinaturas & Conta Azul', path: '/assinaturas', badge: 'Autentique' },
      { title: 'Antecipações & Travas', path: '/antecipacoes', badge: 'BCB' },
      { title: 'Split de Pagamento', path: '/split', badge: 'Nativo' },
    ],
  },
  {
    title: 'Eventos',
    icon: Ticket,
    subItems: [
      { title: 'Central de Fechamento', path: '/eventos/central-fechamento', badge: 'Núcleo' },
      { title: 'Visão Geral Eventos', path: '/eventos/lista' },
      { title: 'Vendas de Ingressos', path: '/eventos/vendas' },
      { title: 'Cancelamentos & Estornos', path: '/eventos/estornos' },
    ],
  },
  {
    title: 'Produtores',
    icon: Building2,
    path: '/produtores',
  },
  {
    title: 'Bancos & Tesouraria',
    icon: Landmark,
    subItems: [
      { title: 'Contas Bancárias', path: '/bancos/contas' },
      { title: 'Extratos & OFX', path: '/bancos/extratos' },
      { title: 'Conciliação Bancária', path: '/bancos/conciliacao' },
      { title: 'Gateways & Auditoria MDR', path: '/bancos/gateways' },
      { title: 'Open Finance & Pix (ITP)', path: '/open-finance', badge: 'SPI Bacen' },
      { title: 'IA Tesouraria & Yield', path: '/ai-tesouraria', badge: 'Preditiva' },
    ],
  },
  {
    title: 'Contabilidade',
    icon: BookOpen,
    subItems: [
      { title: 'Plano de Contas', path: '/contabilidade/plano-contas' },
      { title: 'Lançamentos (Partidas Dobradas)', path: '/contabilidade/lancamentos' },
      { title: 'Diário Contábil', path: '/contabilidade/diario' },
      { title: 'Razão Contábil', path: '/contabilidade/razao' },
      { title: 'Balancete', path: '/contabilidade/balancete' },
      { title: 'DRE Gerencial', path: '/contabilidade/dre' },
      { title: 'Fechamento & Travas', path: '/governanca/fechamento-mensal', badge: 'Travas' },
      { title: 'Exportações & Integrações', path: '/contabilidade/exportador', badge: 'Domínio' },
      { title: 'Disaster Recovery (DR)', path: '/disaster-recovery', badge: '5 Anos' },
    ],
  },
  {
    title: 'Fiscal & Tributário',
    icon: FileCheck2,
    subItems: [
      { title: 'Notas Fiscais (NFS-e)', path: '/fiscal/notas', badge: 'NFS-e' },
      { title: 'Apuração & Guias DAM/DARF', path: '/fiscal/apuracao' },
      { title: 'EFD-Reinf & SPED', path: '/fiscal/sped' },
      { title: 'Reforma Tributária 2026', path: '/reforma-tributaria', badge: 'EC 132' },
    ],
  },
  {
    title: 'BI Contábil',
    icon: LineChart,
    path: '/bi',
  },
  {
    title: 'Documentos / GED',
    icon: FolderOpen,
    path: '/documentos',
  },
  {
    title: 'Relatórios',
    icon: FileText,
    path: '/relatorios',
  },
  {
    title: 'Auditoria',
    icon: ShieldCheck,
    path: '/auditoria',
    requiredRole: [PerfilUsuario.ADMIN, PerfilUsuario.DIRETORIA],
  },
  {
    title: 'Disaster Recovery (5 Anos)',
    icon: HardDrive,
    path: '/disaster-recovery',
    badge: 'WORM',
    requiredRole: [PerfilUsuario.ADMIN, PerfilUsuario.DIRETORIA, PerfilUsuario.CONTABILIDADE],
  },
  {
    title: 'Governança & SoD',
    icon: ShieldAlert,
    path: '/governanca/alcadas',
    badge: 'Alçadas',
    requiredRole: [PerfilUsuario.ADMIN, PerfilUsuario.DIRETORIA, PerfilUsuario.FINANCEIRO],
  },
  {
    title: 'Assinaturas & Borderôs',
    icon: FileCheck2,
    path: '/assinaturas',
    badge: 'Autentique',
  },
  {
    title: 'Antecipações & Recebíveis',
    icon: TrendingUp,
    path: '/antecipacoes',
    badge: 'BCB 4734',
    requiredRole: [PerfilUsuario.ADMIN, PerfilUsuario.DIRETORIA, PerfilUsuario.FINANCEIRO],
  },
  {
    title: 'Split & Subadquirência',
    icon: Split,
    path: '/split',
    badge: 'Nativo',
    requiredRole: [PerfilUsuario.ADMIN, PerfilUsuario.DIRETORIA, PerfilUsuario.FINANCEIRO],
  },
  {
    title: 'Investidores & SCP',
    icon: Landmark,
    path: '/scp',
    badge: 'CC 991',
    requiredRole: [PerfilUsuario.ADMIN, PerfilUsuario.DIRETORIA, PerfilUsuario.FINANCEIRO, PerfilUsuario.CONTABILIDADE],
  },
  {
    title: 'IA Preditiva & Yield',
    icon: BrainCircuit,
    path: '/ai-tesouraria',
    badge: 'IA v2.4',
    requiredRole: [PerfilUsuario.ADMIN, PerfilUsuario.DIRETORIA, PerfilUsuario.FINANCEIRO],
  },
  {
    title: 'Usuários & Permissões',
    icon: Users,
    path: '/usuarios',
    requiredRole: [PerfilUsuario.ADMIN],
  },
  {
    title: 'Portal do Produtor',
    icon: ExternalLink,
    path: '/portal-produtor/dashboard',
    badge: 'Externo',
  },
  {
    title: 'Notificações & Webhooks',
    icon: Bell,
    path: '/notificacoes',
    badge: 'Live',
  },
  {
    title: 'Configurações',
    icon: Settings,
    path: '/configuracoes',
    requiredRole: [PerfilUsuario.ADMIN],
  },
];

export const Sidebar: React.FC = () => {
  const { sidebarOpen } = useUiStore();
  const { user, hasAnyRole } = useAuthStore();
  const [openSubMenus, setOpenSubMenus] = useState<Record<string, boolean>>({
    Financeiro: true,
    Eventos: true,
    Contabilidade: true,
    'Fiscal & Tributário': true,
  });

  const toggleSubMenu = (title: string) => {
    setOpenSubMenus((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-30 flex flex-col bg-slate-900 text-slate-300 transition-all duration-300 border-r border-slate-800 ${
        sidebarOpen ? 'w-64' : 'w-20'
      }`}
    >
      {/* Brand Header */}
      <div className="flex items-center h-16 px-4 bg-slate-950 border-b border-slate-800 gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-disk-600 text-white font-bold text-xl shadow-lg shadow-rose-900/40">
          D
        </div>
        {sidebarOpen && (
          <div className="flex flex-col">
            <span className="font-extrabold tracking-wide text-white text-base">
              DISK<span className="text-disk-500">INGRESSOS</span>
            </span>
            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">
              ERP Contábil Enterprise
            </span>
          </div>
        )}
      </div>

      {/* Menu List */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {menuItems.map((item) => {
          // Checa se o usuário tem permissão para ver este menu
          if (item.requiredRole && !hasAnyRole(item.requiredRole)) {
            return null;
          }

          const hasSubItems = !!item.subItems && item.subItems.length > 0;
          const isOpen = openSubMenus[item.title];

          if (!hasSubItems && item.path) {
            return (
              <NavLink
                key={item.title}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-disk-600 text-white shadow-sm'
                      : 'hover:bg-slate-800 hover:text-white text-slate-300'
                  }`
                }
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && (
                  <span className="flex-1 truncate">{item.title}</span>
                )}
                {sidebarOpen && item.badge && (
                  <span className="px-1.5 py-0.5 text-[10px] uppercase font-bold rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          }

          return (
            <div key={item.title} className="space-y-1">
              <button
                onClick={() => toggleSubMenu(item.title)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-800 hover:text-white text-slate-300 transition-colors"
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && (
                  <>
                    <span className="flex-1 text-left truncate">{item.title}</span>
                    {isOpen ? (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    )}
                  </>
                )}
              </button>

              {sidebarOpen && isOpen && item.subItems && (
                <div className="pl-9 pr-2 space-y-1">
                  {item.subItems.map((sub) => (
                    <NavLink
                      key={sub.path}
                      to={sub.path}
                      className={({ isActive }) =>
                        `flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                          isActive
                            ? 'bg-slate-800 text-disk-500 font-semibold'
                            : 'hover:bg-slate-800/60 hover:text-white text-slate-400'
                        }`
                      }
                    >
                      <span className="truncate">{sub.title}</span>
                      {sub.badge && (
                        <span className="px-1.5 py-0.5 text-[9px] uppercase font-bold rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          {sub.badge}
                        </span>
                      )}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* User profile footer */}
      {sidebarOpen && user && (
        <div className="p-3 m-3 rounded-lg bg-slate-950/80 border border-slate-800 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center font-bold text-white uppercase text-sm border border-slate-600">
            {user.nome.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white truncate">{user.nome}</p>
            <p className="text-[10px] text-slate-400 truncate font-mono">
              {user.roles.join(', ')}
            </p>
          </div>
        </div>
      )}
    </aside>
  );
};
