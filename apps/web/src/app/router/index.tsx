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

// FASE 8: Portal Contábil do Produtor
import { ProducerLayout } from '../../modules/producer-portal/ProducerLayout';
import { ProducerDashboardPage } from '../../modules/producer-portal/ProducerDashboardPage';
import { ProducerEventosPage } from '../../modules/producer-portal/ProducerEventosPage';
import { ProducerRepassesPage } from '../../modules/producer-portal/ProducerRepassesPage';
import { ProducerDocumentosPage } from '../../modules/producer-portal/ProducerDocumentosPage';
import { ProducerContaBancariaPage } from '../../modules/producer-portal/ProducerContaBancariaPage';

// FASE 9: Governança Contábil & Fechamento Mensal
import { FechamentoMensalPage } from '../../modules/governanca/FechamentoMensalPage';

// FASE 11: GED, CNAB 240 FEBRABAN & Configurações Globais
import { DocumentosGedPage } from '../../modules/ged/DocumentosGedPage';
import { CnabPage } from '../../modules/financeiro/CnabPage';
import { ConfiguracoesPage } from '../../modules/configuracoes/ConfiguracoesPage';

// FASE 12: Notificações em Tempo Real & Webhooks
import { NotificacoesPage } from '../../modules/notificacoes/NotificacoesPage';

// FASE 13: Exportadores Avançados & Integrações Externas
import { ExportadorPage } from '../../modules/exportador/ExportadorPage';

// FASE 14: Disaster Recovery, Backup & Retenção Contábil Legal (5 Anos)
import { DisasterRecoveryPage } from '../../modules/disaster-recovery/DisasterRecoveryPage';

// FASE 15: Governança Financeira, Matriz de Alçadas & SoD
import { GovernancaSodPage } from '../../modules/governanca-sod/GovernancaSodPage';

// FASE 16: Assinaturas Digitais Jurídicas, Borderôs Eletrônicos & Conta Azul
import { AssinaturasDigitaisPage } from '../../modules/assinaturas/AssinaturasDigitaisPage';

// FASE 17: Antecipações Financeiras, Cessão de Recebíveis & Travas Bancárias
import { AntecipacoesPage } from '../../modules/antecipacoes/AntecipacoesPage';

// FASE 18: Split de Pagamento Nativo em Gateway & Subadquirência
import { SplitPaymentPage } from '../../modules/split/SplitPaymentPage';

// FASE 19: Sociedades em Conta de Participação (SCP) & Investidores
import { ScpInvestorsPage } from '../../modules/scp/ScpInvestorsPage';

// FASE 20: Hub de Inteligência Tributária & Reforma Tributária 2026
import { TaxReformPage } from '../../modules/tax-reform/TaxReformPage';

// FASE 21: Tesouraria Descentralizada, Open Finance Brasil (ITP) & Pix Cobrança
import { OpenFinancePixPage } from '../../modules/open-finance/OpenFinancePixPage';

// FASE 22: Motor de Inteligência Artificial para Fluxo Preditivo & Yield Management
import { AiTreasuryPage } from '../../modules/ai-treasury/AiTreasuryPage';

// FASE 23: Auditoria Contínua com IA, Antifraude Sentinel & Compliance LGPD/CVM
import { AuditCompliancePage } from '../../modules/audit-compliance/AuditCompliancePage';

// FASE 24: Gateway Global Multi-Moeda, Conversão Cambial Spot & Hedge FX
import { GlobalFxPage } from '../../modules/global-fx/GlobalFxPage';

// FASE 25: Consolidação IFRS / CPC 36, Equivalência Patrimonial & Balanço Global
import { ConsolidationIfrsPage } from '../../modules/consolidation-ifrs/ConsolidationIfrsPage';

// FASE 26: Governança ESG, Pegada de Carbono & Borderô Verde
import { EsgSustainabilityPage } from '../../modules/esg-sustainability/EsgSustainabilityPage';

// FASE 27: Tokenização RWA, Recebíveis DREX & Smart Contracts
import { RwaDrexPage } from '../../modules/rwa-drex/RwaDrexPage';

// FASE 28: FIDC de Bilheteria & Entretenimento (Res. CVM 175)
import { FidcEntertainmentPage } from '../../modules/fidc-entertainment/FidcEntertainmentPage';

// FASE 29: Inteligência Regulamentar de IA Contábil, Fechamento Zero-Touch & Copilot CFO
import { AiAutonomousClosingPage } from '../../modules/ai-autonomous-closing/AiAutonomousClosingPage';

// FASE 30: Central de Observabilidade Executiva, Digital Boardroom & DFP CVM / Big Four
import { ExecutiveBoardroomPage } from '../../modules/executive-boardroom/ExecutiveBoardroomPage';




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

