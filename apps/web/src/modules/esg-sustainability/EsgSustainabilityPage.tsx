import React, { useState } from 'react';
import {
  Leaf,
  Globe2,
  TreePine,
  ShieldCheck,
  Award,
  Calculator,
  Download,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  ExternalLink,
  ChevronRight,
  TrendingDown,
  FileText,
  BadgeCheck,
} from 'lucide-react';
import {
  PadraoCertificacaoCarbono,
  StatusInventarioCarbono,
  StatusCompensacaoVerde,
  BiomaProjetoCarbono,
} from '@diskingressos/types';
import type {
  EventCarbonFootprintDto,
  CarbonCreditOffsetDto,
  GreenBorderoEntryDto,
  EsgReportIfrsDto,
  CalcularPegadaEventoResponseDto,
} from '@diskingressos/types';

export const EsgSustainabilityPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'inventarios' | 'creditos' | 'borderos' | 'ifrs-s1s2'>('inventarios');
  const [isSimuladorOpen, setIsSimuladorOpen] = useState(false);

  // Estados do Simulador
  const [nomeEventoSim, setNomeEventoSim] = useState('Festival Sunset Music Green');
  const [publicoSim, setPublicoSim] = useState(25000);
  const [dieselSim, setDieselSim] = useState(4500); // litros
  const [kwhSim, setKwhSim] = useState(18000); // kWh
  const [kmPublicoSim, setKmPublicoSim] = useState(14); // km médio
  const [residuosSim, setResiduosSim] = useState(6200); // kg
  const [simulacaoResultado, setSimulacaoResultado] = useState<CalcularPegadaEventoResponseDto | null>(null);

  // Dados Mock Realistas para Demonstração Executiva
  const [inventarios, setInventarios] = useState<EventCarbonFootprintDto[]>([
    {
      id: 'ghg-001',
      eventoId: 'evt-001',
      codigoInventario: 'GHG-EVT-2026-001',
      nomeEvento: 'Festival Rock Curitiba Prime 2026',
      periodoReferencia: '2026-03',
      publicoPresenteTotal: 18500,
      totalIngressosEmitidos: 20000,
      escopo1KgCo2e: 12500.0,
      escopo2KgCo2e: 4800.0,
      escopo3KgCo2e: 36200.0,
      totalKgCo2e: 53500.0,
      totalToneladasCo2e: 53.5,
      fatorMedioPorIngressoKg: 2.675,
      statusInventario: StatusInventarioCarbono.NEUTRALIZADO,
      auditadoPor: 'Bureau Veritas ESG Certification',
      criadoEm: '2026-03-01T10:00:00Z',
    },
    {
      id: 'ghg-002',
      eventoId: 'evt-002',
      codigoInventario: 'GHG-EVT-2026-002',
      nomeEvento: 'Tour Coldplay Eco Music Experience 2026',
      periodoReferencia: '2026-03',
      publicoPresenteTotal: 42000,
      totalIngressosEmitidos: 45000,
      escopo1KgCo2e: 18400.0,
      escopo2KgCo2e: 9600.0,
      escopo3KgCo2e: 88500.0,
      totalKgCo2e: 116500.0,
      totalToneladasCo2e: 116.5,
      fatorMedioPorIngressoKg: 2.589,
      statusInventario: StatusInventarioCarbono.AUDITADO_TERCEIROS,
      auditadoPor: 'PwC Climate & Sustainability Assurance',
      criadoEm: '2026-03-02T11:00:00Z',
    },
    {
      id: 'ghg-003',
      eventoId: 'evt-003',
      codigoInventario: 'GHG-EVT-2026-003',
      nomeEvento: 'Eletrônica Sunset Pedreira Paulo Leminski',
      periodoReferencia: '2026-03',
      publicoPresenteTotal: 12000,
      totalIngressosEmitidos: 12500,
      escopo1KgCo2e: 6200.0,
      escopo2KgCo2e: 3100.0,
      escopo3KgCo2e: 21800.0,
      totalKgCo2e: 31100.0,
      totalToneladasCo2e: 31.1,
      fatorMedioPorIngressoKg: 2.488,
      statusInventario: StatusInventarioCarbono.EM_APURACAO,
      criadoEm: '2026-03-03T14:30:00Z',
    },
  ]);

  const [creditos] = useState<CarbonCreditOffsetDto[]>([
    {
      id: 'cr-001',
      codigoCertificado: 'VCS-2026-89412',
      padraoCertificacao: PadraoCertificacaoCarbono.VERRA_VCS,
      projetoNome: 'Conservação Florestal Jari REDD+ Amazônia',
      bioma: BiomaProjetoCarbono.AMAZONIA,
      numeroSerieSerial: 'VCS-BR-9982-2026-0001-A',
      toneladasDisponiveis: 2446.5,
      toneladasCompensadas: 53.5,
      precoPorToneladaBrl: 72.0,
      custoTotalBrl: 180000.0,
      status: 'LIQUIDADO_BORDERO',
      urlRegistroPublico: 'https://registry.verra.org/app/projectDetail/VCS/9982',
      dataAposentadoria: '2026-03-02T15:00:00Z',
      criadoEm: '2026-02-15T09:00:00Z',
    },
    {
      id: 'cr-002',
      codigoCertificado: 'B3-CBIOMOB-2026-441',
      padraoCertificacao: PadraoCertificacaoCarbono.B3_CBIOMOB,
      projetoNome: 'Usina de Biometano & Energia Limpa Paraná',
      bioma: BiomaProjetoCarbono.MATA_ATLANTICA,
      numeroSerieSerial: 'B3-BIO-2026-8812-441',
      toneladasDisponiveis: 1683.5,
      toneladasCompensadas: 116.5,
      precoPorToneladaBrl: 68.0,
      custoTotalBrl: 122400.0,
      status: 'APOSENTADO_REGISTRO',
      urlRegistroPublico: 'https://www.b3.com.br/pt_br/produtos-e-servicos/creditos-de-carbono',
      dataAposentadoria: '2026-03-03T16:20:00Z',
      criadoEm: '2026-02-20T10:00:00Z',
    },
    {
      id: 'cr-003',
      codigoCertificado: 'GS-2026-3021',
      padraoCertificacao: PadraoCertificacaoCarbono.GOLD_STANDARD,
      projetoNome: 'Restauração de Nascentes Serra do Mar',
      bioma: BiomaProjetoCarbono.MATA_ATLANTICA,
      numeroSerieSerial: 'GS-BR-7712-2026-X01',
      toneladasDisponiveis: 950.0,
      toneladasCompensadas: 0.0,
      precoPorToneladaBrl: 85.0,
      custoTotalBrl: 80750.0,
      status: 'RESERVADO',
      urlRegistroPublico: 'https://registry.goldstandard.org/projects/details/3021',
      criadoEm: '2026-03-01T08:00:00Z',
    },
  ]);

  const [borderos] = useState<GreenBorderoEntryDto[]>([
    {
      id: 'gbr-001',
      codigoRetencaoVerde: 'GBR-2026-0001',
      borderoFechamentoId: 'bor-2026-01',
      eventoId: 'evt-001',
      eventoNome: 'Festival Rock Curitiba Prime 2026',
      produtorId: 'prod-001',
      produtorNome: 'Prime Eventos Culturais S.A.',
      taxaVerdePorIngressoBrl: 1.5,
      totalIngressosCompensados: 20000,
      totalRetidoSustentabilidadeBrl: 30000.0,
      toneladasCompensadas: 53.5,
      statusCompensacao: StatusCompensacaoVerde.CERTIFICADO_EMITIDO,
      contaContabilDebito: '3.2.4.01 - Despesa com Compensação Socioambiental / Selo Verde',
      contaContabilCredito: '2.1.8.05 - Contas a Pagar Fornecedores de Créditos de Carbono',
      dataLancamento: '2026-03-02T16:00:00Z',
      certificadoSerial: 'VCS-BR-9982-2026-0001-A',
    },
    {
      id: 'gbr-002',
      codigoRetencaoVerde: 'GBR-2026-0002',
      borderoFechamentoId: 'bor-2026-02',
      eventoId: 'evt-002',
      eventoNome: 'Tour Coldplay Eco Music Experience 2026',
      produtorId: 'prod-002',
      produtorNome: 'Live Nation Brasil Entretenimento Ltda',
      taxaVerdePorIngressoBrl: 1.8,
      totalIngressosCompensados: 45000,
      totalRetidoSustentabilidadeBrl: 81000.0,
      toneladasCompensadas: 116.5,
      statusCompensacao: StatusCompensacaoVerde.APLICADO,
      contaContabilDebito: '3.2.4.01 - Despesa com Compensação Socioambiental / Selo Verde',
      contaContabilCredito: '2.1.8.05 - Contas a Pagar Fornecedores de Créditos de Carbono',
      dataLancamento: '2026-03-03T17:00:00Z',
      certificadoSerial: 'B3-BIO-2026-8812-441',
    },
  ]);

  const [esgReport] = useState<EsgReportIfrsDto>({
    id: 'esg-rep-001',
    codigoRelatorio: 'ESG-CVM193-2026-1T',
    anoFiscal: 2026,
    trimestre: '1T',
    totalEmissoesGeradasTCo2e: 201.1,
    totalCompensadoTCo2e: 170.0,
    taxaNeutralizacaoPercent: 84.54,
    investimentoSocioambientalBrl: 111000.0,
    residuosDesviadosAterroPercent: 88.5,
    eventosComSeloVerde: 2,
    statusRelatorio: 'PUBLICADO_CVM_193' as any,
    publicadoEm: '2026-03-03T18:00:00Z',
    criadoEm: '2026-03-03T17:30:00Z',
  });

  const handleSimularPegada = () => {
    // Escopo 1: diesel (2.68 kg CO2e / l)
    const e1 = Number((dieselSim * 2.68).toFixed(2));
    // Escopo 2: kWh (0.088 kg CO2e / kWh)
    const e2 = Number((kwhSim * 0.088).toFixed(2));
    // Escopo 3: transporte e resíduo
    const e3Transporte = publicoSim * kmPublicoSim * 0.12;
    const e3Residuo = residuosSim * 0.58;
    const e3 = Number((e3Transporte + e3Residuo).toFixed(2));

    const totalKg = Number((e1 + e2 + e3).toFixed(2));
    const totalT = Number((totalKg / 1000).toFixed(3));
    const fatorIngresso = Number((totalKg / publicoSim).toFixed(3));
    const creditosNec = Math.ceil(totalT);
    const custoEst = Number((creditosNec * 70.0).toFixed(2));
    const taxaSugerida = Number((custoEst / publicoSim).toFixed(2));

    setSimulacaoResultado({
      eventoId: 'sim-new',
      nomeEvento: nomeEventoSim,
      escopo1KgCo2e: e1,
      escopo2KgCo2e: e2,
      escopo3KgCo2e: e3,
      totalKgCo2e: totalKg,
      totalToneladasCo2e: totalT,
      fatorMedioPorIngressoKg: fatorIngresso,
      creditosNecessariosToneladas: creditosNec,
      custoEstimadoCompensacaoBrl: custoEst,
      taxaSugeridaPorIngressoBrl: taxaSugerida,
    });
  };

  return (
    <div className="p-8 space-y-8 bg-slate-50 dark:bg-slate-900 min-h-screen">
      {/* Header Corporativo */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300">
              FASE 26: ESG & SUSTENTABILIDADE CLIMÁTICA
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300">
              CVM Res. 193 / IFRS S1 e S2
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Leaf className="w-7 h-7 text-emerald-500" />
            Governança ESG, Pegada de Carbono & Borderô Verde
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Inventário GHG Protocol Escopos 1, 2 e 3, Neutralização com Créditos Certificados (Verra VCS / B3) e Ingresso Neutro
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsSimuladorOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-semibold transition-colors shadow-sm"
          >
            <Calculator className="w-4 h-4" />
            Simulador de Pegada & Borderô Verde
          </button>
          <button
            onClick={() => alert('Download do Relatório Integrado IFRS S1/S2 e Declaração CVM 193 iniciado em PDF assinado.')}
            className="flex items-center gap-2 px-4 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-sm font-semibold transition-colors"
          >
            <Download className="w-4 h-4" />
            Exportar IFRS S1/S2 (PDF)
          </button>
        </div>
      </div>

      {/* 4 Cards de KPIs Executivos ESG */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 dark:bg-emerald-950/20 rounded-bl-full pointer-events-none" />
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Emissões Mapeadas
            </span>
            <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400">
              <Globe2 className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            201.10 <span className="text-base font-normal text-slate-500">tCO₂e</span>
          </div>
          <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <span className="text-emerald-600 font-medium">3 megaeventos</span> no perímetro GHG Protocol
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-teal-50 dark:bg-teal-950/20 rounded-bl-full pointer-events-none" />
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Emissões Compensadas
            </span>
            <div className="p-2 rounded-lg bg-teal-100 dark:bg-teal-900/50 text-teal-600 dark:text-teal-400">
              <TreePine className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            170.00 <span className="text-base font-normal text-slate-500">tCO₂e</span>
          </div>
          <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
            Aposentadoria Verra VCS & B3 CBIOMOB
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 dark:bg-blue-950/20 rounded-bl-full pointer-events-none" />
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Taxa de Neutralização
            </span>
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            84.54%
          </div>
          <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <span className="text-blue-600 font-medium">Meta 100% Net Zero</span> alinhada ao Acordo de Paris
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-50 dark:bg-amber-950/20 rounded-bl-full pointer-events-none" />
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Borderô Verde Retido
            </span>
            <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            R$ 111.000,00
          </div>
          <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <span className="text-emerald-600 font-medium">65.000 ingressos</span> neutros comercializados
          </div>
        </div>
      </div>

      {/* Tabs de Navegação */}
      <div className="border-b border-slate-200 dark:border-slate-800 flex gap-6">
        <button
          onClick={() => setActiveTab('inventarios')}
          className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'inventarios'
              ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400 dark:border-emerald-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'
          }`}
        >
          <Globe2 className="w-4 h-4" />
          Inventário GHG Protocol (Escopos 1, 2 e 3)
        </button>

        <button
          onClick={() => setActiveTab('creditos')}
          className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'creditos'
              ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400 dark:border-emerald-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'
          }`}
        >
          <TreePine className="w-4 h-4" />
          Créditos de Carbono & Aposentadoria (Verra/B3)
        </button>

        <button
          onClick={() => setActiveTab('borderos')}
          className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'borderos'
              ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400 dark:border-emerald-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          Borderô Verde & Retenções Contábeis
        </button>

        <button
          onClick={() => setActiveTab('ifrs-s1s2')}
          className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'ifrs-s1s2'
              ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400 dark:border-emerald-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'
          }`}
        >
          <BadgeCheck className="w-4 h-4" />
          Relatório IFRS S1 & S2 (CVM Res. 193)
        </button>
      </div>

      {/* CONTEÚDO TAB 1: INVENTÁRIOS GHG PROTOCOL */}
      {activeTab === 'inventarios' && (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Mapeamento de Emissões por Evento (GHG Protocol Corporate Standard)
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Escopo 1: Geradores e frotas | Escopo 2: Eletricidade da arena (SIN) | Escopo 3: Transporte de público por CEP e resíduos
              </p>
            </div>
            <span className="text-xs bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-full text-slate-600 dark:text-slate-300 font-medium">
              3 inventários auditados
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-600 dark:text-slate-400 text-xs uppercase font-semibold">
                <tr>
                  <th className="py-3 px-4">Código / Evento</th>
                  <th className="py-3 px-4">Público / Ingressos</th>
                  <th className="py-3 px-4 text-right">Escopo 1 (Diesel)</th>
                  <th className="py-3 px-4 text-right">Escopo 2 (Grid)</th>
                  <th className="py-3 px-4 text-right">Escopo 3 (Público/Lixo)</th>
                  <th className="py-3 px-4 text-right">Total (tCO₂e)</th>
                  <th className="py-3 px-4 text-right">Fator/Ingresso</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4">Auditoria</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700 text-slate-700 dark:text-slate-300">
                {inventarios.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900 dark:text-white">{inv.nomeEvento}</div>
                      <div className="text-xs text-slate-400 font-mono">{inv.codigoInventario}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div>{inv.publicoPresenteTotal.toLocaleString('pt-BR')} presentes</div>
                      <div className="text-xs text-slate-400">{inv.totalIngressosEmitidos.toLocaleString('pt-BR')} emitidos</div>
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-xs">
                      {(inv.escopo1KgCo2e / 1000).toFixed(2)} t
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-xs">
                      {(inv.escopo2KgCo2e / 1000).toFixed(2)} t
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-xs">
                      {(inv.escopo3KgCo2e / 1000).toFixed(2)} t
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-slate-900 dark:text-white font-mono">
                      {inv.totalToneladasCo2e.toFixed(2)} t
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-xs text-emerald-600 font-medium">
                      {inv.fatorMedioPorIngressoKg.toFixed(2)} kg
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          inv.statusInventario === StatusInventarioCarbono.NEUTRALIZADO
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300'
                            : inv.statusInventario === StatusInventarioCarbono.AUDITADO_TERCEIROS
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300'
                        }`}
                      >
                        {inv.statusInventario}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs text-slate-500">
                      {inv.auditadoPor || 'Em auditoria preliminar'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CONTEÚDO TAB 2: CRÉDITOS DE CARBONO & APOSENTADORIA */}
      {activeTab === 'creditos' && (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Portfólio de Créditos de Carbono Certificados & Aposentadoria Pública
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Lotes Verra VCS, Gold Standard e B3 CBIOMOB com serialização imutável e lastro ambiental
              </p>
            </div>
            <span className="text-xs bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 px-3 py-1 rounded-full font-semibold">
              5.080 tCO₂e sob custódia
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-600 dark:text-slate-400 text-xs uppercase font-semibold">
                <tr>
                  <th className="py-3 px-4">Certificado / Projeto</th>
                  <th className="py-3 px-4">Padrão / Bioma</th>
                  <th className="py-3 px-4">Número de Série (Serial)</th>
                  <th className="py-3 px-4 text-right">Disponível</th>
                  <th className="py-3 px-4 text-right">Compensado</th>
                  <th className="py-3 px-4 text-right">Preço / Tonelada</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-center">Registro</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700 text-slate-700 dark:text-slate-300">
                {creditos.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900 dark:text-white">{c.projetoNome}</div>
                      <div className="text-xs text-slate-400 font-mono">{c.codigoCertificado}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-xs">{c.padraoCertificacao}</div>
                      <div className="text-xs text-emerald-600">{c.bioma}</div>
                    </td>
                    <td className="py-3 px-4 font-mono text-xs text-slate-500">
                      {c.numeroSerieSerial}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-medium text-slate-900 dark:text-white">
                      {c.toneladasDisponiveis.toLocaleString('pt-BR')} t
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-emerald-600">
                      {c.toneladasCompensadas.toLocaleString('pt-BR')} t
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-xs">
                      R$ {c.precoPorToneladaBrl.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          c.status === 'APOSENTADO_REGISTRO'
                            ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/60 dark:text-purple-300'
                            : c.status === 'LIQUIDADO_BORDERO'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300'
                            : 'bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300'
                        }`}
                      >
                        {c.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {c.urlRegistroPublico && (
                        <a
                          href={c.urlRegistroPublico}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline"
                        >
                          Ver <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CONTEÚDO TAB 3: BORDERÔ VERDE & RETENÇÕES CONTÁBEIS */}
      {activeTab === 'borderos' && (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Borderôs de Fechamento com Retenção Socioambiental (Ingresso Neutro)
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Escrituração em partidas dobradas: D - Despesa Socioambiental / C - Fornecedores de Créditos de Carbono
              </p>
            </div>
            <span className="text-xs bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 px-3 py-1 rounded-full font-semibold">
              R$ 111.000,00 retidos & conciliados
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-600 dark:text-slate-400 text-xs uppercase font-semibold">
                <tr>
                  <th className="py-3 px-4">Código / Borderô</th>
                  <th className="py-3 px-4">Evento / Produtor</th>
                  <th className="py-3 px-4 text-right">Taxa / Ingresso</th>
                  <th className="py-3 px-4 text-right">Ingressos Neutros</th>
                  <th className="py-3 px-4 text-right">Total Retido (BRL)</th>
                  <th className="py-3 px-4 text-right">Compensação</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4">Lançamento Contábil</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700 text-slate-700 dark:text-slate-300">
                {borderos.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900 dark:text-white">{b.codigoRetencaoVerde}</div>
                      <div className="text-xs text-slate-400 font-mono">{b.borderoFechamentoId}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-900 dark:text-white">{b.eventoNome}</div>
                      <div className="text-xs text-slate-400">{b.produtorNome}</div>
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-xs">
                      R$ {b.taxaVerdePorIngressoBrl.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-medium">
                      {b.totalIngressosCompensados.toLocaleString('pt-BR')}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-slate-900 dark:text-white font-mono">
                      R$ {b.totalRetidoSustentabilidadeBrl.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-xs text-emerald-600 font-semibold">
                      {b.toneladasCompensadas.toFixed(1)} tCO₂e
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          b.statusCompensacao === StatusCompensacaoVerde.CERTIFICADO_EMITIDO
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300'
                            : 'bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300'
                        }`}
                      >
                        {b.statusCompensacao}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs font-mono text-slate-500">
                      <div>D: {b.contaContabilDebito.split('-')[0]}</div>
                      <div>C: {b.contaContabilCredito.split('-')[0]}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CONTEÚDO TAB 4: IFRS S1 & S2 / CVM RES. 193 */}
      {activeTab === 'ifrs-s1s2' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-8 border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-700 pb-6 mb-6">
              <div>
                <span className="px-3 py-1 bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300 text-xs font-bold rounded-full">
                  RELATÓRIO CLIMÁTICO OFICIAL CVM 193 / IFRS S1 e S2
                </span>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-2">
                  Demonstrações Financeiras Relacionadas à Sustentabilidade ({esgReport.anoFiscal} - {esgReport.trimestre})
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Publicação em conformidade com o International Sustainability Standards Board (ISSB)
                </p>
              </div>

              <div className="text-right">
                <div className="text-xs text-slate-400">Código de Registro</div>
                <div className="font-mono font-bold text-slate-900 dark:text-white">{esgReport.codigoRelatorio}</div>
                <div className="text-xs text-emerald-600 font-medium mt-1">Auditoria PwC Independent Assurance</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-5 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700">
                <div className="text-xs font-semibold text-slate-500 uppercase">Governança Climática (IFRS S1)</div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white mt-2">100%</div>
                <p className="text-xs text-slate-500 mt-1">
                  Comitê Executivo de Sustentabilidade supervisionado diretamente pelo Conselho de Administração.
                </p>
              </div>

              <div className="p-5 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700">
                <div className="text-xs font-semibold text-slate-500 uppercase">Desvio de Aterros & Resíduos</div>
                <div className="text-2xl font-bold text-emerald-600 mt-2">{esgReport.residuosDesviadosAterroPercent}%</div>
                <p className="text-xs text-slate-500 mt-1">
                  Resíduos reciclados ou compostados em parceria com cooperativas locais nas arenas e estádios.
                </p>
              </div>

              <div className="p-5 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700">
                <div className="text-xs font-semibold text-slate-500 uppercase">Investimento Verde Total</div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
                  R$ {esgReport.investimentoSocioambientalBrl.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Recursos destinados a projetos REDD+ na Amazônia e transição energética de biomassa no PR.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL SIMULADOR DE PEGADA DE CARBONO */}
      {isSimuladorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-700 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-4">
              <div className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-emerald-500" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Simulador de Pegada GHG Protocol & Borderô Verde
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
                  Nome do Evento / Turnê
                </label>
                <input
                  type="text"
                  value={nomeEventoSim}
                  onChange={(e) => setNomeEventoSim(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-slate-900 dark:border-slate-700 dark:text-white font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Público Total Estimado
                </label>
                <input
                  type="number"
                  value={publicoSim}
                  onChange={(e) => setPublicoSim(Number(e.target.value))}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Diesel Geradores (Litros)
                </label>
                <input
                  type="number"
                  value={dieselSim}
                  onChange={(e) => setDieselSim(Number(e.target.value))}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Consumo Arena (kWh)
                </label>
                <input
                  type="number"
                  value={kwhSim}
                  onChange={(e) => setKwhSim(Number(e.target.value))}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Distância Média Público (km)
                </label>
                <input
                  type="number"
                  value={kmPublicoSim}
                  onChange={(e) => setKmPublicoSim(Number(e.target.value))}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Resíduos Sólidos Estimados (kg)
                </label>
                <input
                  type="number"
                  value={residuosSim}
                  onChange={(e) => setResiduosSim(Number(e.target.value))}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                />
              </div>
            </div>

            <button
              onClick={handleSimularPegada}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Calcular Emissões GHG Protocol & Proposta de Retenção
            </button>

            {simulacaoResultado && (
              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-3">
                <div className="flex items-center justify-between border-b border-emerald-200 dark:border-emerald-800 pb-2">
                  <span className="font-bold text-emerald-950 dark:text-emerald-100 text-sm">
                    Resultado da Simulação Paramétrica
                  </span>
                  <span className="text-xs bg-emerald-200 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-100 px-2 py-0.5 rounded font-bold">
                    {simulacaoResultado.totalToneladasCo2e} tCO₂e
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <span className="text-slate-500">Escopo 1 (Diesel):</span>
                    <div className="font-bold">{(simulacaoResultado.escopo1KgCo2e / 1000).toFixed(2)} t</div>
                  </div>
                  <div>
                    <span className="text-slate-500">Escopo 2 (Energia):</span>
                    <div className="font-bold">{(simulacaoResultado.escopo2KgCo2e / 1000).toFixed(2)} t</div>
                  </div>
                  <div>
                    <span className="text-slate-500">Escopo 3 (Público):</span>
                    <div className="font-bold">{(simulacaoResultado.escopo3KgCo2e / 1000).toFixed(2)} t</div>
                  </div>
                </div>

                <div className="pt-2 border-t border-emerald-200 dark:border-emerald-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-500">Créditos a Aposentar:</span>
                    <div className="font-bold text-slate-900 dark:text-white">
                      {simulacaoResultado.creditosNecessariosToneladas} t (R$ {simulacaoResultado.custoEstimadoCompensacaoBrl.toLocaleString('pt-BR')})
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-500">Taxa Verde Sugerida:</span>
                    <div className="text-base font-extrabold text-emerald-600">
                      R$ {simulacaoResultado.taxaSugeridaPorIngressoBrl.toFixed(2)} / ingresso
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
