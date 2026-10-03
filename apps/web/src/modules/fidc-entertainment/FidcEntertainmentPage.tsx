import React, { useState } from 'react';
import {
  Briefcase,
  Layers,
  PieChart,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Calculator,
  Download,
  Building2,
  TrendingUp,
  FileCheck2,
  Lock,
  Sparkles,
} from 'lucide-react';
import {
  TipoCotaFidc,
  StatusFundoFidc,
  StatusCessaoFidc,
  RegistradoraAtivos,
} from '@diskingressos/types';
import type {
  FidcFundStructureDto,
  FidcReceivableAssignmentDto,
  FidcDailyQuotaValuationDto,
  FidcAccountingMovementDto,
  SimularCessaoFidcResponseDto,
} from '@diskingressos/types';

export const FidcEntertainmentPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'estrutura' | 'cessoes' | 'cotas' | 'contabil'>('estrutura');
  const [isSimuladorOpen, setIsSimuladorOpen] = useState(false);

  // Estados do Simulador de Cessão
  const [eventoNomeSim, setEventoNomeSim] = useState('Festival Sunset Pedreira 2026');
  const [valorNominalSim, setValorNominalSim] = useState(4000000.0);
  const [prazoDiasSim, setPrazoDiasSim] = useState(60);
  const [taxaAnualSim, setTaxaAnualSim] = useState(15.5);
  const [retencaoSubordinadaSim, setRetencaoSubordinadaSim] = useState(10.0); // 10%
  const [simulacaoResultado, setSimulacaoResultado] = useState<SimularCessaoFidcResponseDto | null>(null);

  // Dados Mock Realistas
  const [fundo] = useState<FidcFundStructureDto>({
    id: 'fidc-001',
    codigoFundo: 'FIDC-ENTRET-2026-01',
    razaoSocialFundo: 'DiskIngressos FIDC de Direitos Creditórios de Eventos & Entretenimento',
    cnpjFundo: '48.912.345/0001-80',
    administradorFiduciario: 'Oliveira Trust DTVM S.A.',
    custodiante: 'Banco Itaú BBA S.A.',
    gestorCarteira: 'DiskIngressos Asset Management Ltda',
    patrimonioLiquidoTotalBrl: 42000000.0,
    valorCotasSenioresBrl: 28000000.0,
    valorCotasMezaninoBrl: 3500000.0,
    valorCotasSubordinadasBrl: 10500000.0,
    indiceSubordinacaoAtualPercent: 25.0,
    indiceSubordinacaoMinimoPercent: 25.0,
    metaRentabilidadeSenior: '100% CDI + 2.80% a.a.',
    statusFundo: StatusFundoFidc.ATIVO_OPERACIONAL,
    dataConstituicao: '2025-11-15T10:00:00Z',
  });

  const [cessoes] = useState<FidcReceivableAssignmentDto[]>([
    {
      id: 'ces-001',
      codigoCessao: 'CES-FIDC-2026-0042',
      fundId: 'fidc-001',
      eventoId: 'evt-001',
      eventoNome: 'Festival Rock Curitiba Prime 2026',
      produtorId: 'prod-001',
      produtorNome: 'Prime Eventos Culturais S.A.',
      borderoFechamentoId: 'bor-2026-01',
      valorNominalRecebiveisBrl: 5000000.0,
      taxaDescontoAnualPercent: 15.8,
      valorPresenteAquisicaoBrl: 4872195.42,
      prazoMedioDias: 60,
      fundoReservaRetidoBrl: 500000.0,
      statusCessao: StatusCessaoFidc.HOMOLOGADA_CERC,
      registroRegistradora: RegistradoraAtivos.CERC_REGISTRADORA,
      numeroContratoB3: 'CERC-REC-2026-0982-PR',
      dataCessao: '2026-02-15T10:00:00Z',
      dataVencimento: '2026-04-16T23:59:59Z',
    },
    {
      id: 'ces-002',
      codigoCessao: 'CES-FIDC-2026-0043',
      fundId: 'fidc-001',
      eventoId: 'evt-002',
      eventoNome: 'Tour Coldplay Eco Music Experience 2026',
      produtorId: 'prod-002',
      produtorNome: 'Live Nation Brasil Entretenimento Ltda',
      borderoFechamentoId: 'bor-2026-02',
      valorNominalRecebiveisBrl: 8000000.0,
      taxaDescontoAnualPercent: 14.5,
      valorPresenteAquisicaoBrl: 7721890.15,
      prazoMedioDias: 90,
      fundoReservaRetidoBrl: 800000.0,
      statusCessao: StatusCessaoFidc.HOMOLOGADA_CERC,
      registroRegistradora: RegistradoraAtivos.B3,
      numeroContratoB3: 'B3-REG-2026-5541-SP',
      dataCessao: '2026-02-20T14:30:00Z',
      dataVencimento: '2026-05-21T23:59:59Z',
    },
    {
      id: 'ces-003',
      codigoCessao: 'CES-FIDC-2026-0044',
      fundId: 'fidc-001',
      eventoId: 'evt-003',
      eventoNome: 'Eletrônica Sunset Pedreira Paulo Leminski',
      produtorId: 'prod-003',
      produtorNome: 'Pedreira Live Entertainment Ltda',
      borderoFechamentoId: 'bor-2026-03',
      valorNominalRecebiveisBrl: 2500000.0,
      taxaDescontoAnualPercent: 16.0,
      valorPresenteAquisicaoBrl: 2451230.88,
      prazoMedioDias: 45,
      fundoReservaRetidoBrl: 250000.0,
      statusCessao: StatusCessaoFidc.LIQUIDADA_BORDERO,
      registroRegistradora: RegistradoraAtivos.CIP_REGISTRADORA,
      numeroContratoB3: 'CIP-TRAV-2026-1188',
      dataCessao: '2026-02-01T11:00:00Z',
      dataVencimento: '2026-03-18T23:59:59Z',
    },
  ]);

  const [valuations] = useState<FidcDailyQuotaValuationDto[]>([
    {
      id: 'val-001',
      fundId: 'fidc-001',
      dataCompetencia: '2026-03-02T20:00:00Z',
      valorPatrimonioLiquidoBrl: 42000000.0,
      valorCotaSeniorBrl: 1042.881245,
      valorCotaMezaninoBrl: 1058.120984,
      valorCotaSubordinadaBrl: 1112.451982,
      rentabilidadeAcumuladaSeniorPercent: 3.42,
      indiceInadimplenciaPercent: 0.0,
      indiceSubordinacaoRealPercent: 25.0,
      enquadradoRegulatorio: true,
      criadoEm: '2026-03-02T21:00:00Z',
    },
  ]);

  const [movements] = useState<FidcAccountingMovementDto[]>([
    {
      id: 'mov-001',
      codigoLancamento: 'MOV-FIDC-2026-001',
      fundId: 'fidc-001',
      tipoMovimento: 'AQUISICAO_DIREITOS',
      valorBrl: 4872195.42,
      contaDebito: '1.1.3.05 - Direitos Creditórios Cedidos a Receber (FIDC)',
      contaCredito: '1.1.1.01 - Banco Custodiante Itaú BBA Conta Liquidação',
      historicoCvm175:
        'Aquisição de recebíveis de bilheteria do Festival Rock Curitiba com trava fiduciária na CERC sob o Anexo II da CVM 175.',
      dataLancamento: '2026-02-15T11:00:00Z',
    },
    {
      id: 'mov-002',
      codigoLancamento: 'MOV-FIDC-2026-002',
      fundId: 'fidc-001',
      tipoMovimento: 'AMORTIZACAO_SENIOR',
      valorBrl: 1250000.0,
      contaDebito: '2.1.2.01 - Passivo de Cotas Seniores a Amortizar',
      contaCredito: '1.1.1.01 - Banco Custodiante Itaú BBA Conta Liquidação',
      historicoCvm175:
        'Amortização ordinária programada de cotas seniores com rendimento CDI + spread contratual.',
      dataLancamento: '2026-03-01T15:00:00Z',
    },
  ]);

  const handleSimularCessao = () => {
    const taxaDiaria = Math.pow(1 + taxaAnualSim / 100, 1 / 360) - 1;
    const fatorDesconto = Math.pow(1 + taxaDiaria, prazoDiasSim);
    const vp = Number((valorNominalSim / fatorDesconto).toFixed(2));
    const desconto = Number((valorNominalSim - vp).toFixed(2));
    const retencao = Number(((valorNominalSim * retencaoSubordinadaSim) / 100).toFixed(2));
    const liquido = Number((vp - retencao).toFixed(2));

    setSimulacaoResultado({
      valorNominalRecebiveisBrl: valorNominalSim,
      taxaDescontoAnualPercent: taxaAnualSim,
      prazoMedioDias: prazoDiasSim,
      descontoFinanceiroBrl: desconto,
      valorPresenteAquisicaoBrl: vp,
      retencaoSubordinadaGarantiaBrl: retencao,
      valorLiquidoLiberadoProdutorBrl: liquido,
      impactoIndiceSubordinacaoPercent: 25.0,
      statusEnquadramentoCvm175: 'ENQUADRADO',
    });
  };

  return (
    <div className="p-8 space-y-8 bg-slate-50 dark:bg-slate-900 min-h-screen">
      {/* Header Corporativo */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800 dark:bg-indigo-900/60 dark:text-indigo-300">
              FASE 28: FIDC DE BILHETERIA & EVENTOS
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300">
              Resolução CVM 175 (Anexo II)
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Briefcase className="w-7 h-7 text-indigo-600" />
            FIDC de Bilheteria & Direitos Creditórios de Entretenimento
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Estruturação de Cotas Seniores e Subordinadas, Trava Fiduciária Registrada na CERC/B3 e Marcação a Mercado
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsSimuladorOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition-colors shadow-sm"
          >
            <Calculator className="w-4 h-4" />
            Simulador de Cessão & Subordinação
          </button>
          <button
            onClick={() => alert('Exportando Informe Diário e Lâmina de Cotas do FIDC em formato CVM XML.')}
            className="flex items-center gap-2 px-4 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-sm font-semibold transition-colors"
          >
            <Download className="w-4 h-4" />
            Informe CVM 175 (XML)
          </button>
        </div>
      </div>

      {/* 4 Cards de KPIs Executivos do FIDC */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 dark:bg-indigo-950/20 rounded-bl-full pointer-events-none" />
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Patrimônio Líquido (PL)
            </span>
            <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400">
              <PieChart className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            R$ 42.000.000,00
          </div>
          <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <Building2 className="w-3.5 h-3.5 text-indigo-600" />
            Adm: {fundo.administradorFiduciario}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 dark:bg-blue-950/20 rounded-bl-full pointer-events-none" />
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Recebíveis Cedidos
            </span>
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400">
              <FileCheck2 className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            R$ 15.500.000,00
          </div>
          <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <span className="text-blue-600 font-medium">3 operações</span> registradas na CERC e B3
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 dark:bg-emerald-950/20 rounded-bl-full pointer-events-none" />
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Índice de Subordinação
            </span>
            <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            25.00%
          </div>
          <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Enquadrado (Mínimo regulamentar 25.0%)
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-50 dark:bg-amber-950/20 rounded-bl-full pointer-events-none" />
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Rentabilidade Cota Sênior
            </span>
            <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            100% CDI <span className="text-base font-normal text-amber-600">+2.80%</span>
          </div>
          <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <span className="text-emerald-600 font-medium">+3.42% no ano</span> (Inadimplência 0.0%)
          </div>
        </div>
      </div>

      {/* Tabs de Navegação */}
      <div className="border-b border-slate-200 dark:border-slate-800 flex gap-6">
        <button
          onClick={() => setActiveTab('estrutura')}
          className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'estrutura'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'
          }`}
        >
          <Layers className="w-4 h-4" />
          Estrutura de Cotas & Fundo (CVM 175)
        </button>

        <button
          onClick={() => setActiveTab('cessoes')}
          className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'cessoes'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          Cessões de Recebíveis de Bilheteria
        </button>

        <button
          onClick={() => setActiveTab('cotas')}
          className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'cotas'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          Marcação a Mercado & Cotas Diárias
        </button>

        <button
          onClick={() => setActiveTab('contabil')}
          className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'contabil'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'
          }`}
        >
          <FileCheck2 className="w-4 h-4" />
          Escrituração Contábil & Fluxo Fiduciário
        </button>
      </div>

      {/* CONTEÚDO TAB 1: ESTRUTURA DE COTAS */}
      {activeTab === 'estrutura' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              Cascata de Liquidação e Subordinação de Cotas (Waterflow CVM 175)
            </h2>
            <p className="text-xs text-slate-500 mb-6">
              A cota subordinada absorve qualquer inadimplência ou cancelamento de shows em primeiro lugar (first-loss piece), garantindo o risco soberano aos cotistas seniores.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-5 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50/50 dark:bg-indigo-950/20">
                <div className="flex items-center justify-between text-xs font-bold text-indigo-700 dark:text-indigo-300 uppercase">
                  <span>Cotas Seniores</span>
                  <span className="px-2 py-0.5 rounded bg-indigo-200 dark:bg-indigo-900">Prioridade 1</span>
                </div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white mt-3">
                  R$ {fundo.valorCotasSenioresBrl.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                <div className="text-xs text-slate-500 mt-1">66.67% do PL Total do Fundo</div>
                <div className="mt-4 pt-3 border-t border-indigo-200 dark:border-indigo-800 text-xs text-slate-600 dark:text-slate-400">
                  <div className="flex justify-between">
                    <span>Meta de Retorno:</span>
                    <span className="font-bold text-indigo-600">{fundo.metaRentabilidadeSenior}</span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span>Perfil de Risco:</span>
                    <span className="font-bold text-emerald-600">Baixo (Protegido por Colchão)</span>
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20">
                <div className="flex items-center justify-between text-xs font-bold text-amber-700 dark:text-amber-300 uppercase">
                  <span>Cotas Mezanino</span>
                  <span className="px-2 py-0.5 rounded bg-amber-200 dark:bg-amber-900">Prioridade 2</span>
                </div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white mt-3">
                  R$ {fundo.valorCotasMezaninoBrl.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                <div className="text-xs text-slate-500 mt-1">8.33% do PL Total do Fundo</div>
                <div className="mt-4 pt-3 border-t border-amber-200 dark:border-amber-800 text-xs text-slate-600 dark:text-slate-400">
                  <div className="flex justify-between">
                    <span>Meta de Retorno:</span>
                    <span className="font-bold text-amber-600">100% CDI + 5.50% a.a.</span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span>Perfil de Risco:</span>
                    <span className="font-bold text-amber-600">Moderado</span>
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-xl border border-purple-200 dark:border-purple-800 bg-purple-50/50 dark:bg-purple-950/20">
                <div className="flex items-center justify-between text-xs font-bold text-purple-700 dark:text-purple-300 uppercase">
                  <span>Cotas Subordinadas</span>
                  <span className="px-2 py-0.5 rounded bg-purple-200 dark:bg-purple-900">First-Loss</span>
                </div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white mt-3">
                  R$ {fundo.valorCotasSubordinadasBrl.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                <div className="text-xs text-slate-500 mt-1">25.00% do PL (Retido por Disk/Produtor)</div>
                <div className="mt-4 pt-3 border-t border-purple-200 dark:border-purple-800 text-xs text-slate-600 dark:text-slate-400">
                  <div className="flex justify-between">
                    <span>Garantia de Perda:</span>
                    <span className="font-bold text-purple-600">Primeira Linha de Absorção</span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span>Índice Atual:</span>
                    <span className="font-bold text-emerald-600">25.0% (Enquadrado CVM)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CONTEÚDO TAB 2: CESSÕES DE RECEBÍVEIS */}
      {activeTab === 'cessoes' && (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Carteira de Recebíveis de Bilheteria Cedidos ao FIDC
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Contratos de cessão registrados nas centrais de registro financeiro autorizadas pelo Banco Central
              </p>
            </div>
            <span className="text-xs bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 px-3 py-1 rounded-full font-semibold">
              R$ 15.5M em Borderôs Cedidos
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-600 dark:text-slate-400 text-xs uppercase font-semibold">
                <tr>
                  <th className="py-3 px-4">Cessão / Evento</th>
                  <th className="py-3 px-4">Produtor / Borderô</th>
                  <th className="py-3 px-4 text-right">Valor Nominal</th>
                  <th className="py-3 px-4 text-right">Valor Presente</th>
                  <th className="py-3 px-4 text-right">Taxa (a.a.)</th>
                  <th className="py-3 px-4 text-right">Fundo Reserva</th>
                  <th className="py-3 px-4">Registradora</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700 text-slate-700 dark:text-slate-300">
                {cessoes.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900 dark:text-white">{c.eventoNome}</div>
                      <div className="text-xs text-slate-400 font-mono">{c.codigoCessao}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-900 dark:text-white">{c.produtorNome}</div>
                      <div className="text-xs text-slate-400 font-mono">{c.borderoFechamentoId}</div>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-medium">
                      R$ {c.valorNominalRecebiveisBrl.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 dark:text-white">
                      R$ {c.valorPresenteAquisicaoBrl.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-xs text-indigo-600 font-semibold">
                      {c.taxaDescontoAnualPercent.toFixed(1)}%
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-xs text-purple-600">
                      R$ {c.fundoReservaRetidoBrl.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-4 text-xs font-mono text-slate-500">
                      <div className="font-semibold text-slate-700 dark:text-slate-300">{c.registroRegistradora}</div>
                      <div>{c.numeroContratoB3}</div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          c.statusCessao === StatusCessaoFidc.LIQUIDADA_BORDERO
                            ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/60 dark:text-purple-300'
                            : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300'
                        }`}
                      >
                        {c.statusCessao}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CONTEÚDO TAB 3: MARCAÇÃO A MERCADO & COTAS */}
      {activeTab === 'cotas' && (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Marcação a Mercado Diária (MtM) & Lâmina de Cotas
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Apuração diária auditada por Banco Itaú BBA S.A. e Oliveira Trust DTVM
              </p>
            </div>
            <span className="text-xs bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 px-3 py-1 rounded-full font-semibold">
              100% Em Dia
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-600 dark:text-slate-400 text-xs uppercase font-semibold">
                <tr>
                  <th className="py-3 px-4">Competência</th>
                  <th className="py-3 px-4 text-right">PL Total (BRL)</th>
                  <th className="py-3 px-4 text-right">Cota Sênior</th>
                  <th className="py-3 px-4 text-right">Cota Mezanino</th>
                  <th className="py-3 px-4 text-right">Cota Subordinada</th>
                  <th className="py-3 px-4 text-right">Rentabilidade Sênior</th>
                  <th className="py-3 px-4 text-right">Índice Subordinação</th>
                  <th className="py-3 px-4 text-center">Enquadramento</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700 text-slate-700 dark:text-slate-300">
                {valuations.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                    <td className="py-3 px-4 font-mono text-xs">
                      {new Date(v.dataCompetencia).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 dark:text-white">
                      R$ {v.valorPatrimonioLiquidoBrl.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-xs text-indigo-600 font-semibold">
                      R$ {v.valorCotaSeniorBrl.toFixed(6)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-xs text-amber-600 font-semibold">
                      R$ {v.valorCotaMezaninoBrl.toFixed(6)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-xs text-purple-600 font-semibold">
                      R$ {v.valorCotaSubordinadaBrl.toFixed(6)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-xs text-emerald-600 font-bold">
                      +{v.rentabilidadeAcumuladaSeniorPercent.toFixed(2)}%
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-xs font-bold text-indigo-600">
                      {v.indiceSubordinacaoRealPercent.toFixed(2)}%
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300">
                        ENQUADRADO
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CONTEÚDO TAB 4: ESCRITURAÇÃO CONTÁBIL */}
      {activeTab === 'contabil' && (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Escrituração Contábil da Carteira FIDC (CVM Resolução 175)
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Lançamentos fiduciários em partidas dobradas de aquisição de direitos creditórios e amortizações de cotas
              </p>
            </div>
            <span className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-3 py-1 rounded-full font-semibold">
              Partidas Dobradas no Centavo
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-600 dark:text-slate-400 text-xs uppercase font-semibold">
                <tr>
                  <th className="py-3 px-4">Código / Tipo</th>
                  <th className="py-3 px-4 text-right">Valor (BRL)</th>
                  <th className="py-3 px-4">Conta Débito</th>
                  <th className="py-3 px-4">Conta Crédito</th>
                  <th className="py-3 px-4">Histórico Regulatório</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700 text-slate-700 dark:text-slate-300">
                {movements.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900 dark:text-white">{m.codigoLancamento}</div>
                      <div className="text-xs text-indigo-600 font-mono font-medium">{m.tipoMovimento}</div>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 dark:text-white">
                      R$ {m.valorBrl.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-4 font-mono text-xs text-slate-600 dark:text-slate-300">
                      {m.contaDebito}
                    </td>
                    <td className="py-3 px-4 font-mono text-xs text-slate-600 dark:text-slate-300">
                      {m.contaCredito}
                    </td>
                    <td className="py-3 px-4 text-xs text-slate-500 max-w-sm">
                      {m.historicoCvm175}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL SIMULADOR DE CESSÃO FIDC */}
      {isSimuladorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-700 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-4">
              <div className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-indigo-600" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Simulador de Cessão de Borderô & Subordinação CVM 175
                </h3>
              </div>
              <button
                onClick={() => setIsSimuladorOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xl font-bold"
              >
                &times;
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Evento / Turnê
                </label>
                <input
                  type="text"
                  value={eventoNomeSim}
                  onChange={(e) => setEventoNomeSim(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-slate-900 dark:border-slate-700 dark:text-white font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Valor Nominal do Borderô (R$)
                </label>
                <input
                  type="number"
                  value={valorNominalSim}
                  onChange={(e) => setValorNominalSim(Number(e.target.value))}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-slate-900 dark:border-slate-700 dark:text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Prazo Médio até o Evento (Dias)
                </label>
                <input
                  type="number"
                  value={prazoDiasSim}
                  onChange={(e) => setPrazoDiasSim(Number(e.target.value))}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Taxa de Desconto (% a.a.)
                </label>
                <input
                  type="number"
                  value={taxaAnualSim}
                  onChange={(e) => setTaxaAnualSim(Number(e.target.value))}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Retenção Subordinada de Garantia (%)
                </label>
                <input
                  type="number"
                  value={retencaoSubordinadaSim}
                  onChange={(e) => setRetencaoSubordinadaSim(Number(e.target.value))}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                />
              </div>
            </div>

            <button
              onClick={handleSimularCessao}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Calcular Cessão Fiduciária & Enquadramento
            </button>

            {simulacaoResultado && (
              <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 space-y-3">
                <div className="flex items-center justify-between border-b border-indigo-200 dark:border-indigo-800 pb-2">
                  <span className="font-bold text-sm text-indigo-950 dark:text-indigo-100">
                    Proposta de Cessão Aprovada
                  </span>
                  <span className="text-xs bg-emerald-200 text-emerald-900 dark:bg-emerald-900 dark:text-emerald-100 px-2 py-0.5 rounded font-bold">
                    CVM 175: {simulacaoResultado.statusEnquadramentoCvm175}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-500">Valor Presente de Aquisição:</span>
                    <div className="font-bold text-slate-900 dark:text-white">
                      R$ {simulacaoResultado.valorPresenteAquisicaoBrl.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-500">Desconto Financeiro (Juros):</span>
                    <div className="font-bold text-amber-600">
                      R$ {simulacaoResultado.descontoFinanceiroBrl.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-500">Retenção Subordinada (Garantia):</span>
                    <div className="font-bold text-purple-600">
                      R$ {simulacaoResultado.retencaoSubordinadaGarantiaBrl.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-500">Valor Líquido ao Produtor:</span>
                    <div className="font-extrabold text-emerald-600 text-sm">
                      R$ {simulacaoResultado.valorLiquidoLiberadoProdutorBrl.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