// Redirecionamento de Raiz inteligente baseado no Perfil
const RootRedirect: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  if (
    user?.roles.includes(PerfilUsuario.PRODUTOR) &&
    !user?.roles.includes(PerfilUsuario.ADMIN)
  ) {
    return <Navigate to="/portal-produtor/dashboard" replace />;
  }
  return <Navigate to="/dashboard" replace />;
};

export const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      {/* Módulo FASE 8: Portal Contábil do Produtor (Acesso Externo Restrito Multi-Tenant) */}
      <Route
        path="/portal-produtor"
        element={
          <ProtectedRoute>
            <ProducerLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/portal-produtor/dashboard" replace />} />
        <Route path="dashboard" element={<ProducerDashboardPage />} />
        <Route path="eventos" element={<ProducerEventosPage />} />
        <Route path="repasses" element={<ProducerRepassesPage />} />
        <Route path="documentos" element={<ProducerDocumentosPage />} />
        <Route path="conta-bancaria" element={<ProducerContaBancariaPage />} />
      </Route>

      {/* ERP Contábil / Financeiro Interno DiskIngressos */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<RootRedirect />} />
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
        <Route path="financeiro/cnab" element={<CnabPage />} />

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
        <Route path="contabilidade/fechamento" element={<FechamentoMensalPage />} />
        <Route path="governanca/fechamento-mensal" element={<FechamentoMensalPage />} />
        <Route path="contabilidade/exportador" element={<ExportadorPage />} />
        <Route path="exportador" element={<ExportadorPage />} />

        {/* Módulos FASE 14: Disaster Recovery, Backup & Retenção Legal (5 Anos) */}
        <Route path="disaster-recovery" element={<DisasterRecoveryPage />} />
        <Route path="governanca/disaster-recovery" element={<DisasterRecoveryPage />} />
        <Route path="backup" element={<DisasterRecoveryPage />} />

        {/* Módulos FASE 15: Governança Financeira, Matriz de Alçadas & SoD */}
        <Route path="governanca/alcadas" element={<GovernancaSodPage />} />
        <Route path="governanca-financeira" element={<GovernancaSodPage />} />
        <Route path="financeiro/alcadas" element={<GovernancaSodPage />} />

        {/* Módulos FASE 16: Assinaturas Digitais Jurídicas & Conta Azul */}
        <Route path="assinaturas" element={<AssinaturasDigitaisPage />} />
        <Route path="financeiro/assinaturas" element={<AssinaturasDigitaisPage />} />
        <Route path="integracoes/conta-azul" element={<AssinaturasDigitaisPage />} />

        {/* Módulos FASE 17: Antecipações Financeiras, Cessão de Recebíveis & Travas Bancárias */}
        <Route path="antecipacoes" element={<AntecipacoesPage />} />
        <Route path="financeiro/antecipacoes" element={<AntecipacoesPage />} />
        <Route path="cessao-recebiveis" element={<AntecipacoesPage />} />
        <Route path="travas-bancarias" element={<AntecipacoesPage />} />

        {/* Módulos FASE 18: Split de Pagamento Nativo em Gateway & Subadquirência */}
        <Route path="split" element={<SplitPaymentPage />} />
        <Route path="financeiro/split" element={<SplitPaymentPage />} />
        <Route path="gateways/split" element={<SplitPaymentPage />} />

        {/* Módulos FASE 19: Sociedades em Conta de Participação (SCP) & Investidores */}
        <Route path="scp" element={<ScpInvestorsPage />} />
        <Route path="scp-investidores" element={<ScpInvestorsPage />} />
        <Route path="investidores" element={<ScpInvestorsPage />} />
        <Route path="financeiro/investidores" element={<ScpInvestorsPage />} />

        {/* Módulos FASE 20: Hub de Inteligência Tributária & Reforma Tributária 2026 */}
        <Route path="reforma-tributaria" element={<TaxReformPage />} />
        <Route path="tax-reform" element={<TaxReformPage />} />
        <Route path="fiscal/reforma" element={<TaxReformPage />} />
        <Route path="fiscal/iva-dual" element={<TaxReformPage />} />

        {/* Módulos FASE 21: Tesouraria Descentralizada, Open Finance Brasil (ITP) & Pix Cobrança */}
        <Route path="open-finance" element={<OpenFinancePixPage />} />
        <Route path="pix-cobranca" element={<OpenFinancePixPage />} />
        <Route path="financeiro/open-finance" element={<OpenFinancePixPage />} />
        <Route path="financeiro/pix-cobranca" element={<OpenFinancePixPage />} />

        {/* Módulos FASE 22: Motor de Inteligência Artificial para Fluxo Preditivo & Yield Management */}
        <Route path="ai-tesouraria" element={<AiTreasuryPage />} />
        <Route path="ia-tesouraria" element={<AiTreasuryPage />} />
        <Route path="fluxo-preditivo" element={<AiTreasuryPage />} />
        <Route path="yield-management" element={<AiTreasuryPage />} />
        <Route path="financeiro/ai-tesouraria" element={<AiTreasuryPage />} />

        {/* Módulos FASE 23: Auditoria Contínua com IA, Antifraude Sentinel & Compliance LGPD/CVM */}
        <Route path="auditoria-ia" element={<AuditCompliancePage />} />
        <Route path="antifraude-sentinel" element={<AuditCompliancePage />} />
        <Route path="compliance-lgpd" element={<AuditCompliancePage />} />
        <Route path="governanca/compliance-lgpd" element={<AuditCompliancePage />} />
        <Route path="auditoria/continua" element={<AuditCompliancePage />} />

        {/* Módulos FASE 24: Gateway Global Multi-Moeda, Conversão Cambial Spot & Hedge FX */}
        <Route path="global-fx" element={<GlobalFxPage />} />
        <Route path="cambio-multimoeda" element={<GlobalFxPage />} />
        <Route path="vendas-internacionais" element={<GlobalFxPage />} />
        <Route path="financeiro/cambio" element={<GlobalFxPage />} />
        <Route path="financeiro/hedge" element={<GlobalFxPage />} />

        {/* Módulos FASE 25: Consolidação IFRS / CPC 36, Equivalência Patrimonial & Balanço Global */}
        <Route path="consolidacao-ifrs" element={<ConsolidationIfrsPage />} />
        <Route path="balanco-global" element={<ConsolidationIfrsPage />} />
        <Route path="demonstracoes-consolidadas" element={<ConsolidationIfrsPage />} />
        <Route path="contabilidade/consolidacao" element={<ConsolidationIfrsPage />} />
        <Route path="contabilidade/mep" element={<ConsolidationIfrsPage />} />

        {/* Módulos FASE 26: Governança ESG, Pegada de Carbono & Borderô Verde */}
        <Route path="esg-sustentabilidade" element={<EsgSustainabilityPage />} />
        <Route path="pegada-carbono" element={<EsgSustainabilityPage />} />
        <Route path="bordero-verde" element={<EsgSustainabilityPage />} />
        <Route path="sustentabilidade" element={<EsgSustainabilityPage />} />
        <Route path="governanca/esg" element={<EsgSustainabilityPage />} />

        {/* Módulos FASE 27: Tokenização RWA, Recebíveis DREX & Smart Contracts */}
        <Route path="rwa-drex" element={<RwaDrexPage />} />
        <Route path="tokenizacao" element={<RwaDrexPage />} />
        <Route path="mercado-secundario" element={<RwaDrexPage />} />
        <Route path="financeiro/rwa" element={<RwaDrexPage />} />
        <Route path="financeiro/drex" element={<RwaDrexPage />} />

        {/* Módulos FASE 28: FIDC de Bilheteria & Entretenimento (Res. CVM 175) */}
        <Route path="fidc-bilheteria" element={<FidcEntertainmentPage />} />
        <Route path="fundos-investimento" element={<FidcEntertainmentPage />} />
        <Route path="fidc" element={<FidcEntertainmentPage />} />
        <Route path="financeiro/fidc" element={<FidcEntertainmentPage />} />

        {/* Módulos FASE 29: Inteligência Regulamentar de IA Contábil, Swarm Zero-Touch & Copilot CFO */}
        <Route path="fechamento-ia" element={<AiAutonomousClosingPage />} />
        <Route path="ai-copilot" element={<AiAutonomousClosingPage />} />
        <Route path="zero-touch" element={<AiAutonomousClosingPage />} />
        <Route path="contabilidade/fechamento-ia" element={<AiAutonomousClosingPage />} />

        {/* Módulos FASE 30: Central de Observabilidade Executiva, Digital Boardroom & DFP CVM / Big Four */}
        <Route path="boardroom" element={<ExecutiveBoardroomPage />} />
        <Route path="digital-boardroom" element={<ExecutiveBoardroomPage />} />
        <Route path="governanca/boardroom" element={<ExecutiveBoardroomPage />} />
        <Route path="dfp-cvm" element={<ExecutiveBoardroomPage />} />





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

        {/* Módulos FASE 11: GED Digital & Parâmetros do ERP */}
        <Route path="documentos" element={<DocumentosGedPage />} />
        <Route
          path="configuracoes"
          element={
            <RoleRoute roles={[PerfilUsuario.ADMIN, PerfilUsuario.DIRETORIA]}>
              <ConfiguracoesPage />
            </RoleRoute>
          }
        />

        {/* Módulo FASE 12: Notificações em Tempo Real & Webhooks */}
        <Route path="notificacoes" element={<NotificacoesPage />} />

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
