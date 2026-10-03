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
import { MarketingPage } from '../../modules/marketing/MarketingPage';
import { RemarketingPage } from '../../modules/remarketing/RemarketingPage';
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

// FASE 31: Pix Automático, Débito Recorrente BCB 430/431 & Smart Retries SPI
import { PixAutomaticoPage } from '../../modules/pix-automatico/PixAutomaticoPage';

// FASE 32: Split Payment Tributário Inteligente no Checkout (PLP 68/2024 & Comitê Gestor IBS/CBS)
import { TaxSplitCheckoutPage } from '../../modules/tax-split-checkout/TaxSplitCheckoutPage';

// FASE 33: DRE & Balancete por Centro de Custo de Evento com Alocação Matricial e Custeio ABC
import { EventCostCenterDrePage } from '../../modules/cost-center-dre/EventCostCenterDrePage';

// FASE 34: Conciliação Bancária Autônoma Contínua via IA, Reconhecimento de Tarifas & Repasses D+0
import { AiBankReconciliationPage } from '../../modules/ai-reconciliation/AiBankReconciliationPage';

// FASE 35: Gestão Orçamentária Corporativa, Budget vs Actual & Rolling Forecast
import { BudgetForecastPage } from '../../modules/budget-forecast/BudgetForecastPage';

// FASE 36: Auditoria de Borderô Físico-Digital com Assinatura ICP-Brasil & ITI
import { BorderoIcpSignaturePage } from '../../modules/bordero-signature/BorderoIcpSignaturePage';

// FASE 37: Central de Gestão & Apuração ECAD / Direitos Autorais
import { EcadCopyrightPage } from '../../modules/ecad-copyright/EcadCopyrightPage';

// FASE 38: Prevenção à Lavagem de Dinheiro (PLD-FT), COAF & Bacen 3.978/2020
import { PldCoafCompliancePage } from '../../modules/pld-coaf/PldCoafCompliancePage';

// FASE 39: Liquidação Interbancária Contínua SPI / STR & Mensageria ISO 20022
import { Iso20022SettlementPage } from '../../modules/iso20022-settlement/Iso20022SettlementPage';

// FASE 40: Suíte Soberana de Auditoria Contínua & War Room da Diretoria / CFO
import { SovereignWarRoomPage } from '../../modules/sovereign-war-room/SovereignWarRoomPage';

// FASE 41: Motor de Precificação Dinâmica & Yield Management com IA
import { DynamicPricingPage } from '../../modules/dynamic-pricing/DynamicPricingPage';

// FASE 42: Gestão de Royalties & Direitos de Imagem de Artistas Internacionais
import { ArtistRoyaltiesPage } from '../../modules/artist-royalties/ArtistRoyaltiesPage';

// FASE 43: Hub de Fidelidade, Cashback & Passivo Circulante CPC 47 / IFRS 15
import { LoyaltyIfrs15Page } from '../../modules/loyalty-ifrs15/LoyaltyIfrs15Page';

// FASE 44: Gestão Contábil de PDVs Físicos, Totens & Sangria de Caixa com Custódia
import { PosCashierPage } from '../../modules/pos-cashier/PosCashierPage';

// FASE 45: Central de Seguros de Ingressos, Proteção de Reembolso & Sinistros SUSEP
import { TicketInsurancePage } from '../../modules/ticket-insurance/TicketInsurancePage';

// FASE 46: Gestão de A&B, Cashless RFID / NFC & Estoque SPED Bloco K
import { CashlessInventoryPage } from '../../modules/cashless-inventory/CashlessInventoryPage';

// FASE 47: Cobrança Judicial, Recuperação de Crédito & PECLD (IFRS 9 / CPC 48)
import { DebtRecoveryPage } from '../../modules/debt-recovery/DebtRecoveryPage';

// FASE 48: Patrocínios Corporativos, Naming Rights & Barter (IFRS 15)
import { SponsorshipBarterPage } from '../../modules/sponsorship-barter/SponsorshipBarterPage';

// FASE 49: Logística de Turnês, Frota & Contratos IFRS 16
import { TourFleetPage } from '../../modules/tour-fleet/TourFleetPage';

