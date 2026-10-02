import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import {
  FiscalInvoiceItem,
  FiscalDashboardSummary,
  StatusDocumentoFiscal,
  TipoDocumentoFiscal,
} from '@diskingressos/types';
import { formatCurrencyBRL, formatDateBR } from '@diskingressos/utils';
import {
  FileCheck2,
  FileText,
  PlusCircle,
  Search,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Building2,
  Layers,
  FileCode,
  Calendar,
  X,
  Copy,
  Check,
} from 'lucide-react';

export const NotasFiscaisPage: React.FC = () => {
  const [invoices, setInvoices] = useState<FiscalInvoiceItem[]>([]);
  const [summary, setSummary] = useState<FiscalDashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [competenciaFilter, setCompetenciaFilter] = useState('2026-09');

  // Modais
  const [isEmitirOpen, setIsEmitirOpen] = useState(false);
  const [isLoteOpen, setIsLoteOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<FiscalInvoiceItem | null>(null);
  const [xmlModalContent, setXmlModalContent] = useState<string | null>(null);
  const [cancelModalInvoice, setCancelModalInvoice] = useState<FiscalInvoiceItem | null>(null);
  const [motivoCancelamento, setMotivoCancelamento] = useState('');
  const [copiedKey, setCopiedKey] = useState(false);

  // Form Individual
  const [formIndividual, setFormIndividual] = useState({
    tomadorTipo: 'PRODUTOR' as 'PRODUTOR' | 'CLIENTE',
    tomadorNome: '',
    tomadorDoc: '',
    tomadorEmail: '',
    tomadorCidade: 'Curitiba',
    tomadorUf: 'PR',
    discriminacao: '',
    valorServicos: '',
    aliquotaIss: '5.0',
    issRetido: false,
    competencia: '2026-09',
  });

  // Form Lote
  const [formLote, setFormLote] = useState({
    eventId: 'evt-rock-arena',
    emitirPara: 'TODOS' as 'PRODUTOR_COMISSAO' | 'CLIENTES_CONVENIENCIA' | 'TODOS',
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [sumRes, invRes]: any = await Promise.all([
        api.get('/fiscal/dashboard', { params: { competencia: competenciaFilter } }),
        api.get('/fiscal/notas', {
          params: {
            competencia: competenciaFilter,
            status: statusFilter !== 'ALL' ? statusFilter : undefined,
          },
        }),
      ]);
      setSummary(sumRes || null);
      setInvoices(invRes || []);
    } catch (err) {
      console.warn('Backend fiscal offline, utilizando dados demonstrativos:', err);
      // Fallback rico e demonstrativo
      const fallbackInvoices: FiscalInvoiceItem[] = [
        {
          id: 'inv-1',
          numeroNota: 'NFS-2026-000001',
          serie: '1',
          tipo: TipoDocumentoFiscal.NFSE,
          status: StatusDocumentoFiscal.AUTORIZADO,
          dataEmissao: '2026-08-25T15:00:00Z',
          competencia: '2026-08',
          codigoVerificacao: '7A9B3F1C',
          chaveAcesso: '20260841069020812345600019900000100000000198',
          tomadorTipo: 'PRODUTOR',
          tomadorNome: 'Curitiba Shows e Eventos Ltda.',
          tomadorDoc: '12.345.678/0001-90',
          tomadorEmail: 'financeiro@curitibashows.com.br',
          tomadorCidade: 'Curitiba',
          tomadorUf: 'PR',
          prestadorCnpj: '08.123.456/0001-99',
          prestadorIm: '123456-7',
          codigoServico: '12.07',
          discriminacao:
            'Comissão contratual de 10% s/ bilheteria do evento Rock Legends Curitiba Arena. Conforme borderô REP-2026-000101.',
          valorServicos: 385000.0,
          valorDeducoes: 0,
          baseCalculo: 385000.0,
          aliquotaIss: 5.0,
          valorIss: 19250.0,
          issRetido: false,
          aliquotaPis: 0.65,
          valorPis: 2502.5,
          aliquotaCofins: 3.0,
          valorCofins: 11550.0,
          valorInss: 0,
          valorIr: 0,
          valorCsll: 0,
          valorLiquido: 385000.0,
          eventNome: 'Rock Legends Curitiba Arena',
          createdAt: '2026-08-25T15:00:00Z',
          xmlContent: `<CompNfse xmlns="http://www.abrasf.org.br/nfse.xsd"><Nfse versao="2.04"><InfNfse Id="NFS-2026-000001"><Numero>000001</Numero><CodigoVerificacao>7A9B3F1C</CodigoVerificacao><DataEmissao>2026-08-25T15:00:00Z</DataEmissao><ValoresNfse><ValorServicos>385000.00</ValorServicos><ValorIss>19250.00</ValorIss><ValorLiquidoNfse>385000.00</ValorLiquidoNfse></ValoresNfse></InfNfse></Nfse></CompNfse>`,
        },
        {
          id: 'inv-2',
          numeroNota: 'NFS-2026-000002',
          serie: '1',
          tipo: TipoDocumentoFiscal.NFSE,
          status: StatusDocumentoFiscal.AUTORIZADO,
          dataEmissao: '2026-08-25T15:10:00Z',
          competencia: '2026-08',
          codigoVerificacao: '8F2D1A4E',
          chaveAcesso: '20260841069020812345600019900000100000000287',
          tomadorTipo: 'CLIENTE',
          tomadorNome: 'CONSUMIDORES FINAIS CONSOLIDADOS (CURITIBA/PR)',
          tomadorDoc: '00.000.000/0000-00',
          tomadorEmail: 'contato@diskingressos.com.br',
          tomadorCidade: 'Curitiba',
          tomadorUf: 'PR',
          prestadorCnpj: '08.123.456/0001-99',
          prestadorIm: '123456-7',
          codigoServico: '12.07',
          discriminacao:
            'Consolidação das taxas de conveniência emitidas na bilheteria online relativas ao evento Rock Legends Curitiba Arena.',
          valorServicos: 385000.0,
          valorDeducoes: 0,
          baseCalculo: 385000.0,
          aliquotaIss: 5.0,
          valorIss: 19250.0,
          issRetido: false,
          aliquotaPis: 0.65,
          valorPis: 2502.5,
          aliquotaCofins: 3.0,
          valorCofins: 11550.0,
          valorInss: 0,
          valorIr: 0,
          valorCsll: 0,
          valorLiquido: 385000.0,
          eventNome: 'Rock Legends Curitiba Arena',
          createdAt: '2026-08-25T15:10:00Z',
          xmlContent: `<CompNfse xmlns="http://www.abrasf.org.br/nfse.xsd"><Nfse versao="2.04"><InfNfse Id="NFS-2026-000002"><Numero>000002</Numero><CodigoVerificacao>8F2D1A4E</CodigoVerificacao><DataEmissao>2026-08-25T15:10:00Z</DataEmissao><ValoresNfse><ValorServicos>385000.00</ValorServicos><ValorIss>19250.00</ValorIss><ValorLiquidoNfse>385000.00</ValorLiquidoNfse></ValoresNfse></InfNfse></Nfse></CompNfse>`,
        },
        {
          id: 'inv-3',
          numeroNota: 'NFS-2026-000003',
          serie: '1',
          tipo: TipoDocumentoFiscal.NFSE,
          status: StatusDocumentoFiscal.AUTORIZADO,
          dataEmissao: '2026-09-10T11:20:00Z',
          competencia: '2026-09',
          codigoVerificacao: '9C4E7B2D',
          chaveAcesso: '20260941069020812345600019900000100000000376',
          tomadorTipo: 'PRODUTOR',
          tomadorNome: 'Live Entretenimento e Grandes Eventos S.A.',
          tomadorDoc: '98.765.432/0001-00',
          tomadorEmail: 'contato@liveentretenimento.com.br',
          tomadorCidade: 'Curitiba',
          tomadorUf: 'PR',
          prestadorCnpj: '08.123.456/0001-99',
          prestadorIm: '123456-7',
          codigoServico: '12.07',
          discriminacao:
            'Serviços de bilheteria e comissão contratual de 9,5% do evento Turnê Especial Marisa Monte.',
          valorServicos: 48000.0,
          valorDeducoes: 0,
          baseCalculo: 48000.0,
          aliquotaIss: 5.0,
          valorIss: 2400.0,
          issRetido: false,
          aliquotaPis: 0.65,
          valorPis: 312.0,
          aliquotaCofins: 3.0,
          valorCofins: 1440.0,
          valorInss: 0,
          valorIr: 0,
          valorCsll: 0,
          valorLiquido: 48000.0,
          eventNome: 'Turnê Especial Marisa Monte',
          createdAt: '2026-09-10T11:20:00Z',
        },
        {
          id: 'inv-4',
          numeroNota: 'NFS-2026-000004',
          serie: '1',
          tipo: TipoDocumentoFiscal.NFSE,
          status: StatusDocumentoFiscal.CANCELADO,
          dataEmissao: '2026-09-12T14:00:00Z',
          competencia: '2026-09',
          codigoVerificacao: '1A2B3C4D',
          chaveAcesso: '20260941069020812345600019900000100000000465',
          tomadorTipo: 'PRODUTOR',
          tomadorNome: 'Opus Entretenimento Regional Sul Ltda.',
          tomadorDoc: '45.678.910/0001-22',
          prestadorCnpj: '08.123.456/0001-99',
          prestadorIm: '123456-7',
          codigoServico: '12.07',
          discriminacao:
            'Agenciamento cancelado por adiamento de espetáculo pelo produtor.',
          valorServicos: 18500.0,
          valorDeducoes: 0,
          baseCalculo: 18500.0,
          aliquotaIss: 5.0,
          valorIss: 925.0,
          issRetido: false,
          aliquotaPis: 0.65,
          valorPis: 120.25,
          aliquotaCofins: 3.0,
          valorCofins: 555.0,
          valorInss: 0,
          valorIr: 0,
          valorCsll: 0,
          valorLiquido: 18500.0,
          eventNome: 'Festival Curitiba 2026',
          motivoCancelamento:
            'Espetáculo transferido de data a pedido do produtor com estorno das taxas.',
          canceladoEm: '2026-09-14T09:30:00Z',
          createdAt: '2026-09-12T14:00:00Z',
        },
      ];

      setInvoices(fallbackInvoices);
      setSummary({
        totalEmitidoMes: 48000.0,
        totalIssMes: 2400.0,
        totalPisCofinsMes: 1752.0,
        totalRetencoesMes: 1488.0,
        totalNotasAutorizadas: 3,
        totalNotasCanceladas: 1,
        eventosPendentesEmissao: 1,
        guiasPendentesRecolhimento: 2,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [competenciaFilter, statusFilter]);

  const handleEmitirIndividual = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formIndividual,
        valorServicos: parseFloat(formIndividual.valorServicos),
        aliquotaIss: parseFloat(formIndividual.aliquotaIss),
      };
      await api.post('/fiscal/notas/emitir', payload);
      alert('NFS-e emitida e autorizada com sucesso na Prefeitura de Curitiba!');
      setIsEmitirOpen(false);
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Erro ao emitir nota fiscal');
    }
  };

  const handleEmitirLote = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/fiscal/notas/emitir-lote-evento', formLote);
      alert('Emissão em lote finalizada! Notas emitidas para o produtor e taxas consolidadas.');
      setIsLoteOpen(false);
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Erro na emissão em lote');
    }
  };

  const handleConfirmarCancelamento = async () => {
    if (!cancelModalInvoice || !motivoCancelamento.trim()) {
      alert('Por favor, informe a justificativa de cancelamento.');
      return;
    }
    try {
      await api.post(`/fiscal/notas/${cancelModalInvoice.id}/cancelar`, {
        motivo: motivoCancelamento,
      });
      alert(`Nota fiscal ${cancelModalInvoice.numeroNota} cancelada com sucesso.`);
      setCancelModalInvoice(null);
      setMotivoCancelamento('');
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Erro ao cancelar nota fiscal');
    }
  };

  const handleCopyChave = (chave: string) => {
    navigator.clipboard.writeText(chave);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const filteredInvoices = invoices.filter((inv) => {
    const term = search.toLowerCase();
    return (
      inv.numeroNota.toLowerCase().includes(term) ||
      inv.tomadorNome.toLowerCase().includes(term) ||
      inv.tomadorDoc.toLowerCase().includes(term) ||
      (inv.eventNome && inv.eventNome.toLowerCase().includes(term))
    );
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FileCheck2 className="w-7 h-7 text-rose-600" />
            Notas Fiscais de Serviços (NFS-e / NF-e)
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Faturamento oficial das taxas de serviço, conveniência e comissões da DiskIngressos
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsLoteOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm transition"
          >
            <Layers className="w-4 h-4" />
            Emissão em Lote por Evento
          </button>
          <button
            onClick={() => setIsEmitirOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold bg-rose-600 text-white hover:bg-rose-700 shadow-sm transition"
          >
            <PlusCircle className="w-4 h-4" />
            Emitir NFS-e Individual
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase">
            <span>Faturamento no Mês (Taxas/Comissões)</span>
            <Building2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
            {formatCurrencyBRL(summary?.totalEmitidoMes || 0)}
          </div>
          <div className="mt-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
            Receita própria tributável DiskIngressos
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase">
            <span>ISSQN Curitiba Gerado (5%)</span>
            <FileText className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
            {formatCurrencyBRL(summary?.totalIssMes || 0)}
          </div>
          <div className="mt-1 text-xs text-indigo-600 dark:text-indigo-400 font-medium">
            Tributo municipal código 12.07
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase">
            <span>PIS / COFINS Provisão</span>
            <CheckCircle2 className="w-4 h-4 text-blue-500" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
            {formatCurrencyBRL(summary?.totalPisCofinsMes || 0)}
          </div>
          <div className="mt-1 text-xs text-blue-600 dark:text-blue-400 font-medium">
            0,65% PIS + 3,00% COFINS Presumido
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase">
            <span>Notas Emitidas vs Canceladas</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="text-emerald-600">{summary?.totalNotasAutorizadas || 0}</span>
            <span className="text-slate-400 text-lg">/</span>
            <span className="text-rose-500">{summary?.totalNotasCanceladas || 0}</span>
          </div>
          <div className="mt-1 text-xs text-slate-500 font-medium">
            {summary?.eventosPendentesEmissao || 0} evento(s) aguardando emissão
          </div>
        </div>
      </div>

      {/* Filtros e Busca */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="relative flex-1 w-full sm:max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Buscar por nº da nota, tomador, CNPJ/CPF ou evento..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Calendar className="w-4 h-4" />
            <select
              value={competenciaFilter}
              onChange={(e) => setCompetenciaFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-200 focus:outline-none"
            >
              <option value="2026-09">Set/2026 (Atual)</option>
              <option value="2026-08">Ago/2026</option>
              <option value="2026-07">Jul/2026</option>
            </select>
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-200 focus:outline-none"
          >
            <option value="ALL">Todos os Status</option>
            <option value={StatusDocumentoFiscal.AUTORIZADO}>Autorizadas</option>
            <option value={StatusDocumentoFiscal.CANCELADO}>Canceladas</option>
          </select>

          <button
            onClick={fetchData}
            className="p-2 rounded-lg text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
            title="Atualizar dados"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Tabela de Notas Fiscais */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-700 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Número / Série</th>
                <th className="py-3 px-4">Emissão</th>
                <th className="py-3 px-4">Tomador do Serviço</th>
                <th className="py-3 px-4">Evento Vinculado</th>
                <th className="py-3 px-4 text-right">Valor Serviços</th>
                <th className="py-3 px-4 text-right">ISS (5%)</th>
                <th className="py-3 px-4 text-right">PIS/COFINS</th>
                <th className="py-3 px-4 text-right">Líquido</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-slate-400">
                    Nenhuma nota fiscal encontrada para o filtro selecionado.
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => (
                  <tr
                    key={inv.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-700/40 transition"
                  >
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900 dark:text-white font-mono">
                        {inv.numeroNota}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Cód. Verif: {inv.codigoVerificacao || '---'}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                      {formatDateBR(inv.dataEmissao)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-800 dark:text-slate-200 max-w-[200px] truncate">
                        {inv.tomadorNome}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {inv.tomadorDoc}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300 max-w-[180px] truncate">
                      {inv.eventNome || (
                        <span className="text-slate-400 italic">Sem vínculo</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right font-semibold text-slate-900 dark:text-white font-mono">
                      {formatCurrencyBRL(inv.valorServicos)}
                    </td>
                    <td className="py-3 px-4 text-right text-indigo-600 dark:text-indigo-400 font-mono">
                      {formatCurrencyBRL(inv.valorIss)}
                    </td>
                    <td className="py-3 px-4 text-right text-slate-600 dark:text-slate-400 font-mono">
                      {formatCurrencyBRL(inv.valorPis + inv.valorCofins)}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                      {formatCurrencyBRL(inv.valorLiquido)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {inv.status === StatusDocumentoFiscal.AUTORIZADO ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
                          <CheckCircle2 className="w-3 h-3" />
                          AUTORIZADA
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300">
                          <XCircle className="w-3 h-3" />
                          CANCELADA
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => setSelectedInvoice(inv)}
                          className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 transition text-[11px] font-medium"
                          title="Visualizar DANFSE"
                        >
                          DANFSE
                        </button>
                        <button
                          onClick={() => setXmlModalContent(inv.xmlContent || '<xml>Sem conteúdo</xml>')}
                          className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-white"
                          title="Ver XML ABRASF"
                        >
                          <FileCode className="w-4 h-4" />
                        </button>
                        {inv.status === StatusDocumentoFiscal.AUTORIZADO && (
                          <button
                            onClick={() => setCancelModalInvoice(inv)}
                            className="p-1 rounded text-rose-400 hover:text-rose-600"
                            title="Cancelar Nota Fiscal"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal 1: Emitir NFS-e Individual */}
      {isEmitirOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-lg w-full border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-rose-600" />
                Emitir Nota Fiscal de Serviços (NFS-e)
              </h3>
              <button
                onClick={() => setIsEmitirOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEmitirIndividual} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Tipo do Tomador
                  </label>
                  <select
                    value={formIndividual.tomadorTipo}
                    onChange={(e) =>
                      setFormIndividual({
                        ...formIndividual,
                        tomadorTipo: e.target.value as any,
                      })
                    }
                    className="w-full text-xs p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900"
                  >
                    <option value="PRODUTOR">Produtor (Comissão de Venda)</option>
                    <option value="CLIENTE">Consumidor (Taxa de Conveniência)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    CNPJ ou CPF do Tomador
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="00.000.000/0000-00"
                    value={formIndividual.tomadorDoc}
                    onChange={(e) =>
                      setFormIndividual({ ...formIndividual, tomadorDoc: e.target.value })
                    }
                    className="w-full text-xs p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Razão Social / Nome Completo
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Entretenimento Sul Ltda."
                  value={formIndividual.tomadorNome}
                  onChange={(e) =>
                    setFormIndividual({ ...formIndividual, tomadorNome: e.target.value })
                  }
                  className="w-full text-xs p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Valor dos Serviços (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="0,00"
                    value={formIndividual.valorServicos}
                    onChange={(e) =>
                      setFormIndividual({ ...formIndividual, valorServicos: e.target.value })
                    }
                    className="w-full text-xs p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Alíquota ISS (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formIndividual.aliquotaIss}
                    onChange={(e) =>
                      setFormIndividual({ ...formIndividual, aliquotaIss: e.target.value })
                    }
                    className="w-full text-xs p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Discriminação dos Serviços
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Descreva detalhadamente o serviço prestado (item 12.07 da LC 116/03)..."
                  value={formIndividual.discriminacao}
                  onChange={(e) =>
                    setFormIndividual({ ...formIndividual, discriminacao: e.target.value })
                  }
                  className="w-full text-xs p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900"
                />
              </div>

              <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>
                  A emissão gerará automaticamente a escritura no Livro Diário com partidas
                  dobradas equilibradas e apuração do ISSQN Curitiba.
                </span>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setIsEmitirOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-rose-600 text-white rounded-lg hover:bg-rose-700 shadow-sm"
                >
                  Transmitir para Prefeitura de Curitiba
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Emissão em Lote por Evento */}
      {isLoteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-lg w-full border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-600" />
                Emissão em Lote por Evento
              </h3>
              <button
                onClick={() => setIsLoteOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEmitirLote} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Selecione o Evento
                </label>
                <select
                  value={formLote.eventId}
                  onChange={(e) => setFormLote({ ...formLote, eventId: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 font-medium"
                >
                  <option value="evt-rock-arena">
                    Rock Legends Curitiba Arena (Pedreira/Ligga Arena)
                  </option>
                  <option value="evt-marisa-monte">
                    Turnê Especial Marisa Monte (Teatro Positivo)
                  </option>
                  <option value="evt-curitiba-2026">
                    Festival Curitiba 2026 (Pedreira Paulo Leminski)
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Escopo da Emissão
                </label>
                <div className="space-y-2 text-xs">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="escopo"
                      checked={formLote.emitirPara === 'TODOS'}
                      onChange={() => setFormLote({ ...formLote, emitirPara: 'TODOS' })}
                    />
                    <span>
                      <strong>Ambos:</strong> NFS-e de Comissão do Produtor + NFS-e Consolidada das
                      Taxas de Conveniência
                    </span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="escopo"
                      checked={formLote.emitirPara === 'PRODUTOR_COMISSAO'}
                      onChange={() =>
                        setFormLote({ ...formLote, emitirPara: 'PRODUTOR_COMISSAO' })
                      }
                    />
                    <span>Apenas NFS-e de Comissão Contratual do Produtor</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="escopo"
                      checked={formLote.emitirPara === 'CLIENTES_CONVENIENCIA'}
                      onChange={() =>
                        setFormLote({ ...formLote, emitirPara: 'CLIENTES_CONVENIENCIA' })
                      }
                    />
                    <span>Apenas NFS-e Consolidada das Taxas de Conveniência dos Clientes</span>
                  </label>
                </div>
              </div>

              <div className="p-3 bg-indigo-50 dark:bg-indigo-950/30 rounded-lg border border-indigo-200 dark:border-indigo-800 text-xs text-indigo-800 dark:text-indigo-300">
                O motor buscará automaticamente os valores reais apurados na Central de
                Fechamento do Evento e gerará as notas no padrão legal da Prefeitura de Curitiba.
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setIsLoteOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-sm"
                >
                  Executar Emissão em Lote
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 3: Visualizador DANFSE da NFS-e */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            {/* Header DANFSE */}
            <div className="border border-slate-300 dark:border-slate-700 p-4 rounded-lg bg-slate-50 dark:bg-slate-800 text-center relative">
              <button
                onClick={() => setSelectedInvoice(null)}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
              <h2 className="text-sm font-extrabold uppercase text-slate-800 dark:text-slate-100">
                Prefeitura Municipal de Curitiba - Secretaria de Finanças
              </h2>
              <p className="text-xs text-slate-500 font-bold mt-0.5">
                DOCUMENTO AUXILIAR DA NOTA FISCAL DE SERVIÇOS ELETRÔNICA - DANFSE
              </p>
              <div className="mt-3 flex justify-between text-xs font-mono font-bold text-slate-700 dark:text-slate-300 border-t border-slate-300 dark:border-slate-700 pt-2">
                <span>Nº NOTA: {selectedInvoice.numeroNota}</span>
                <span>EMISSÃO: {formatDateBR(selectedInvoice.dataEmissao)}</span>
                <span>CÓD. VERIF: {selectedInvoice.codigoVerificacao}</span>
              </div>
            </div>

            {/* Dados Prestador */}
            <div className="border border-slate-200 dark:border-slate-800 p-3 rounded-lg text-xs space-y-1">
              <span className="font-bold text-[10px] uppercase text-slate-400">Prestador de Serviços:</span>
              <p className="font-bold text-slate-900 dark:text-white">
                DISKINGRESSOS SERVICOS DE BILHETERIA E INTERMEDIACAO LTDA
              </p>
              <p className="text-slate-500 font-mono">
                CNPJ: 08.123.456/0001-99 | Insc. Municipal: 123456-7 | Curitiba - PR
              </p>
            </div>

            {/* Dados Tomador */}
            <div className="border border-slate-200 dark:border-slate-800 p-3 rounded-lg text-xs space-y-1">
              <span className="font-bold text-[10px] uppercase text-slate-400">Tomador dos Serviços:</span>
              <p className="font-bold text-slate-900 dark:text-white">
                {selectedInvoice.tomadorNome}
              </p>
              <p className="text-slate-500 font-mono">
                CPF/CNPJ: {selectedInvoice.tomadorDoc} | {selectedInvoice.tomadorCidade} - {selectedInvoice.tomadorUf}
              </p>
            </div>

            {/* Discriminação */}
            <div className="border border-slate-200 dark:border-slate-800 p-3 rounded-lg text-xs space-y-2">
              <span className="font-bold text-[10px] uppercase text-slate-400">Discriminação dos Serviços:</span>
              <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                {selectedInvoice.discriminacao}
              </p>
              <p className="text-[10px] text-slate-400 font-mono">
                Código de Atividade / CNAE: 12.07 - Bilheteria e intermediação de espetáculos
              </p>
            </div>

            {/* Totais e Tributos */}
            <div className="border border-slate-200 dark:border-slate-800 p-4 rounded-lg bg-slate-50 dark:bg-slate-800/60 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div>
                <span className="text-[10px] text-slate-500">Base de Cálculo:</span>
                <p className="font-bold text-slate-900 dark:text-white">
                  {formatCurrencyBRL(selectedInvoice.baseCalculo)}
                </p>
              </div>
              <div>
                <span className="text-[10px] text-slate-500">Alíquota ISS:</span>
                <p className="font-bold text-indigo-600">5,00%</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-500">Valor do ISS:</span>
                <p className="font-bold text-indigo-600">
                  {formatCurrencyBRL(selectedInvoice.valorIss)}
                </p>
              </div>
              <div>
                <span className="text-[10px] text-slate-500">Valor Líquido:</span>
                <p className="font-extrabold text-emerald-600 text-sm">
                  {formatCurrencyBRL(selectedInvoice.valorLiquido)}
                </p>
              </div>
            </div>

            {/* Chave de Acesso */}
            <div className="flex items-center justify-between p-2.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-mono">
              <span className="truncate text-slate-600 dark:text-slate-300">
                Chave: {selectedInvoice.chaveAcesso}
              </span>
              <button
                onClick={() => handleCopyChave(selectedInvoice.chaveAcesso || '')}
                className="flex items-center gap-1 text-[11px] text-indigo-600 hover:text-indigo-800 font-sans font-semibold ml-2"
              >
                {copiedKey ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedKey ? 'Copiado!' : 'Copiar'}
              </button>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedInvoice(null)}
                className="px-4 py-2 bg-slate-800 text-white rounded-lg text-xs font-bold hover:bg-slate-700"
              >
                Fechar Espelho
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 4: Visualizador de XML */}
      {xmlModalContent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="bg-slate-950 text-emerald-400 font-mono text-xs rounded-2xl max-w-2xl w-full border border-slate-800 shadow-2xl p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="font-bold text-slate-200">XML Regulamentar ABRASF v2.04</span>
              <button
                onClick={() => setXmlModalContent(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <pre className="overflow-x-auto max-h-96 p-3 bg-slate-900 rounded-lg text-[11px] leading-relaxed select-all">
              {xmlModalContent}
            </pre>
            <div className="flex justify-end">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(xmlModalContent);
                  alert('XML copiado para a área de transferência!');
                }}
                className="px-4 py-1.5 bg-emerald-600 text-white rounded font-sans text-xs font-bold hover:bg-emerald-700"
              >
                Copiar XML
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 5: Cancelar Nota Fiscal */}
      {cancelModalInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-md w-full border border-slate-200 dark:border-slate-700 shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
              <h3 className="font-bold text-rose-600 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Cancelar Nota Fiscal {cancelModalInvoice.numeroNota}
              </h3>
              <button
                onClick={() => setCancelModalInvoice(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300">
              O cancelamento transmitirá o pedido de anulação à Prefeitura de Curitiba e estornará
              as partidas contábeis geradas no Livro Diário.
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
                Justificativa Legal de Cancelamento (Obrigatório)
              </label>
              <textarea
                rows={3}
                required
                value={motivoCancelamento}
                onChange={(e) => setMotivoCancelamento(e.target.value)}
                placeholder="Ex: Cancelamento de evento acordado em distrato ou erro no preenchimento do tomador..."
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setCancelModalInvoice(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
              >
                Voltar
              </button>
              <button
                onClick={handleConfirmarCancelamento}
                className="px-4 py-2 text-xs font-bold bg-rose-600 text-white rounded-lg hover:bg-rose-700 shadow-sm"
              >
                Confirmar Cancelamento
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
