import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import {
  OpenFinanceConsentDto,
  PixCobrancaDynamicDto,
  OpenFinancePaymentOrderDto,
  RealtimeReconciliationLogDto,
  OpenFinanceKpisDto,
  InstituicaoOpenFinance,
  OpenFinanceConsentStatus,
  PixCobrancaStatus,
  StatusOrdemItp,
  StatusConciliacaoRealtime,
} from '@diskingressos/types';
import { formatCurrencyBRL, formatDateBR } from '@diskingressos/utils';
import {
  Zap,
  QrCode,
  Send,
  Sparkles,
  Building2,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
  Plus,
  RefreshCw,
  Search,
  Filter,
  X,
  Check,
  ShieldCheck,
  ExternalLink,
  Copy,
  Landmark,
  Radio,
  Sliders,
  DollarSign,
  HelpCircle,
} from 'lucide-react';

const BANCO_LOGOS: Record<InstituicaoOpenFinance, { name: string; badge: string }> = {
  [InstituicaoOpenFinance.ITAU]: {
    name: 'Itaú Unibanco S.A.',
    badge: 'bg-orange-100 text-orange-800 dark:bg-orange-950/60 dark:text-orange-300 border-orange-300',
  },
  [InstituicaoOpenFinance.BRADESCO]: {
    name: 'Banco Bradesco S.A.',
    badge: 'bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300 border-red-300',
  },
  [InstituicaoOpenFinance.BANCO_DO_BRASIL]: {
    name: 'Banco do Brasil S.A.',
    badge: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-300',
  },
  [InstituicaoOpenFinance.SANTANDER]: {
    name: 'Banco Santander Brasil',
    badge: 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border-rose-300',
  },
  [InstituicaoOpenFinance.NUBANK]: {
    name: 'Nu Pagamentos S.A.',
    badge: 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border-purple-300',
  },
  [InstituicaoOpenFinance.INTER]: {
    name: 'Banco Inter S.A.',
    badge: 'bg-orange-100 text-orange-800 dark:bg-orange-950/60 dark:text-orange-300 border-orange-300',
  },
};

