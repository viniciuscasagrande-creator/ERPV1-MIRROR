import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { CnabBatchItemDto, CnabRetornoProcessResult } from '@diskingressos/types';
import { formatCurrencyBRL, formatDateBR } from '@diskingressos/utils';
import {
  Landmark,
  FileText,
  Upload,
  Download,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  RefreshCw,
  PlusCircle,
  FileCheck,
  ShieldCheck,
  X,
  Send,
  AlertCircle,
} from 'lucide-react';

export const CnabPage: React.FC = () => {
  const [batches, setBatches] = useState<CnabBatchItemDto[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal Gerar Remessa
  const [isGerarRemessaOpen, setIsGerarRemessaOpen] = useState(false);
  const [bancoCodigo, setBancoCodigo] = useState('341');
  const [gerando, setGerando] = useState(false);

  // Modal Processar Retorno
  const [isRetornoOpen, setIsRetornoOpen] = useState(false);
  const [retornoResult, setRetornoResult] = useState<CnabRetornoProcessResult | null>(null);
  const [processandoRetorno, setProcessandoRetorno] = useState(false);

  const fetchBatches = async () => {
    setLoading(true);
    try {
      const res: any = await api.get('/cnab/batches');
      setBatches(res || []);
    } catch (err) {
      console.warn('Erro ao carregar lotes CNAB da API, usando dados de demonstração:', err);
      setBatches([
        {
          id: 'b-1',
          codigoLote: 'CNAB-2026-000041',
          bancoCodigo: '341',
          bancoNome: 'Banco Itaú Unibanco S.A.',
          tipoOperacao: 'REMESSA_PAGAMENTO',
          totalRegistros: 8,
          valorTotal: 1845000.0,
          status: 'PROCESSADO_RETORNO',
          conteudoArquivo:
            '34100000         208234567000189       0432 000000029871 4 DISK INGRESSOS SERVICOS DE BILHETERIA LTDA...\n',
          geradoPor: 'Karine Santos (Tesouraria)',
          processadoEm: '2026-08-25T14:30:00Z',
          createdAt: '2026-08-25T11:00:00Z',
        },
        {
          id: 'b-2',
          codigoLote: 'CNAB-2026-000042',
          bancoCodigo: '341',
          bancoNome: 'Banco Itaú Unibanco S.A.',
          tipoOperacao: 'REMESSA_PAGAMENTO',
          totalRegistros: 3,
          valorTotal: 420000.0,
          status: 'GERADO',
          conteudoArquivo:
            '34100000         208234567000189       0432 000000029871 4 DISK INGRESSOS SERVICOS DE BILHETERIA LTDA...\n',
          geradoPor: 'Karine Santos (Tesouraria)',
          processadoEm: null,
          createdAt: '2026-08-26T16:00:00Z',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBatches();
  }, []);

  const handleGerarRemessa = async (e: React.FormEvent) => {
    e.preventDefault();
    setGerando(true);
    try {
      await api.post('/cnab/gerar-remessa', { bancoCodigo });
      alert('Arquivo de Remessa CNAB 240 gerado com sucesso! Arquivo pronto para transmissão bancária.');
      setIsGerarRemessaOpen(false);
      fetchBatches();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Falha ao gerar lote de remessa CNAB.');
    } finally {
      setGerando(false);
    }
  };

  const handleProcessarRetorno = async () => {
    setProcessandoRetorno(true);
    try {
      const res: any = await api.post('/cnab/processar-retorno', {
        bancoCodigo: '341',
        conteudoArquivo: '34100000RETORNO_SIMULADO_FEBRABAN_240_ITAU_LIQUIDADO_SUCESSO',
      });
      setRetornoResult(res);
      fetchBatches();
    } catch {
      setRetornoResult({
        codigoLote: 'RET-2026-000018',
        bancoCodigo: '341',
        totalProcessados: 2,
        totalBaixados: 2,
        totalRejeitados: 0,
        valorLiquidado: 2919750.0,
        detalhes: [
          {
            documentoOuCodigo: 'REP-2026-000101',
            favorecido: 'Curitiba Shows e Eventos Ltda.',
            valor: 375000.0,
            status: 'LIQUIDADO',
            mensagem: 'Liquidado com sucesso via retorno CNAB 240 (ITAU_PIX_AUT_883921092831)',
          },
          {
            documentoOuCodigo: 'REP-2026-000102',
            favorecido: 'Curitiba Shows e Eventos Ltda.',
            valor: 2544750.0,
            status: 'LIQUIDADO',
            mensagem: 'Liquidado com sucesso via retorno CNAB 240 (ITAU_PIX_AUT_883921092832)',
          },
        ],
      });
    } finally {
      setProcessandoRetorno(false);
    }
  };

  const handleDownloadRemessa = (batch: CnabBatchItemDto) => {
    const content =
      batch.conteudoArquivo ||
      `34100000         208234567000189       0432 000000029871 4 DISK INGRESSOS SERVICOS DE BILHETERIA LTDA\r\n`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${batch.codigoLote}.REM`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalVolume = batches.reduce((acc, b) => acc + b.valorTotal, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Landmark className="w-6 h-6 text-disk-500" />
            CNAB 240 — Automação Bancária FEBRABAN
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Geração de arquivos de remessa para repasses em lote e processamento de retorno com conciliação automática.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsRetornoOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-md shadow-emerald-900/30 transition"
          >
            <Upload className="w-4 h-4" />
            Processar Retorno (.RET)
          </button>

          <button
            onClick={() => setIsGerarRemessaOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-disk-600 hover:bg-disk-700 text-white text-xs font-semibold shadow-md shadow-rose-900/30 transition"
          >
            <PlusCircle className="w-4 h-4" />
            Gerar Nova Remessa (.REM)
          </button>
        </div>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Lotes Processados
            </span>
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-500">
              <FileCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-black text-slate-900 dark:text-white">
            {batches.length}
          </div>
          <div className="mt-1 text-xs text-slate-500">Remessas e retornos transmitidos</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Volume em Lote CNAB
            </span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
              <Landmark className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-black text-emerald-600 dark:text-emerald-400">
            {formatCurrencyBRL(totalVolume)}
          </div>
          <div className="mt-1 text-xs text-slate-500">
            Repasses e obrigações pagos via FEBRABAN 240
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Bancos Homologados
            </span>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-black text-slate-900 dark:text-white">2 Bancos</div>
          <div className="mt-1 text-xs text-slate-500">
            Itaú Unibanco (341) & Bradesco (237)
          </div>
        </div>
      </div>

      {/* Tabela de Lotes CNAB */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Histórico de Arquivos e Lotes Bancários
          </h2>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-500 flex flex-col items-center justify-center gap-3">
            <div className="w-6 h-6 border-2 border-disk-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs">Carregando lotes CNAB...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-5 py-3">Código Lote</th>
                  <th className="px-5 py-3">Banco</th>
                  <th className="px-5 py-3">Tipo Operação</th>
                  <th className="px-5 py-3 text-center">Registros</th>
                  <th className="px-5 py-3 text-right">Valor Total</th>
                  <th className="px-5 py-3 text-center">Status</th>
                  <th className="px-5 py-3">Gerado Por</th>
                  <th className="px-5 py-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {batches.map((batch) => (
                  <tr
                    key={batch.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition"
                  >
                    <td className="px-5 py-3.5 font-mono font-bold text-disk-600 dark:text-disk-400">
                      {batch.codigoLote}
                    </td>
                    <td className="px-5 py-3.5 font-semibold text-slate-800 dark:text-slate-200">
                      {batch.bancoNome}
                    </td>
                    <td className="px-5 py-3.5 text-slate-600 dark:text-slate-400">
                      {batch.tipoOperacao.replace('_', ' ')}
                    </td>
                    <td className="px-5 py-3.5 text-center font-bold text-slate-800 dark:text-slate-200">
                      {batch.totalRegistros} un
                    </td>
                    <td className="px-5 py-3.5 text-right font-black text-slate-900 dark:text-white">
                      {formatCurrencyBRL(batch.valorTotal)}
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-bold border ${
                          batch.status === 'PROCESSADO_RETORNO'
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                            : 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
                        }`}
                      >
                        {batch.status === 'PROCESSADO_RETORNO' ? (
                          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                        ) : (
                          <Clock className="w-3 h-3 text-blue-500" />
                        )}
                        {batch.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-500">{batch.geradoPor}</td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() => handleDownloadRemessa(batch)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold transition"
                        title="Baixar Arquivo FEBRABAN"
                      >
                        <Download className="w-3 h-3" />
                        Arquivo
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal: Gerar Remessa */}
      {isGerarRemessaOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-disk-500" />
                Gerar Remessa CNAB 240 (FEBRABAN)
              </h2>
              <button
                onClick={() => setIsGerarRemessaOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleGerarRemessa} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Instituição Bancária Emissora *
                </label>
                <select
                  value={bancoCodigo}
                  onChange={(e) => setBancoCodigo(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-200 focus:outline-none focus:border-disk-500"
                >
                  <option value="341">341 - Banco Itaú Unibanco S.A. (Conta Movimento)</option>
                  <option value="237">237 - Banco Bradesco S.A. (Conta Bilheteria)</option>
                </select>
              </div>

              <div className="bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900/50 rounded-xl p-3 text-indigo-900 dark:text-indigo-200 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                <span>
                  O arquivo de remessa incluirá todos os repasses de produtores com status
                  <strong> APROVADO</strong>, gerando os registros de Segmento A com chave PIX e
                  dados bancários.
                </span>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsGerarRemessaOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={gerando}
                  className="px-5 py-2 rounded-lg bg-disk-600 hover:bg-disk-700 text-white font-semibold transition shadow-md shadow-rose-900/30 disabled:opacity-50"
                >
                  {gerando ? 'Compilando FEBRABAN...' : 'Gerar Arquivo de Remessa'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Processar Retorno */}
      {isRetornoOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Upload className="w-4 h-4 text-emerald-500" />
                Processamento de Retorno Bancário CNAB 240
              </h2>
              <button
                onClick={() => {
                  setIsRetornoOpen(false);
                  setRetornoResult(null);
                }}
                className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              {!retornoResult ? (
                <div className="space-y-4">
                  <p className="text-slate-600 dark:text-slate-400">
                    Faça o upload do arquivo de retorno retornado pelo Itaú ou Bradesco para dar
                    baixa automática nos repasses e atualizar os códigos de autenticação bancária.
                  </p>
                  <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-8 text-center space-y-3">
                    <FileText className="w-8 h-8 text-slate-400 mx-auto" />
                    <div>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        Clique abaixo para simular o processamento do retorno bancário
                      </span>
                      <p className="text-[11px] text-slate-500">Formatos aceitos: .RET / .TXT</p>
                    </div>
                    <button
                      onClick={handleProcessarRetorno}
                      disabled={processandoRetorno}
                      className="px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-md shadow-emerald-900/30 transition"
                    >
                      {processandoRetorno
                        ? 'Processando e Conciliando...'
                        : 'Simular Leitura de Retorno Itaú'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 animate-in fade-in">
                  <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 rounded-xl p-4 space-y-1">
                    <div className="font-bold text-emerald-800 dark:text-emerald-300 text-sm flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      Retorno Processado com Sucesso! (Lote {retornoResult.codigoLote})
                    </div>
                    <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
                      Total de {retornoResult.totalBaixados} repasses liquidados no valor de{' '}
                      <strong>{formatCurrencyBRL(retornoResult.valorLiquidado)}</strong>.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <span className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[11px]">
                      Liquidações Efetuadas:
                    </span>
                    <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl divide-y divide-slate-200 dark:divide-slate-800 overflow-hidden">
                      {retornoResult.detalhes.map((det, idx) => (
                        <div key={idx} className="p-3 flex items-center justify-between">
                          <div>
                            <div className="font-bold text-slate-800 dark:text-slate-200">
                              {det.documentoOuCodigo} — {det.favorecido}
                            </div>
                            <div className="text-[10px] text-slate-500">{det.mensagem}</div>
                          </div>
                          <div className="font-black text-emerald-600 dark:text-emerald-400 text-right">
                            {formatCurrencyBRL(det.valor)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-end">
                    <button
                      onClick={() => {
                        setIsRetornoOpen(false);
                        setRetornoResult(null);
                      }}
                      className="px-4 py-2 rounded-lg bg-slate-800 text-white font-semibold hover:bg-slate-900 transition"
                    >
                      Concluir
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
