import React, { useState } from 'react';
import {
  Zap,
  RotateCcw,
  Landmark,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  Layers,
  ArrowRight,
  TrendingUp,
  Building2,
  DollarSign,
  QrCode,
  Sliders,
  Sparkles,
  ExternalLink,
  Search,
  Check,
  X,
  CreditCard,
  Hash,
} from 'lucide-react';
import {
  StatusMandatoPix,
  PeriodicidadeMandato,
  StatusCobrancaPix,
  CanalAutorizacaoPix,
} from '@diskingressos/types';
import type {
  PixAutomaticoMandatoDto,
  PixAutomaticoCobrancaDto,
  PixAutomaticoDashboardKpisDto,
  CriarMandatoPixRequestDto,
  SimularSmartRetryResponseDto,
} from '@diskingressos/types';

export const PixAutomaticoPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'mandatos' | 'cobrancas' | 'smart-retry' | 'novo-mandato'>('mandatos');
  const [isModalCobrancaOpen, setIsModalCobrancaOpen] = useState(false);
  const [executingDebit, setExecutingDebit] = useState(false);
  const [selectedMandatoId, setSelectedMandatoId] = useState('man-001');

  // Form de Novo Mandato
  const [clienteNome, setClienteNome] = useState('Lucas Gabriel Ferreira');
  const [clienteCpf, setClienteCpf] = useState('512.984.321-77');
  const [chavePix, setChavePix] = useState('lucas.ferreira@curitibashows.com.br');
  const [bancoNome, setBancoNome] = useState('Banco Itaú Unibanco S.A.');
  const [ispbBanco, setIspbBanco] = useState('60701190');
  const [planoNome, setPlanoNome] = useState('Passaporte Anual Rock & Sunset 2026');
  const [valorLimite, setValorLimite] = useState(250.0);
  const [periodicidade, setPeriodicidade] = useState<PeriodicidadeMandato>(PeriodicidadeMandato.MENSAL);
  const [diaVencimento, setDiaVencimento] = useState(10);

  // Smart Retry Simulation
  const [retryResult, setRetryResult] = useState<SimularSmartRetryResponseDto | null>(null);

  // KPIs
  const [kpis, setKpis] = useState<PixAutomaticoDashboardKpisDto>({
    volumeMensalLiquidadoBrl: 8450000.0,
    totalMandatosAtivos: 24890,
    taxaSucessoPrimeiraTentativaPercent: 94.2,
    taxaRecuperacaoSmartRetryPercent: 96.8,
    tempoMedioLiquidacaoSpiMs: 640,
  });

  // Mandatos Mock
  const [mandatos, setMandatos] = useState<PixAutomaticoMandatoDto[]>([
    {
      id: 'man-001',
      codigoMandato: 'MAN-PIX-2026-0001',
      clienteNome: 'Mariana Duarte Souza',
      clienteCpfCnpj: '028.912.349-01',
      chavePix: 'mariana.souza@email.com',
      ispbBancoParticipante: '60701190',
      bancoNome: 'Banco Itaú Unibanco S.A.',
      planoAssinaturaNome: 'Passaporte Curitiba Sunset VIP 2026 (12x)',
      valorLimitePorTransacaoBrl: 350.0,
      periodicidade: PeriodicidadeMandato.MENSAL,
      statusMandato: StatusMandatoPix.ATIVO,
      diaVencimento: 10,
      canalAutorizacao: CanalAutorizacaoPix.APP_BANCARIO_QR,
      autorizadoEm: '2026-01-10T14:30:00Z',
      criadoEm: '2026-01-10T14:25:00Z',
    },
    {
      id: 'man-002',
      codigoMandato: 'MAN-PIX-2026-0002',
      clienteNome: 'Rodrigo Albuquerque Lima',
      clienteCpfCnpj: '419.823.765-20',
      chavePix: '+5541988887766',
      ispbBancoParticipante: '00000000',
      bancoNome: 'Banco do Brasil S.A.',
      planoAssinaturaNome: 'Clube Fidelidade Prime Rock Tour (Mensal)',
      valorLimitePorTransacaoBrl: 180.0,
      periodicidade: PeriodicidadeMandato.MENSAL,
      statusMandato: StatusMandatoPix.ATIVO,
      diaVencimento: 15,
      canalAutorizacao: CanalAutorizacaoPix.APP_BANCARIO_QR,
      autorizadoEm: '2026-02-15T09:10:00Z',
      criadoEm: '2026-02-15T09:00:00Z',
    },
    {
      id: 'man-003',
      codigoMandato: 'MAN-PIX-2026-0003',
      clienteNome: 'Juliana Mendes Carvalho',
      clienteCpfCnpj: '712.345.890-44',
      chavePix: 'juliana.mendes@empresa.com.br',
      ispbBancoParticipante: '00360305',
      bancoNome: 'Caixa Econômica Federal',
      planoAssinaturaNome: 'Camarote Corporativo Anual - Pedreira Paulo Leminski',
      valorLimitePorTransacaoBrl: 1200.0,
      periodicidade: PeriodicidadeMandato.MENSAL,
      statusMandato: StatusMandatoPix.ATIVO,
      diaVencimento: 5,
      canalAutorizacao: CanalAutorizacaoPix.OPEN_FINANCE_REDIRECT,
      autorizadoEm: '2026-01-05T11:20:00Z',
      criadoEm: '2026-01-05T11:10:00Z',
    },
  ]);

  // Cobranças Mock
  const [cobrancas, setCobrancas] = useState<PixAutomaticoCobrancaDto[]>([
    {
      id: 'cob-001',
      codigoCobranca: 'COB-PIX-2026-0042',
      mandatoId: 'man-001',
      clienteNome: 'Mariana Duarte Souza',
      valorCobradoBrl: 350.0,
      competenciaMesAno: '2026-03',
      dataAgendada: '2026-03-10T08:00:00Z',
      dataLiquidacaoSpi: '2026-03-10T08:00:00.640Z',
      endToEndIdBacen: 'E60701190202603100800a94b81c201',
      statusCobranca: StatusCobrancaPix.LIQUIDADA_SUCESSO,
      tempoLiquidacaoMs: 640,
      tentativasRealizadas: 1,
      splitReceitaPropriaBrl: 42.0,
      splitRepasseProdutorBrl: 262.5,
      splitRetencaoFidcBrl: 42.0,
      splitCompensacaoEsgBrl: 3.5,
      lancamentoContabilRef: 'LAN-CTB-PIX-2026-0984',
      criadoEm: '2026-03-10T08:00:00Z',
    },
    {
      id: 'cob-002',
      codigoCobranca: 'COB-PIX-2026-0043',
      mandatoId: 'man-002',
      clienteNome: 'Rodrigo Albuquerque Lima',
      valorCobradoBrl: 180.0,
      competenciaMesAno: '2026-03',
      dataAgendada: '2026-03-15T08:00:00Z',
      dataLiquidacaoSpi: '2026-03-15T08:00:00.580Z',
      endToEndIdBacen: 'E00000000202603150800b73c91d402',
      statusCobranca: StatusCobrancaPix.LIQUIDADA_SUCESSO,
      tempoLiquidacaoMs: 580,
      tentativasRealizadas: 1,
      splitReceitaPropriaBrl: 21.6,
      splitRepasseProdutorBrl: 135.0,
      splitRetencaoFidcBrl: 21.6,
      splitCompensacaoEsgBrl: 1.8,
      lancamentoContabilRef: 'LAN-CTB-PIX-2026-0985',
      criadoEm: '2026-03-15T08:00:00Z',
    },
    {
      id: 'cob-003',
      codigoCobranca: 'COB-PIX-2026-0044',
      mandatoId: 'man-003',
      clienteNome: 'Juliana Mendes Carvalho',
      valorCobradoBrl: 1200.0,
      competenciaMesAno: '2026-04',
      dataAgendada: '2026-04-05T07:00:00Z',
      dataLiquidacaoSpi: '2026-04-05T07:00:00.612Z',
      endToEndIdBacen: 'E00360305202604050700c82d02e503',
      statusCobranca: StatusCobrancaPix.LIQUIDADA_SUCESSO,
      tempoLiquidacaoMs: 612,
      tentativasRealizadas: 1,
      splitReceitaPropriaBrl: 144.0,
      splitRepasseProdutorBrl: 900.0,
      splitRetencaoFidcBrl: 144.0,
      splitCompensacaoEsgBrl: 12.0,
      lancamentoContabilRef: 'LAN-CTB-PIX-2026-0986',
      criadoEm: '2026-04-05T07:00:00Z',
    },
  ]);

  // Handler de Criação de Mandato
  const handleCriarMandato = (e: React.FormEvent) => {
    e.preventDefault();
    const novo: PixAutomaticoMandatoDto = {
      id: `man-${Date.now()}`,
      codigoMandato: `MAN-PIX-2026-${(mandatos.length + 1).toString().padStart(4, '0')}`,
      clienteNome,
      clienteCpfCnpj: clienteCpf,
      chavePix,
      ispbBancoParticipante: ispbBanco,
      bancoNome,
      planoAssinaturaNome: planoNome,
      valorLimitePorTransacaoBrl: Number(valorLimite),
      periodicidade,
      statusMandato: StatusMandatoPix.ATIVO,
      diaVencimento: Number(diaVencimento),
      canalAutorizacao: CanalAutorizacaoPix.APP_BANCARIO_QR,
      autorizadoEm: new Date().toISOString(),
      criadoEm: new Date().toISOString(),
    };

    setMandatos([novo, ...mandatos]);
    setKpis((prev) => ({ ...prev, totalMandatosAtivos: prev.totalMandatosAtivos + 1 }));
    setActiveTab('mandatos');
  };

  // Handler de Execução de Cobrança Instantânea
  const handleExecutarDebito = () => {
    setExecutingDebit(true);
    const m = mandatos.find((mandato) => mandato.id === selectedMandatoId) || mandatos[0];

    setTimeout(() => {
      const v = m.valorLimitePorTransacaoBrl;
      const nova: PixAutomaticoCobrancaDto = {
        id: `cob-${Date.now()}`,
        codigoCobranca: `COB-PIX-2026-${(cobrancas.length + 1).toString().padStart(4, '0')}`,
        mandatoId: m.id,
        clienteNome: m.clienteNome,
        valorCobradoBrl: v,
        competenciaMesAno: '2026-04',
        dataAgendada: new Date().toISOString(),
        dataLiquidacaoSpi: new Date().toISOString(),
        endToEndIdBacen: `E${m.ispbBancoParticipante}202604031400pixauto${Math.floor(Math.random() * 1000)}`,
        statusCobranca: StatusCobrancaPix.LIQUIDADA_SUCESSO,
        tempoLiquidacaoMs: 590,
        tentativasRealizadas: 1,
        splitReceitaPropriaBrl: Number((v * 0.12).toFixed(2)),
        splitRepasseProdutorBrl: Number((v * 0.75).toFixed(2)),
        splitRetencaoFidcBrl: Number((v * 0.12).toFixed(2)),
        splitCompensacaoEsgBrl: Number((v * 0.01).toFixed(2)),
        lancamentoContabilRef: `LAN-CTB-PIX-2026-${Date.now().toString().slice(-4)}`,
        criadoEm: new Date().toISOString(),
      };

      setCobrancas([nova, ...cobrancas]);
      setExecutingDebit(false);
      setIsModalCobrancaOpen(false);
      setActiveTab('cobrancas');
    }, 800);
  };

  // Handler de Cancelamento
  const handleCancelarMandato = (id: string) => {
    setMandatos(
      mandatos.map((m) =>
        m.id === id
          ? {
              ...m,
              statusMandato: StatusMandatoPix.CANCELADO_USUARIO,
              canceladoEm: new Date().toISOString(),
              motivoCancelamento: 'Cancelamento formal solicitado via canal Bacen',
            }
          : m,
      ),
    );
    setKpis((prev) => ({ ...prev, totalMandatosAtivos: Math.max(0, prev.totalMandatosAtivos - 1) }));
  };

  // Handler de Simulação Smart Retry
  const handleSimularSmartRetry = (id: string) => {
    setRetryResult({
      cobrancaId: id,
      horarioRecomendadoIa: '07:15:00 (Janela de Compensação Salarial Bacen)',
      probabilidadeSaldoSuficientePercent: 96.8,
      motivoOtimizacao:
        'Análise preditiva de liquidez Open Finance detectou pico de saldo disponível nas primeiras horas da manhã do 5º dia útil.',
    });
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* HEADER PRINCIPAL */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2.5 bg-gradient-to-tr from-emerald-600 via-teal-600 to-indigo-700 rounded-xl text-white shadow-md">
              <Zap className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                Pix Automático & Débito Recorrente Omnichannel
                <span className="px-2.5 py-0.5 text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 rounded-full border border-emerald-300 dark:border-emerald-800">
                  Resoluções BCB 430 & 431
                </span>
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Liquidação sub-segundo no Sistema de Pagamentos Instantâneos (SPI), split quádruplo e motor de smart retries por IA.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('smart-retry')}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white dark:bg-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 rounded-lg shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition"
          >
            <Sparkles className="w-4 h-4 text-violet-500" />
            Smart Retries IA
          </button>
          <button
            onClick={() => setIsModalCobrancaOpen(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition"
          >
            <Zap className="w-4 h-4" />
            Simular Débito Recorrente SPI
          </button>
        </div>
      </div>

      {/* TOP 4 KPIS EXECUTIVOS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Volume Mensal Liquidado</span>
            <span className="p-1.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 rounded-lg">
              <DollarSign className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
            R$ {(kpis.volumeMensalLiquidadoBrl / 1000000).toFixed(2)}M
          </p>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
            <TrendingUp className="w-3.5 h-3.5" />
            +18.4% vs mês anterior (SPI Nativo)
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Mandatos Ativos</span>
            <span className="p-1.5 bg-blue-50 dark:bg-blue-950/40 text-blue-600 rounded-lg">
              <RotateCcw className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
            {kpis.totalMandatosAtivos.toLocaleString('pt-BR')}
          </p>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-blue-600 dark:text-blue-400 font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            Autorizações digitais sem churn de cartão
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Sucesso na 1ª Tentativa</span>
            <span className="p-1.5 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 rounded-lg">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
            {kpis.taxaSucessoPrimeiraTentativaPercent.toFixed(1)}%
          </p>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-500 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-violet-500" />
            {kpis.taxaRecuperacaoSmartRetryPercent}% após Smart Retries IA
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Tempo Médio Liquidação SPI</span>
            <span className="p-1.5 bg-purple-50 dark:bg-purple-950/40 text-purple-600 rounded-lg">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-2">
            {kpis.tempoMedioLiquidacaoSpiMs} ms
          </p>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-500 font-medium">
            Sub-segundo direto no Banco Central
          </div>
        </div>
      </div>

      {/* ABAS DO MÓDULO */}
      <div className="border-b border-slate-200 dark:border-slate-800">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('mandatos')}
            className={`py-3 px-1 border-b-2 font-medium text-sm transition-all flex items-center gap-2 ${
              activeTab === 'mandatos'
                ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            <RotateCcw className="w-4 h-4" />
            Gestão de Mandatos ({mandatos.length})
          </button>

          <button
            onClick={() => setActiveTab('cobrancas')}
            className={`py-3 px-1 border-b-2 font-medium text-sm transition-all flex items-center gap-2 ${
              activeTab === 'cobrancas'
                ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            <Zap className="w-4 h-4" />
            Esteira de Débitos & Split SPI ({cobrancas.length})
          </button>

          <button
            onClick={() => setActiveTab('smart-retry')}
            className={`py-3 px-1 border-b-2 font-medium text-sm transition-all flex items-center gap-2 ${
              activeTab === 'smart-retry'
                ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            <Sparkles className="w-4 h-4 text-violet-500" />
            Smart Retries & IA Preditiva
          </button>

          <button
            onClick={() => setActiveTab('novo-mandato')}
            className={`py-3 px-1 border-b-2 font-medium text-sm transition-all flex items-center gap-2 ${
              activeTab === 'novo-mandato'
                ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            <QrCode className="w-4 h-4" />
            Novo Mandato (QR Code Bacen)
          </button>
        </nav>
      </div>

      {/* CONTEÚDO DAS ABAS */}

      {/* ABA 1: GESTÃO DE MANDATOS */}
      {activeTab === 'mandatos' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-slate-800 dark:text-white">
                  Mandatos Digitais de Débito Homologados no Banco Central
                </h3>
                <p className="text-xs text-slate-500">
                  Autorizações prévias do titular para débitos automáticos recorrentes sem retenção de limite de cartão.
                </p>
              </div>
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full">
                Conforme Resolução BCB nº 430/2024
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
                <thead className="bg-slate-50 dark:bg-slate-800 text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
                  <tr>
                    <th className="py-3 px-4">Mandato / Cliente</th>
                    <th className="py-3 px-4">Banco PSP Participante</th>
                    <th className="py-3 px-4">Plano / Passaporte</th>
                    <th className="py-3 px-4 text-right">Limite Débito</th>
                    <th className="py-3 px-4 text-center">Vencimento</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {mandatos.map((m) => (
                    <tr key={m.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition">
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900 dark:text-white">{m.clienteNome}</div>
                        <div className="text-xs font-mono text-slate-400">{m.codigoMandato} • CPF: {m.clienteCpfCnpj}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-slate-800 dark:text-slate-200">{m.bancoNome}</div>
                        <div className="text-xs font-mono text-slate-400">ISPB: {m.ispbBancoParticipante}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded">
                          {m.planoAssinaturaNome}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-slate-900 dark:text-white">
                        R$ {m.valorLimitePorTransacaoBrl.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="text-xs font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                          Todo dia {m.diaVencimento}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
                            m.statusMandato === StatusMandatoPix.ATIVO
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                          }`}
                        >
                          {m.statusMandato === StatusMandatoPix.ATIVO ? (
                            <>
                              <Check className="w-3 h-3" /> Ativo
                            </>
                          ) : (
                            <>
                              <X className="w-3 h-3" /> Cancelado
                            </>
                          )}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {m.statusMandato === StatusMandatoPix.ATIVO && (
                          <button
                            onClick={() => handleCancelarMandato(m.id)}
                            className="text-xs text-rose-600 hover:text-rose-800 font-semibold px-2 py-1 rounded hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                          >
                            Revogar Mandato
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ABA 2: ESTEIRA DE COBRANÇAS & SPLIT NO SPI */}
      {activeTab === 'cobrancas' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-slate-800 dark:text-white">
                  Débitos Liquidados Instantaneamente no SPI (Split em 4 Vias)
                </h3>
                <p className="text-xs text-slate-500">
                  Conciliação automática sub-segundo no razão com registro Bacen EndToEndId.
                </p>
              </div>
              <span className="text-xs text-purple-600 dark:text-purple-400 font-semibold bg-purple-50 dark:bg-purple-950/60 px-2.5 py-1 rounded-full">
                Zero Gateway Intermediário
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
                <thead className="bg-slate-50 dark:bg-slate-800 text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
                  <tr>
                    <th className="py-3 px-4">Código / Cliente</th>
                    <th className="py-3 px-4 text-right">Valor Total</th>
                    <th className="py-3 px-4 text-center">Liquidação SPI</th>
                    <th className="py-3 px-4">Split Quádruplo (Disk / Produtor / FIDC / ESG)</th>
                    <th className="py-3 px-4">EndToEndId Bacen</th>
                    <th className="py-3 px-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {cobrancas.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition">
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900 dark:text-white">{c.codigoCobranca}</div>
                        <div className="text-xs text-slate-400">{c.clienteNome} • Comp: {c.competenciaMesAno}</div>
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-slate-900 dark:text-white">
                        R$ {c.valorCobradoBrl.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="inline-flex items-center gap-1 text-xs bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded font-mono text-purple-600 dark:text-purple-400 font-semibold">
                          <Clock className="w-3 h-3" />
                          {c.tempoLiquidacaoMs} ms
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2 text-xs">
                          <span className="bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 px-1.5 py-0.5 rounded font-medium">
                            Disk: R$ {c.splitReceitaPropriaBrl.toFixed(2)} (12%)
                          </span>
                          <span className="bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded font-medium">
                            Prod: R$ {c.splitRepasseProdutorBrl.toFixed(2)} (75%)
                          </span>
                          <span className="bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 px-1.5 py-0.5 rounded font-medium">
                            FIDC: R$ {c.splitRetencaoFidcBrl.toFixed(2)} (12%)
                          </span>
                          <span className="bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 px-1.5 py-0.5 rounded font-medium">
                            ESG: R$ {c.splitCompensacaoEsgBrl.toFixed(2)} (1%)
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-xs text-slate-500">
                        {c.endToEndIdBacen}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                          <CheckCircle2 className="w-3 h-3" /> Liquidado SPI
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ABA 3: SMART RETRIES & IA PREDITIVA */}
      {activeTab === 'smart-retry' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-5">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-violet-500" />
                Motor de Smart Retries por Inteligência Artificial
              </h3>
              <p className="text-xs text-slate-500">
                Algoritmo preditivo de análise de liquidez que agenda retentativas automáticas nos horários com maior histórico de saldo positivo em conta.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                <span className="text-xs font-semibold uppercase text-slate-400">Janela Ideal Matutina</span>
                <p className="text-xl font-bold text-slate-900 dark:text-white">06:00 às 11:30</p>
                <p className="text-xs text-slate-500">
                  Compensação de folhas de pagamento e proventos bancários via SPI.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                <span className="text-xs font-semibold uppercase text-slate-400">Taxa de Recuperação</span>
                <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">96.8%</p>
                <p className="text-xs text-slate-500">
                  Inadimplência involuntária reduzida a praticamente zero.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                <span className="text-xs font-semibold uppercase text-slate-400">Notificação Prévia Bacen</span>
                <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400">2 Dias Úteis</p>
                <p className="text-xs text-slate-500">
                  Aviso push e webhook disparados ao pagador antes do débito programado.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">Simulador de Otimização de Janela para Cobrança Pendente:</h4>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleSimularSmartRetry('cob-001')}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-2 shadow-sm transition"
                >
                  <Sparkles className="w-4 h-4 text-violet-300" />
                  Calcular Janela Ótima de Débito
                </button>
              </div>

              {retryResult && (
                <div className="p-4 bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900 rounded-xl text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-indigo-900 dark:text-indigo-200">
                      Recomendação da IA: {retryResult.horarioRecomendadoIa}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      Probabilidade de Saldo: {retryResult.probabilidadeSaldoSuficientePercent}%
                    </span>
                  </div>
                  <p className="text-indigo-800 dark:text-indigo-300">{retryResult.motivoOtimizacao}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ABA 4: NOVO MANDATO / QR CODE */}
      {activeTab === 'novo-mandato' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Formulário */}
            <form onSubmit={handleCriarMandato} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-4">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Cadastrar Mandato de Débito Recorrente
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Nome do Cliente / Titular</label>
                  <input
                    type="text"
                    value={clienteNome}
                    onChange={(e) => setClienteNome(e.target.value)}
                    required
                    className="w-full text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">CPF / CNPJ</label>
                    <input
                      type="text"
                      value={clienteCpf}
                      onChange={(e) => setClienteCpf(e.target.value)}
                      required
                      className="w-full text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Chave Pix</label>
                    <input
                      type="text"
                      value={chavePix}
                      onChange={(e) => setChavePix(e.target.value)}
                      required
                      className="w-full text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Banco PSP Participante</label>
                    <input
                      type="text"
                      value={bancoNome}
                      onChange={(e) => setBancoNome(e.target.value)}
                      required
                      className="w-full text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">ISPB Bacen</label>
                    <input
                      type="text"
                      value={ispbBanco}
                      onChange={(e) => setIspbBanco(e.target.value)}
                      required
                      className="w-full text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Plano / Passaporte de Bilheteria</label>
                  <input
                    type="text"
                    value={planoNome}
                    onChange={(e) => setPlanoNome(e.target.value)}
                    required
                    className="w-full text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Valor Limite por Débito (R$)</label>
                    <input
                      type="number"
                      value={valorLimite}
                      onChange={(e) => setValorLimite(Number(e.target.value))}
                      required
                      className="w-full text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Dia do Vencimento</label>
                    <input
                      type="number"
                      min={1}
                      max={31}
                      value={diaVencimento}
                      onChange={(e) => setDiaVencimento(Number(e.target.value))}
                      required
                      className="w-full text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-semibold shadow-sm transition flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                Registrar e Homologar Mandato
              </button>
            </form>

            {/* QR Code de Demonstração Bacen */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 flex flex-col items-center justify-center space-y-4 text-center">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Autorização Instantânea pelo App do Banco
              </span>
              <div className="p-4 bg-white rounded-2xl shadow-lg border-2 border-emerald-500/30">
                <QrCode className="w-48 h-48 text-slate-900" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">Escaneie com o App do seu Banco</h4>
                <p className="text-xs text-slate-500 max-w-xs">
                  O pagador confirma o débito de R$ {Number(valorLimite).toFixed(2)}/mês uma única vez diretamente no ambiente seguro do banco participante.
                </p>
              </div>
              <span className="text-[11px] font-mono bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full text-slate-600 dark:text-slate-300">
                Protocolo Bacen: 00020126580014br.gov.bcb.pix...
              </span>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE EXECUÇÃO DE DÉBITO */}
      {isModalCobrancaOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 rounded-xl">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Executar Cobrança Pix Automático
                </h3>
                <p className="text-xs text-slate-500">Disparo direto no Sistema de Pagamentos Instantâneos (SPI)</p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Selecione o Mandato Ativo
                </label>
                <select
                  value={selectedMandatoId}
                  onChange={(e) => setSelectedMandatoId(e.target.value)}
                  className="w-full text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white"
                >
                  {mandatos
                    .filter((m) => m.statusMandato === StatusMandatoPix.ATIVO)
                    .map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.codigoMandato} - {m.clienteNome} (R$ {m.valorLimitePorTransacaoBrl.toFixed(2)})
                      </option>
                    ))}
                </select>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg text-slate-500 leading-relaxed text-[11px]">
                ℹ️ O valor será liquidado em sub-segundo no Banco Central e dividido automaticamente em 4 vias:
                12% DiskIngressos, 75% Produtor, 12% FIDC e 1% Borderô Verde ESG.
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setIsModalCobrancaOpen(false)}
                disabled={executingDebit}
                className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleExecutarDebito}
                disabled={executingDebit}
                className="px-5 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm flex items-center gap-2 transition"
              >
                {executingDebit ? (
                  <>
                    <Clock className="w-4 h-4 animate-spin" />
                    Liquidando SPI...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    Confirmar Débito SPI
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
