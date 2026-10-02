import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from '../layouts/AppLayout';
import { LoginPage } from '../../modules/auth/LoginPage';
import { DashboardPage } from '../../modules/dashboard/DashboardPage';
import { UsersPage } from '../../modules/users/UsersPage';
import { AuditPage } from '../../modules/audit/AuditPage';
import { EventosPage } from '../../modules/eventos/EventosPage';
import { CentralFechamentoPage } from '../../modules/eventos/CentralFechamentoPage';
import { ProdutoresPage } from '../../modules/produtores/ProdutoresPage';
import { VendasPage } from '../../modules/vendas/VendasPage';
import { ContasReceberPage } from '../../modules/financeiro/ContasReceberPage';
import { ContasPagarPage } from '../../modules/financeiro/ContasPagarPage';
import { RepassesPage } from '../../modules/financeiro/RepassesPage';
import { FluxoCaixaPage } from '../../modules/financeiro/FluxoCaixaPage';
import { ContasBancariasPage } from '../../modules/bancos/ContasBancariasPage';
import { ConciliacaoBancariaPage } from '../../modules/bancos/ConciliacaoBancariaPage';
import { GatewaysAuditoriaPage } from '../../modules/bancos/GatewaysAuditoriaPage';
import { PlanoContasPage } from '../../modules/contabilidade/PlanoContasPage';
import { LivroDiarioPage } from '../../modules/contabilidade/LivroDiarioPage';
import { BalancetePage } from '../../modules/contabilidade/BalancetePage';
import { DreOficialPage } from '../../modules/contabilidade/DreOficialPage';
import { NotasFiscaisPage } from '../../modules/fiscal/NotasFiscaisPage';
import { ApuracaoTributariaPage } from '../../modules/fiscal/ApuracaoTributariaPage';
import { SpedObrigacoesPage } from '../../modules/fiscal/SpedObrigacoesPage';
import { BiDashboardPage } from '../../modules/bi/BiDashboardPage';
import { RelatoriosPage } from '../../modules/relatorios/RelatoriosPage';
import { useAuthStore } from '../../stores/auth.store';
import { PerfilUsuario } from '@diskingressos/types';

// Guard de Rota Protegida (Requer Autenticação)
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

// Guard de Role
const RoleRoute: React.FC<{ roles: PerfilUsuario[]; children: React.ReactNode }> = ({
  roles,
  children,
}) => {
  const hasAnyRole = useAuthStore((state) => state.hasAnyRole);
  if (!hasAnyRole(roles)) {
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
};

export const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />

        {/* Módulos FASE 2: Operações Core, Eventos & Produtores */}
        <Route path="eventos/lista" element={<EventosPage />} />
        <Route path="eventos/central-fechamento" element={<CentralFechamentoPage />} />
        <Route path="eventos/vendas" element={<VendasPage />} />
        <Route path="produtores" element={<ProdutoresPage />} />

        {/* Módulos FASE 3: Financeiro, Tesouraria & Repasses */}
        <Route path="financeiro/receitas" element={<VendasPage />} />
        <Route path="financeiro/contas-receber" element={<ContasReceberPage />} />
        <Route path="financeiro/contas-pagar" element={<ContasPagarPage />} />
        <Route path="financeiro/pagamentos" element={<ContasPagarPage />} />
        <Route path="financeiro/repasses" element={<RepassesPage />} />
        <Route path="financeiro/fluxo-caixa" element={<FluxoCaixaPage />} />

        {/* Módulos FASE 4: Bancos, Conciliação OFX & Gateways */}
        <Route path="bancos/contas" element={<ContasBancariasPage />} />
        <Route path="bancos/extratos" element={<ConciliacaoBancariaPage />} />
        <Route path="bancos/conciliacao" element={<ConciliacaoBancariaPage />} />
        <Route path="bancos/gateways" element={<GatewaysAuditoriaPage />} />

        {/* Módulos FASE 5: Contabilidade Oficial DiskIngressos */}
        <Route path="contabilidade/plano-contas" element={<PlanoContasPage />} />
        <Route path="contabilidade/lancamentos" element={<LivroDiarioPage />} />
        <Route path="contabilidade/diario" element={<LivroDiarioPage />} />
        <Route path="contabilidade/balancete" element={<BalancetePage />} />
        <Route path="contabilidade/razao" element={<BalancetePage />} />
        <Route path="contabilidade/dre" element={<DreOficialPage />} />

        {/* Módulos FASE 6: Fiscal, Tributário, NF-e / NFS-e & SPED */}
        <Route path="fiscal" element={<NotasFiscaisPage />} />
        <Route path="fiscal/notas" element={<NotasFiscaisPage />} />
        <Route path="fiscal/apuracao" element={<ApuracaoTributariaPage />} />
        <Route path="fiscal/guias" element={<ApuracaoTributariaPage />} />
        <Route path="fiscal/retencoes" element={<ApuracaoTributariaPage />} />
        <Route path="fiscal/sped" element={<SpedObrigacoesPage />} />

        {/* Módulos FASE 7: BI Contábil, Relatórios & Auditoria */}
        <Route path="bi" element={<BiDashboardPage />} />
        <Route path="relatorios" element={<RelatoriosPage />} />
        <Route path="relatorios/dre" element={<RelatoriosPage />} />
        <Route path="relatorios/vendas" element={<RelatoriosPage />} />
        <Route path="relatorios/repasses" element={<RelatoriosPage />} />

        {/* Módulos FASE 1: Governança & Auditoria */}
        <Route
          path="usuarios"
          element={
            <RoleRoute roles={[PerfilUsuario.ADMIN]}>
              <UsersPage />
            </RoleRoute>
          }
        />
        <Route
          path="auditoria"
          element={
            <RoleRoute roles={[PerfilUsuario.ADMIN, PerfilUsuario.DIRETORIA]}>
              <AuditPage />
            </RoleRoute>
          }
        />

        {/* Fallback para rotas em estruturação (Fases 3 a 10) */}
        <Route
          path="*"
          element={
            <div className="p-8 text-center space-y-4">
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">
                Módulo em Estruturação (Fases 3 a 10)
              </h2>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                Este módulo está mapeado na arquitetura e será conectado diretamente aos dados reais da Fase 2.
              </p>
            </div>
          }
        />
      </Route>
    </Routes>
  );
};