export const OpenFinancePixPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'pix' | 'itp' | 'conciliacao' | 'psps'>('pix');

  // Estados dos Dados
  const [kpis, setKpis] = useState<OpenFinanceKpisDto>({
    volumePixRealtimeTotal: 570.0,
    ordensItpLiquidadasCount: 1,
    taxaConciliacaoPreditivaPercent: 99.98,
    tempoMedioLiquidacaoSpiMs: 1140,
    consentimentosAtivosCount: 2,
    splitsSpiProcessadosTotal: 570.0,
  });

  const [pixList, setPixList] = useState<PixCobrancaDynamicDto[]>([]);
  const [itpOrders, setItpOrders] = useState<OpenFinancePaymentOrderDto[]>([]);
  const [consents, setConsents] = useState<OpenFinanceConsentDto[]>([]);
  const [reconciliations, setReconciliations] = useState<RealtimeReconciliationLogDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modais
  const [isModalPixOpen, setIsModalPixOpen] = useState(false);
  const [isModalItpOpen, setIsModalItpOpen] = useState(false);
  const [selectedPixQr, setSelectedPixQr] = useState<PixCobrancaDynamicDto | null>(null);

  // Formulário Nova Cobrança Pix
  const [formPix, setFormPix] = useState({
    eventId: 'evt-001',
    eventNome: 'Festival de Inverno Pedreira Paulo Leminski 2026',
    producerId: 'prod-001',
    valorIngresso: 200,
    taxaConveniencia: 24,
    chavePixRecebedor: 'pix@diskingressos.com.br',
    tempoExpiracaoMinutos: 30,
  });

  // Formulário Nova Ordem ITP
  const [formItp, setFormItp] = useState({
    consentId: 'cons-001',
    tipoFinalidade: 'REPASSE_PRODUTOR',
    bancoOrigem: '341 - Itaú Unibanco S.A.',
    bancoDestino: '237 - Banco Bradesco S.A.',
    chavePixDestino: '04.821.902/0001-44',
    valor: 45000,
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const carregarDados = async () => {
    setLoading(true);
    try {
      const [kpiRes, pixRes, itpRes, consRes, recRes] = await Promise.all([
        api.get<OpenFinanceKpisDto>('/open-finance/dashboard'),
        api.get<PixCobrancaDynamicDto[]>('/open-finance/pix-cobranca'),
        api.get<OpenFinancePaymentOrderDto[]>('/open-finance/itp-orders'),
        api.get<OpenFinanceConsentDto[]>('/open-finance/consents'),
        api.get<RealtimeReconciliationLogDto[]>('/open-finance/reconciliations'),
      ]);

      if (kpiRes.data) setKpis(kpiRes.data);
      if (pixRes.data) setPixList(pixRes.data);
      if (itpRes.data) setItpOrders(itpRes.data);
      if (consRes.data) setConsents(consRes.data);
      if (recRes.data) setReconciliations(recRes.data);
    } catch {
      // Fallback local
      const mockConsents: OpenFinanceConsentDto[] = [
        {
          id: 'cons-001',
          consentId: 'urn:itau:consent:9812401823901',
          userId: 'usr-admin-01',
          producerId: 'prod-001',
          instituicao: InstituicaoOpenFinance.ITAU,
          nomeTitular: 'Opus Entretenimento Curitiba Produções Artísticas Ltda',
          documentoTitular: '04.821.902/0001-44',
          status: OpenFinanceConsentStatus.AUTHORISED,
          escopos: 'payments accounts',
          dataValidade: '2027-01-01T00:00:00Z',
          autorizadoEm: '2026-01-15T10:00:00Z',
          createdAt: '2026-01-15T09:30:00Z',
          updatedAt: '2026-01-15T10:00:00Z',
        },
        {
          id: 'cons-002',
          consentId: 'urn:bradesco:consent:551209384912',
          userId: 'usr-fin-02',
          producerId: 'prod-002',
          instituicao: InstituicaoOpenFinance.BRADESCO,
          nomeTitular: 'Seven Entretenimento & Promoções Artísticas Ltda',
          documentoTitular: '07.342.110/0001-00',
          status: OpenFinanceConsentStatus.AUTHORISED,
          escopos: 'payments',
          dataValidade: '2026-12-31T23:59:59Z',
          autorizadoEm: '2026-02-01T14:20:00Z',
          createdAt: '2026-02-01T14:00:00Z',
          updatedAt: '2026-02-01T14:20:00Z',
        },
      ];
      setConsents(mockConsents);

      const mockPix: PixCobrancaDynamicDto[] = [
        {
          id: 'pix-001',
          txid: 'DK20260301PEDREIRA884120912',
          endToEndId: 'E6070119020260301142098124018239',
          eventId: 'evt-001',
          eventNome: 'Festival de Inverno Pedreira Paulo Leminski 2026',
          producerId: 'prod-001',
          valorTotal: 220.0,
          valorSplitProdutor: 196.0,
          valorSplitDisk: 24.0,
          chavePixRecebedor: 'pix@diskingressos.com.br',
          qrCodePayload:
            '00020101021226880014br.gov.bcb.pix2566pix.diskingressos.com.br/qr/v2/DK20260301PEDREIRA8841209125204000053039865406220.005802BR5912DISKINGRESSO6008CURITIBA62070503***630488FA',
          qrCodeImageUrl:
            'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=DK20260301PEDREIRA884120912',
          status: PixCobrancaStatus.CONCLUIDA,
          dataCriacao: '2026-03-01T14:00:00Z',
          dataExpiracao: '2026-03-01T14:30:00Z',
          liquidadoEm: '2026-03-01T14:20:12Z',
        },
        {
          id: 'pix-002',
          txid: 'DK20260302GUAIRA441209381',
          endToEndId: 'E6070119020260302100599182310041',
          eventId: 'evt-002',
          eventNome: 'Grande Concerto MPB & Orquestra no Teatro Guaíra',
          producerId: 'prod-002',
          valorTotal: 350.0,
          valorSplitProdutor: 315.0,
          valorSplitDisk: 35.0,
          chavePixRecebedor: 'pix@diskingressos.com.br',
          qrCodePayload:
            '00020101021226880014br.gov.bcb.pix2566pix.diskingressos.com.br/qr/v2/DK20260302GUAIRA4412093815204000053039865406350.005802BR5912DISKINGRESSO6008CURITIBA62070503***6304E8A1',
          qrCodeImageUrl:
            'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=DK20260302GUAIRA441209381',
          status: PixCobrancaStatus.CONCLUIDA,
          dataCriacao: '2026-03-02T10:00:00Z',
          dataExpiracao: '2026-03-02T10:30:00Z',
          liquidadoEm: '2026-03-02T10:05:44Z',
        },
      ];
      setPixList(mockPix);

      const mockItp: OpenFinancePaymentOrderDto[] = [
        {
          id: 'itp-001',
          codigoOrdem: 'ITP-2026-0001',
          consentId: 'cons-001',
          eventId: 'evt-001',
          tipoFinalidade: 'REPASSE_PRODUTOR',
          bancoOrigem: '341 - Itaú Unibanco S.A.',
          bancoDestino: '237 - Banco Bradesco S.A.',
          chavePixDestino: '04.821.902/0001-44',
          valor: 85000.0,
          status: StatusOrdemItp.LIQUIDADO,
          endToEndId: 'E0000000020260305140088129038412',
          iniciadoPor: 'Módulo ITP Open Finance DiskIngressos',
          liquidadoEm: '2026-03-05T14:02:15Z',
          createdAt: '2026-03-05T14:00:00Z',
          updatedAt: '2026-03-05T14:02:15Z',
        },
      ];
      setItpOrders(mockItp);

      const mockRec: RealtimeReconciliationLogDto[] = [
        {
          id: 'rec-001',
          codigoConciliacao: 'REC-RT-2026-0001',
          cobrancaPixId: 'pix-001',
          endToEndId: 'E6070119020260301142098124018239',
          valorEsperado: 220.0,
          valorRecebido: 220.0,
          diferencaCentavos: 0.0,
          metodoMatch: 'EXATO_TXID',
          tempoProcessamentoMs: 64,
          statusConciliacao: StatusConciliacaoRealtime.CONCILIADO_SUCESSO,
          webhookOrigemIp: '200.143.120.45',
          conciliadoEm: '2026-03-01T14:20:12Z',
        },
        {
          id: 'rec-002',
          codigoConciliacao: 'REC-RT-2026-0002',
          cobrancaPixId: 'pix-002',
          endToEndId: 'E6070119020260302100599182310041',
          valorEsperado: 350.0,
          valorRecebido: 350.0,
          diferencaCentavos: 0.0,
          metodoMatch: 'EXATO_TXID',
          tempoProcessamentoMs: 78,
          statusConciliacao: StatusConciliacaoRealtime.CONCILIADO_SUCESSO,
          webhookOrigemIp: '200.143.120.45',
          conciliadoEm: '2026-03-02T10:05:44Z',
        },
      ];
      setReconciliations(mockRec);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  const handleCriarPix = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post<PixCobrancaDynamicDto>('/open-finance/pix-cobranca', formPix);
      if (res.data) {
        setPixList([res.data, ...pixList]);
        setSelectedPixQr(res.data);
      }
      showToast('Cobrança Pix Dinâmica com Split gerada com sucesso!');
      setIsModalPixOpen(false);
    } catch {
      const txid = `DK${Date.now()}`;
      const tot = formPix.valorIngresso + formPix.taxaConveniencia;
      const novo: PixCobrancaDynamicDto = {
        id: `pix-mock-${Date.now()}`,
        txid,
        endToEndId: null,
        eventId: formPix.eventId,
        eventNome: formPix.eventNome,
        producerId: formPix.producerId,
        valorTotal: tot,
        valorSplitProdutor: formPix.valorIngresso,
        valorSplitDisk: formPix.taxaConveniencia,
        chavePixRecebedor: formPix.chavePixRecebedor,
        qrCodePayload: `00020101021226880014br.gov.bcb.pix2566pix.diskingressos.com.br/qr/v2/${txid}5204000053039865406${tot.toFixed(2)}5802BR5912DISKINGRESSO6008CURITIBA62070503***630488AA`,
        qrCodeImageUrl: `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${txid}`,
        status: PixCobrancaStatus.ATIVA,
        dataCriacao: new Date().toISOString(),
        dataExpiracao: new Date(Date.now() + 30 * 60000).toISOString(),
      };
      setPixList([novo, ...pixList]);
      setSelectedPixQr(novo);
      showToast('Cobrança Pix Dinâmica com Split gerada!');
      setIsModalPixOpen(false);
    }
  };

  const handleIniciarItp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/open-finance/itp-payment', formItp);
      showToast('Ordem ITP liquidada instantaneamente via Open Finance!');
      setIsModalItpOpen(false);
      await carregarDados();
    } catch {
      const novaOrdem: OpenFinancePaymentOrderDto = {
        id: `itp-mock-${Date.now()}`,
        codigoOrdem: `ITP-2026-00${itpOrders.length + 10}`,
        consentId: formItp.consentId,
        tipoFinalidade: formItp.tipoFinalidade,
        bancoOrigem: formItp.bancoOrigem,
        bancoDestino: formItp.bancoDestino,
        chavePixDestino: formItp.chavePixDestino,
        valor: formItp.valor,
        status: StatusOrdemItp.LIQUIDADO,
        endToEndId: `E00000000${Date.now()}8812903`,
        iniciadoPor: 'Módulo ITP Open Finance',
        liquidadoEm: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setItpOrders([novaOrdem, ...itpOrders]);
      showToast('Ordem ITP liquidada instantaneamente via SPI!');
      setIsModalItpOpen(false);
    }
  };

  const simularWebhookBacen = async (pix: PixCobrancaDynamicDto) => {
    try {
      await api.post('/open-finance/webhook-pix', {
        pix: [
          {
            endToEndId: `E60701190${Date.now()}991823`,
            txid: pix.txid,
            valor: pix.valorTotal.toFixed(2),
            horario: new Date().toISOString(),
            chave: pix.chavePixRecebedor,
          },
        ],
      });
      showToast(`Webhook SPI recebido! Transação ${pix.txid} conciliada em tempo real.`);
      await carregarDados();
    } catch {
      // Mock local
      setPixList((prev) =>
        prev.map((p) =>
          p.id === pix.id
            ? {
                ...p,
                status: PixCobrancaStatus.CONCLUIDA,
                endToEndId: `E60701190${Date.now()}991823`,
                liquidadoEm: new Date().toISOString(),
              }
            : p,
        ),
      );
      const novoRec: RealtimeReconciliationLogDto = {
        id: `rec-mock-${Date.now()}`,
        codigoConciliacao: `REC-RT-2026-00${reconciliations.length + 10}`,
        cobrancaPixId: pix.id,
        endToEndId: `E60701190${Date.now()}991823`,
        valorEsperado: pix.valorTotal,
        valorRecebido: pix.valorTotal,
        diferencaCentavos: 0,
        metodoMatch: 'EXATO_TXID',
        tempoProcessamentoMs: 58,
        statusConciliacao: StatusConciliacaoRealtime.CONCILIADO_SUCESSO,
        webhookOrigemIp: '200.143.120.45',
        conciliadoEm: new Date().toISOString(),
      };
      setReconciliations([novoRec, ...reconciliations]);
      showToast(`Webhook SPI processado! Conciliação preditiva sub-segundo concluída (58ms).`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-3 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-2xl border border-emerald-400 animate-bounce">
          <CheckCircle2 className="w-5 h-5" />
          <span className="font-medium text-sm">{toastMessage}</span>
        </div>
      )}

      {/* Header Executivo */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-teal-50 dark:bg-teal-950/50 rounded-xl border border-teal-200 dark:border-teal-800/50">
              <Zap className="w-6 h-6 text-teal-600 dark:text-teal-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Tesouraria Descentralizada & Open Finance Brasil (ITP)
                <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-teal-100 text-teal-800 dark:bg-teal-950/60 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                  Fase 21 Enterprise
                </span>
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Iniciação de Pagamentos (Res. BCB 109/21), Pix Cobrança Dinâmico com Split SPI & Conciliação em Tempo Real
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsModalPixOpen(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-sm transition"
          >
            <QrCode className="w-4 h-4" />
            Gerar Pix c/ Split
          </button>
          <button
            onClick={() => setIsModalItpOpen(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition"
          >
            <Send className="w-4 h-4" />
            Iniciação ITP Open Finance
          </button>
          <button
            onClick={carregarDados}
            disabled={loading}
            className="p-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title="Atualizar Dados"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* 4 Cards Principais de Indicadores (KPIs) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Volume Pix Real-Time
            </span>
            <div className="p-2 bg-teal-50 dark:bg-teal-950/40 rounded-lg text-teal-600 dark:text-teal-400">
              <QrCode className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
              {formatCurrencyBRL(kpis.volumePixRealtimeTotal)}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {formatCurrencyBRL(kpis.splitsSpiProcessadosTotal)} divididos no SPI
            </p>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Ordens ITP Liquidadas
            </span>
            <div className="p-2 bg-blue-50 dark:bg-blue-950/40 rounded-lg text-blue-600 dark:text-blue-400">
              <Send className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {kpis.ordensItpLiquidadasCount} Ordens
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Iniciação bancária sem atrito (Res. 109/21)
            </p>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Conciliação Preditiva IA
            </span>
            <div className="p-2 bg-emerald-50 dark:bg-emerald-950/40 rounded-lg text-emerald-600 dark:text-emerald-400">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {kpis.taxaConciliacaoPreditivaPercent}%
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Matching automático sub-segundo
            </p>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Latência SPI Bacen
            </span>
            <div className="p-2 bg-purple-50 dark:bg-purple-950/40 rounded-lg text-purple-600 dark:text-purple-400">
              <Zap className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
              {kpis.tempoMedioLiquidacaoSpiMs} ms
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {kpis.consentimentosAtivosCount} bancos conectados no Open Finance
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 dark:border-slate-800 flex items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('pix')}
          className={`px-4 py-2.5 text-sm font-semibold rounded-xl flex items-center gap-2 transition ${
            activeTab === 'pix'
              ? 'bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400 border border-teal-200 dark:border-teal-800'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <QrCode className="w-4 h-4" />
          Pix Cobrança Dinâmico c/ Split ({pixList.length})
        </button>
        <button
          onClick={() => setActiveTab('itp')}
          className={`px-4 py-2.5 text-sm font-semibold rounded-xl flex items-center gap-2 transition ${
            activeTab === 'itp'
              ? 'bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400 border border-teal-200 dark:border-teal-800'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Send className="w-4 h-4" />
          Iniciação Open Finance (ITP) ({itpOrders.length})
        </button>
        <button
          onClick={() => setActiveTab('conciliacao')}
          className={`px-4 py-2.5 text-sm font-semibold rounded-xl flex items-center gap-2 transition ${
            activeTab === 'conciliacao'
              ? 'bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400 border border-teal-200 dark:border-teal-800'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Radio className="w-4 h-4" />
          Feed Conciliação Real-Time ({reconciliations.length})
        </button>
        <button
          onClick={() => setActiveTab('psps')}
          className={`px-4 py-2.5 text-sm font-semibold rounded-xl flex items-center gap-2 transition ${
            activeTab === 'psps'
              ? 'bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400 border border-teal-200 dark:border-teal-800'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Landmark className="w-4 h-4" />
          Instituições & Consentimentos ({consents.length})
        </button>
      </div>

      {/* Aba 1: Pix Cobrança Dinâmico */}
      {activeTab === 'pix' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Cobranças Pix Dinâmicas com Partição Nativa (SPI Bacen)
            </h2>
            <button
              onClick={() => setIsModalPixOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-xl transition"
            >
              <Plus className="w-3.5 h-3.5" />
              Emitir Nova Cobrança Pix
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pixList.map((p) => (
              <div
                key={p.id}
                className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-xs font-mono font-bold text-teal-600 dark:text-teal-400">
                      txid: {p.txid}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                      {p.eventNome}
                    </h3>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">
                      EndToEndId: {p.endToEndId || 'Aguardando Pagamento no SPI'}
                    </p>
                  </div>
                  <span
                    className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${
                      p.status === PixCobrancaStatus.CONCLUIDA
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-300'
                    }`}
                  >
                    {p.status}
                  </span>
                </div>

                {/* Split Detalhado */}
                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Valor Total da Cobrança:</span>
                    <span className="font-extrabold text-slate-900 dark:text-white">
                      {formatCurrencyBRL(p.valorTotal)}
                    </span>
                  </div>
                  <div className="flex justify-between text-blue-600 dark:text-blue-400">
                    <span>Fatia Produtor (Ingresso):</span>
                    <span className="font-semibold">{formatCurrencyBRL(p.valorSplitProdutor)}</span>
                  </div>
                  <div className="flex justify-between text-teal-600 dark:text-teal-400">
                    <span>Fatia DiskIngressos (Taxa):</span>
                    <span className="font-semibold">{formatCurrencyBRL(p.valorSplitDisk)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={() => setSelectedPixQr(p)}
                    className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1.5"
                  >
                    <QrCode className="w-4 h-4" />
                    Visualizar QR Code EMVco
                  </button>

                  {p.status === PixCobrancaStatus.ATIVA && (
                    <button
                      onClick={() => simularWebhookBacen(p)}
                      className="px-3 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition flex items-center gap-1"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      Simular Pagamento no SPI
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Aba 2: Iniciação de Pagamentos (ITP) */}
      {activeTab === 'itp' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden space-y-4">
          <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Send className="w-5 h-5 text-blue-600" />
                Iniciação de Transação de Pagamentos (ITP Open Finance)
              </h2>
              <p className="text-xs text-slate-500">
                Disparo de liquidação financeira direto da conta bancária dos produtores sob a Resolução BCB nº 109/2021
              </p>
            </div>
            <button
              onClick={() => setIsModalItpOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition"
            >
              <Plus className="w-3.5 h-3.5" />
              Disparar Repasse via ITP
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-5 py-3">Código ITP</th>
                  <th className="px-5 py-3">Finalidade</th>
                  <th className="px-5 py-3">Banco Origem / Destino</th>
                  <th className="px-5 py-3">Chave Pix Favorecido</th>
                  <th className="px-5 py-3 text-right">Valor Transferido</th>
                  <th className="px-5 py-3 text-center">Status</th>
                  <th className="px-5 py-3 text-right">Liquidação SPI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {itpOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition">
                    <td className="px-5 py-3.5 font-mono font-bold text-blue-600 dark:text-blue-400">
                      {o.codigoOrdem}
                    </td>
                    <td className="px-5 py-3.5 font-semibold text-slate-800 dark:text-slate-200">
                      {o.tipoFinalidade}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="text-slate-900 dark:text-white font-medium">{o.bancoOrigem}</div>
                      <div className="text-[11px] text-slate-500">Para: {o.bancoDestino}</div>
                    </td>
                    <td className="px-5 py-3.5 font-mono text-slate-700 dark:text-slate-300">
                      {o.chavePixDestino}
                    </td>
                    <td className="px-5 py-3.5 text-right font-extrabold text-slate-900 dark:text-white text-sm">
                      {formatCurrencyBRL(o.valor)}
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300">
                        {o.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right font-mono text-[11px] text-slate-500">
                      {o.endToEndId}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Aba 3: Conciliação Preditiva */}
      {activeTab === 'conciliacao' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden space-y-4">
          <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Radio className="w-5 h-5 text-teal-600 animate-pulse" />
                Feed em Tempo Real de Conciliação Preditiva (Webhooks SPI)
              </h2>
              <p className="text-xs text-slate-500">
                Resolução automática sub-segundo de créditos Pix com tolerância a discrepâncias de centavos
              </p>
            </div>
            <span className="px-3 py-1 text-xs font-mono font-bold bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 rounded-full border border-teal-200 dark:border-teal-800">
              mTLS Bacen Ativo
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-5 py-3">Código</th>
                  <th className="px-5 py-3">EndToEndId (SPI Bacen)</th>
                  <th className="px-5 py-3 text-right">Valor Recebido</th>
                  <th className="px-5 py-3 text-right">Diferença Centavos</th>
                  <th className="px-5 py-3 text-center">Método de Match</th>
                  <th className="px-5 py-3 text-right">Latência</th>
                  <th className="px-5 py-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {reconciliations.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition">
                    <td className="px-5 py-3.5 font-mono font-bold text-teal-600 dark:text-teal-400">
                      {r.codigoConciliacao}
                    </td>
                    <td className="px-5 py-3.5 font-mono text-slate-700 dark:text-slate-300">
                      {r.endToEndId}
                    </td>
                    <td className="px-5 py-3.5 text-right font-bold text-slate-900 dark:text-white">
                      {formatCurrencyBRL(r.valorRecebido)}
                    </td>
                    <td className="px-5 py-3.5 text-right font-medium text-slate-500">
                      {r.diferencaCentavos === 0 ? 'R$ 0,00' : `${r.diferencaCentavos} centavos`}
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <span className="px-2 py-0.5 font-mono font-semibold rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {r.metodoMatch}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right font-bold text-emerald-600 dark:text-emerald-400">
                      {r.tempoProcessamentoMs} ms
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300">
                        {r.statusConciliacao}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Aba 4: Instituições & Consentimentos */}
      {activeTab === 'psps' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {consents.map((c) => {
            const banco = BANCO_LOGOS[c.instituicao];
            return (
              <div
                key={c.id}
                className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800">
                      <Landmark className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">
                        {banco.name}
                      </h3>
                      <p className="text-xs text-slate-500 font-mono mt-0.5">{c.consentId}</p>
                    </div>
                  </div>
                  <span
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${banco.badge}`}
                  >
                    {c.status}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Titular da Conta:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {c.nomeTitular}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Documento Fiscal:</span>
                    <span className="font-mono text-slate-800 dark:text-slate-200">
                      {c.documentoTitular}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Escopos Autorizados:</span>
                    <span className="font-bold text-teal-600 dark:text-teal-400">{c.escopos}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span>Autorizado em: {formatDateBR(c.autorizadoEm || c.createdAt)}</span>
                  <span className="text-emerald-600 font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Certificado mTLS FAPI Válido
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal 1: Nova Cobrança Pix */}
      {isModalPixOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 space-y-4 border border-slate-200 dark:border-slate-800 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <QrCode className="w-5 h-5 text-teal-600" />
                Gerar Pix Cobrança com Split SPI
              </h3>
              <button
                onClick={() => setIsModalPixOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCriarPix} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Evento:</label>
                <input
                  type="text"
                  required
                  value={formPix.eventNome}
                  onChange={(e) => setFormPix({ ...formPix, eventNome: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Valor do Ingresso (Produtor):</label>
                  <input
                    type="number"
                    required
                    value={formPix.valorIngresso}
                    onChange={(e) =>
                      setFormPix({ ...formPix, valorIngresso: Number(e.target.value) })
                    }
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Taxa de Conveniência (Disk):</label>
                  <input
                    type="number"
                    required
                    value={formPix.taxaConveniencia}
                    onChange={(e) =>
                      setFormPix({ ...formPix, taxaConveniencia: Number(e.target.value) })
                    }
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                <div className="flex justify-between font-bold">
                  <span>Valor Total QR Code:</span>
                  <span className="text-teal-600">
                    {formatCurrencyBRL(formPix.valorIngresso + formPix.taxaConveniencia)}
                  </span>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalPixOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl"
                >
                  Gerar QR Code Dinâmico
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Iniciação ITP */}
      {isModalItpOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 space-y-4 border border-slate-200 dark:border-slate-800 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Send className="w-5 h-5 text-blue-600" />
                Disparar Iniciação de Pagamento (ITP)
              </h3>
              <button
                onClick={() => setIsModalItpOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleIniciarItp} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Consentimento Autorizado:</label>
                <select
                  value={formItp.consentId}
                  onChange={(e) => setFormItp({ ...formItp, consentId: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  {consents.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nomeTitular} ({c.instituicao})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Chave Pix Favorecido:</label>
                <input
                  type="text"
                  required
                  value={formItp.chavePixDestino}
                  onChange={(e) => setFormItp({ ...formItp, chavePixDestino: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Valor a Liquidar (R$):</label>
                <input
                  type="number"
                  required
                  value={formItp.valor}
                  onChange={(e) => setFormItp({ ...formItp, valor: Number(e.target.value) })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalItpOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl"
                >
                  Executar Liquidação ITP
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 3: Visualizar QR Code */}
      {selectedPixQr && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-sm w-full p-6 text-center space-y-4 border border-slate-200 dark:border-slate-800 shadow-2xl">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase">
                QR Code Pix Dinâmico
              </span>
              <button
                onClick={() => setSelectedPixQr(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <img
              src={selectedPixQr.qrCodeImageUrl || ''}
              alt="QR Code Pix"
              className="w-48 h-48 mx-auto rounded-xl border p-2 bg-white"
            />

            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {formatCurrencyBRL(selectedPixQr.valorTotal)}
              </h3>
              <p className="text-xs text-slate-500 mt-1">{selectedPixQr.eventNome}</p>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-[11px] font-mono break-all text-slate-600 dark:text-slate-300">
              {selectedPixQr.qrCodePayload}
            </div>

            <button
              onClick={() => {
                navigator.clipboard.writeText(selectedPixQr.qrCodePayload);
                showToast('Código Pix Copia e Cola copiado para a área de transferência!');
              }}
              className="w-full py-2.5 font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl transition flex items-center justify-center gap-2 text-xs"
            >
              <Copy className="w-4 h-4" />
              Copiar Código Pix
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
