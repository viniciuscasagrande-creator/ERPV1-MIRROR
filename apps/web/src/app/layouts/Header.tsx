import React, { useState, useEffect } from 'react';
import { Menu, Bell, Sun, Moon, LogOut, Shield, Building, Check, ExternalLink, ChevronRight } from 'lucide-react';
import { useUiStore } from '../../stores/ui.store';
import { useAuthStore } from '../../stores/auth.store';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { AppNotificationDto } from '@diskingressos/types';

export const Header: React.FC = () => {
  const { toggleSidebar, theme, toggleTheme } = useUiStore();
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotificationDto[]>([]);

  useEffect(() => {
    fetchHeaderNotifs();
  }, []);

  const fetchHeaderNotifs = async () => {
    try {
      const data: any = await api.get('/notifications?unreadOnly=true');
      if (Array.isArray(data)) {
        setNotifications(data.slice(0, 5));
      }
    } catch (err) {
      // Mock fallback suave para modo visualização
      setNotifications([
        {
          id: 'h-1',
          tipo: 'FECHAMENTO_EVENTO',
          titulo: 'Festival Rock Curitiba Fechado',
          mensagem: 'Todos os 9 portões de fechamento operacional foram validados.',
          severidade: 'SUCCESS',
          lida: false,
          linkAcao: '/eventos/central-fechamento',
          criadoEm: new Date().toISOString(),
        },
        {
          id: 'h-2',
          tipo: 'DIVERGENCIA_MDR',
          titulo: 'Alerta MDR - Stone',
          mensagem: 'Divergência de 0.75% detectada na liquidação de cartões.',
          severidade: 'CRITICAL',
          lida: false,
          linkAcao: '/bancos/gateways',
          criadoEm: new Date(Date.now() - 3600000).toISOString(),
        },
      ]);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const unreadCount = notifications.filter((n) => !n.lida).length;

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 flex items-center justify-between sticky top-0 z-20 transition-colors">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Alternar menu lateral"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Tenant Indicator */}
        {user?.producerName ? (
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs font-medium">
            <Building className="w-3.5 h-3.5" />
            <span>Produtor: <strong>{user.producerName}</strong></span>
          </div>
        ) : (
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold">
            <Shield className="w-3.5 h-3.5 text-disk-600" />
            <span>DiskIngressos Corporativo</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Alternar modo claro / escuro"
        >
          {theme === 'light' ? (
            <Moon className="w-5 h-5" />
          ) : (
            <Sun className="w-5 h-5 text-amber-400" />
          )}
        </button>

        {/* Notificações Interativas com Dropdown */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
            title="Notificações operacionais"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-disk-600 text-white font-bold text-[10px] flex items-center justify-center border-2 border-white dark:border-slate-900">
                {unreadCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 z-50 overflow-hidden animate-fade-in">
              <div className="p-3 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Alertas em Tempo Real
                </span>
                <span className="text-[11px] font-mono text-disk-500 font-semibold">
                  {unreadCount} novas
                </span>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-800/80 max-h-72 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-400">
                    Nenhum alerta pendente no momento.
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        if (n.linkAcao) {
                          navigate(n.linkAcao);
                          setNotifOpen(false);
                        }
                      }}
                      className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {n.titulo}
                        </span>
                        <span
                          className={`w-2 h-2 rounded-full flex-shrink-0 ${
                            n.severidade === 'CRITICAL'
                              ? 'bg-rose-500'
                              : n.severidade === 'WARNING'
                              ? 'bg-amber-500'
                              : 'bg-emerald-500'
                          }`}
                        />
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                        {n.mensagem}
                      </p>
                    </div>
                  ))
                )}
              </div>

              <div className="p-2.5 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 text-center">
                <button
                  onClick={() => {
                    navigate('/notificacoes');
                    setNotifOpen(false);
                  }}
                  className="w-full text-xs font-semibold text-disk-600 dark:text-disk-400 hover:underline flex items-center justify-center gap-1"
                >
                  <span>Ver Central de Alertas e Webhooks</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-1" />

        {/* User Card & Logout */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 leading-none">
              {user?.nome}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
              {user?.cargo}
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
            title="Sair do sistema"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden md:inline">Sair</span>
          </button>
        </div>
      </div>
    </header>
  );
};
