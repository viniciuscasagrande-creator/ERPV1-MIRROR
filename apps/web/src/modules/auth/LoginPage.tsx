import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/auth.store';
import { api } from '../../services/api';
import { Lock, Mail, ArrowRight, ShieldCheck, UserCheck, AlertCircle } from 'lucide-react';
import { LoginResponse, PerfilUsuario } from '@diskingressos/types';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await api.post<any, LoginResponse>('/auth/login', { email, senha });
      setAuth(response.user, response.tokens);
      if (
        response.user.roles.includes(PerfilUsuario.PRODUTOR) &&
        !response.user.roles.includes(PerfilUsuario.ADMIN)
      ) {
        navigate('/portal-produtor/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      console.error(err);
      setError(
        err.response?.data?.message || 'Falha ao autenticar. Verifique suas credenciais.',
      );
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (demoEmail: string) => {
    setEmail(demoEmail);
    setSenha('demo123');
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-900">
      {/* Coluna Esquerda - Apresentação Institucional */}
      <div className="md:w-1/2 p-8 md:p-16 flex flex-col justify-between bg-gradient-to-br from-slate-950 via-slate-900 to-rose-950 text-white border-r border-slate-800">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-disk-600 text-white font-extrabold text-2xl shadow-xl shadow-rose-900/50">
              D
            </div>
            <div>
              <span className="text-2xl font-black tracking-wider">
                DISK<span className="text-disk-500">INGRESSOS</span>
              </span>
              <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold">
                ERP Contábil & Financeiro Enterprise
              </p>
            </div>
          </div>

          <div className="mt-16 space-y-6">
            <h1 className="text-3xl md:text-4xl font-extrabold leading-tight">
              Governança Contábil, Segregação de Terceiros e Central de Fechamento.
            </h1>
            <p className="text-slate-400 text-sm md:text-base leading-relaxed">
              Plataforma financeira de alta precisão desenhada para o ecossistema de bilheteria:
              vendas multi-canal, conciliação de adquirentes, partidas dobradas e liquidação transparente para produtores.
            </p>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
          <span>Disk Ingressos © 2026 — Todos os direitos reservados</span>
          <span>Ambiente Seguro TLS 1.3 / ISO 27001</span>
        </div>
      </div>

      {/* Coluna Direita - Formulário de Login */}
      <div className="md:w-1/2 flex items-center justify-center p-8 md:p-16 bg-slate-950">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Acesso ao Sistema
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Informe suas credenciais corporativas para acessar o painel.
            </p>
          </div>

          {error && (
            <div className="p-4 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-start gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">
                E-mail Corporativo
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="usuario@diskingressos.com.br"
                  className="w-full pl-11 pr-4 py-3 rounded-lg bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-disk-600 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">
                Senha
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3 rounded-lg bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-disk-600 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-lg bg-disk-600 hover:bg-disk-700 text-white font-semibold text-sm shadow-lg shadow-rose-900/40 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {loading ? (
                <span>Autenticando...</span>
              ) : (
                <>
                  <span>Entrar no ERP</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Cards de Demonstração Rápida */}
          <div className="pt-6 border-t border-slate-800">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Perfis de Demonstração (Clique para preencher):
            </p>
            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('admin@diskingressos.com.br')}
                className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-left transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-disk-500" />
                  <div>
                    <p className="text-xs font-semibold text-white">Admin Master Disk</p>
                    <p className="text-[11px] text-slate-400 font-mono">admin@diskingressos.com.br</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300">
                  ADMIN
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('karine@diskingressos.com.br')}
                className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-left transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <UserCheck className="w-4 h-4 text-sky-400" />
                  <div>
                    <p className="text-xs font-semibold text-white">Karine Santos (Financeiro)</p>
                    <p className="text-[11px] text-slate-400 font-mono">karine@diskingressos.com.br</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-500/20 text-sky-300">
                  FINANCEIRO
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('produtor@demo.disk')}
                className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-left transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <UserCheck className="w-4 h-4 text-emerald-400" />
                  <div>
                    <p className="text-xs font-semibold text-white">Produtor Externo (Curitiba Shows)</p>
                    <p className="text-[11px] text-slate-400 font-mono">produtor@demo.disk</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                  PRODUTOR
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