// FASE 50: Governança SOX 404, PCAOB & IPO Dual-Listing (B3 / NYSE)
import { SoxIpoPage } from '../../modules/sox-ipo/SoxIpoPage';




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

        {/* Módulos FASE 2 & HUB 360: Operações Core, Eventos & Produtores */}
        <Route path="eventos/lista" element={<EventosPage />} />
        <Route path="eventos/central-fechamento" element={<CentralFechamentoPage />} />
        <Route path="eventos/vendas" element={<VendasPage />} />
        <Route path="produtores" element={<ProdutoresPage />} />
        <Route path="produtores/contratos" element={<ProdutoresPage />} />
        <Route path="produtores/antecipacoes" element={<ProdutoresPage />} />
        <Route path="produtores/borderos" element={<ProdutoresPage />} />
        <Route path="produtores/escrow" element={<ProdutoresPage />} />
        <Route path="produtores/compliance" element={<ProdutoresPage />} />

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

        {/* Módulos FASE 31: Pix Automático, Débito Recorrente BCB 430/431 & Smart Retries SPI */}
        <Route path="pix-automatico" element={<PixAutomaticoPage />} />
        <Route path="recorrencia-pix" element={<PixAutomaticoPage />} />
        <Route path="financeiro/pix-automatico" element={<PixAutomaticoPage />} />

        {/* Módulos FASE 32: Split Payment Tributário Inteligente no Checkout (PLP 68/2024 & Comitê Gestor IBS/CBS) */}
        <Route path="split-tributario" element={<TaxSplitCheckoutPage />} />
        <Route path="reforma-tributaria/split" element={<TaxSplitCheckoutPage />} />
        <Route path="fiscal/split-payment" element={<TaxSplitCheckoutPage />} />
        <Route path="checkout/split-tributario" element={<TaxSplitCheckoutPage />} />

        {/* Módulos FASE 33: DRE & Balancete por Centro de Custo de Evento com Custeio ABC */}
        <Route path="dre-evento" element={<EventCostCenterDrePage />} />
        <Route path="contabilidade/dre-evento" element={<EventCostCenterDrePage />} />
        <Route path="financeiro/centros-custo" element={<EventCostCenterDrePage />} />
        <Route path="eventos/dre-gerencial" element={<EventCostCenterDrePage />} />

        {/* Módulos FASE 34: Conciliação Bancária Autônoma Contínua via IA & Liquidação D+0 */}
        <Route path="conciliacao-ia" element={<AiBankReconciliationPage />} />
        <Route path="bancos/conciliacao-ia" element={<AiBankReconciliationPage />} />
        <Route path="financeiro/conciliacao-autonoma" element={<AiBankReconciliationPage />} />
        <Route path="bancos/reconciliation" element={<AiBankReconciliationPage />} />

        {/* Módulos FASE 35: Gestão Orçamentária Corporativa, Budget vs Actual & Rolling Forecast */}
        <Route path="orcamento-forecast" element={<BudgetForecastPage />} />
        <Route path="financeiro/orcamento" element={<BudgetForecastPage />} />
        <Route path="controladoria/budget" element={<BudgetForecastPage />} />

        {/* Módulos FASE 36: Auditoria de Borderô Físico-Digital com Assinatura ICP-Brasil & ITI */}
        <Route path="bordero-assinatura" element={<BorderoIcpSignaturePage />} />
        <Route path="eventos/bordero-icp" element={<BorderoIcpSignaturePage />} />
        <Route path="governanca/bordero-digital" element={<BorderoIcpSignaturePage />} />

        {/* Módulos FASE 37: Central de Gestão & Apuração ECAD / Direitos Autorais */}
        <Route path="ecad-direitos" element={<EcadCopyrightPage />} />
        <Route path="financeiro/ecad" element={<EcadCopyrightPage />} />
        <Route path="eventos/direitos-autorais" element={<EcadCopyrightPage />} />

        {/* Módulos FASE 38: Prevenção à Lavagem de Dinheiro (PLD-FT), COAF & Bacen 3.978/2020 */}
        <Route path="pld-compliance" element={<PldCoafCompliancePage />} />
        <Route path="compliance/pld-coaf" element={<PldCoafCompliancePage />} />
        <Route path="governanca/pld" element={<PldCoafCompliancePage />} />

        {/* Módulos FASE 39: Liquidação Interbancária Contínua SPI / STR & Mensageria ISO 20022 */}
        <Route path="iso20022-spi" element={<Iso20022SettlementPage />} />
        <Route path="bancos/iso20022" element={<Iso20022SettlementPage />} />
        <Route path="bancos/liquidacao-interbancaria" element={<Iso20022SettlementPage />} />

        {/* Módulos FASE 40: Suíte Soberana de Auditoria Contínua & War Room da Diretoria / CFO */}
        <Route path="war-room" element={<SovereignWarRoomPage />} />
        <Route path="diretoria/war-room" element={<SovereignWarRoomPage />} />
        <Route path="governanca/sovereign-kernel" element={<SovereignWarRoomPage />} />

        {/* Módulos FASE 41: Motor de Precificação Dinâmica & Yield Management com IA */}
        <Route path="precificacao-dinamica" element={<DynamicPricingPage />} />
        <Route path="eventos/precificacao-dinamica" element={<DynamicPricingPage />} />
        <Route path="vendas/yield-management" element={<DynamicPricingPage />} />

        {/* Módulos FASE 42: Gestão de Royalties & Direitos Internacionais */}
        <Route path="royalties-artistas" element={<ArtistRoyaltiesPage />} />
        <Route path="financeiro/royalties" element={<ArtistRoyaltiesPage />} />
        <Route path="internacional/withholding-tax" element={<ArtistRoyaltiesPage />} />

        {/* Módulos FASE 43: Hub de Fidelidade, Cashback & Passivo Circulante CPC 47 / IFRS 15 */}
        <Route path="fidelidade-pontos" element={<LoyaltyIfrs15Page />} />
        <Route path="contabilidade/ifrs15-fidelidade" element={<LoyaltyIfrs15Page />} />
        <Route path="marketing/fidelidade" element={<LoyaltyIfrs15Page />} />

        {/* Módulos FASE 44: Gestão Contábil de PDVs Físicos, Totens & Sangria com Custódia */}
        <Route path="pos-pdv" element={<PosCashierPage />} />
        <Route path="financeiro/pdv-sangria" element={<PosCashierPage />} />
        <Route path="pdv/fechamento-caixa" element={<PosCashierPage />} />

        {/* Módulos FASE 45: Central de Seguros de Ingressos & Sinistros SUSEP */}
        <Route path="seguro-ingressos" element={<TicketInsurancePage />} />
        <Route path="financeiro/seguros" element={<TicketInsurancePage />} />
        <Route path="susep/sinistros" element={<TicketInsurancePage />} />

        {/* Módulos FASE 46: Gestão de A&B, Cashless RFID / NFC & Estoque SPED Bloco K */}
        <Route path="cashless-ab" element={<CashlessInventoryPage />} />
        <Route path="eventos/cashless" element={<CashlessInventoryPage />} />
        <Route path="fiscal/sped-bloco-k" element={<CashlessInventoryPage />} />

        {/* Módulos FASE 47: Cobrança Judicial, Recuperação de Crédito & PECLD (IFRS 9 / CPC 48) */}
        <Route path="cobranca-recuperacao" element={<DebtRecoveryPage />} />
        <Route path="financeiro/cobranca" element={<DebtRecoveryPage />} />
        <Route path="contabilidade/pecld-ifrs9" element={<DebtRecoveryPage />} />

        {/* Módulos FASE 48: Patrocínios Corporativos, Naming Rights & Barter (IFRS 15) */}
        <Route path="patrocinios-naming" element={<SponsorshipBarterPage />} />
        <Route path="comercial/patrocinios" element={<SponsorshipBarterPage />} />
        <Route path="contabilidade/barter" element={<SponsorshipBarterPage />} />

        {/* Módulos FASE 49: Logística de Turnês, Frota & Contratos IFRS 16 */}
        <Route path="logistica-frota" element={<TourFleetPage />} />
        <Route path="operacoes/frota" element={<TourFleetPage />} />
        <Route path="contabilidade/ifrs16-leasing" element={<TourFleetPage />} />

        {/* Módulos FASE 50: Governança SOX 404, PCAOB & IPO Dual-Listing (B3 / NYSE) */}
        <Route path="governanca-sox" element={<SoxIpoPage />} />
        <Route path="diretoria/ipo-sox" element={<SoxIpoPage />} />
        <Route path="compliance/sox-404" element={<SoxIpoPage />} />

        {/* Central de Marketing Digital & Crescimento */}
        <Route path="marketing" element={<MarketingPage />} />
        <Route path="marketing/campanhas" element={<MarketingPage />} />
        <Route path="marketing/pixel" element={<MarketingPage />} />
        <Route path="marketing/cupons" element={<MarketingPage />} />
        <Route path="marketing/promoters" element={<MarketingPage />} />
        <Route path="marketing/atribuicao" element={<MarketingPage />} />

        {/* Motor de Remarketing & Recuperação de Carrinho */}
        <Route path="remarketing" element={<RemarketingPage />} />
        <Route path="remarketing/carrinho-abandonado" element={<RemarketingPage />} />
        <Route path="remarketing/segmentacao-rfm" element={<RemarketingPage />} />
        <Route path="remarketing/gatilhos" element={<RemarketingPage />} />
        <Route path="remarketing/reengajamento" element={<RemarketingPage />} />





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
