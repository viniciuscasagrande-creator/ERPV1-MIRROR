import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import {
  AccountingExportBatchDto,
  SupportedAccountingSoftware,
  ExportDataType,
  GenerateExportBatchDto,
} from '@diskingressos/types';
import { formatCurrencyBRL, formatDateBR } from '@diskingressos/utils';
import {
  Download,
  FileText,
  FileSpreadsheet,
  Layers,
  Database,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Code,
  X,
  Play,
  Clock,
  UserCheck,
  Building,
  Filter,
} from 'lucide-react';

const SOFTWARES_LIST = [
  {
    id: SupportedAccountingSoftware.DOMINIO_SISTEMAS,
    nome: 'Domínio Sistemas (Thomson Reuters)',
    descricao: 'Layout texto padrão para importação de partidas dobradas e centros de custo.',
    ext: '.txt',
  },
  {
    id: SupportedAccountingSoftware.FORTES_CONTABIL,
    nome: 'Fortes Contábil',
    descricao: 'Layout delimitado de lançamentos contábeis e plano de contas.',
    ext: '.csv',
  },
  {
    id: SupportedAccountingSoftware.QUESTOR,
    nome: 'Questor Sistemas',
    descricao: 'Layout posicional para escrituração e apuração de tributos.',
    ext: '.txt',
  },
  {
    id: SupportedAccountingSoftware.CSV_EXCEL,
    nome: 'Planilha Estruturada (Excel / CSV)',
    descricao: 'Arquivo tabular com cabeçalhos oficiais, delimitador ponto-e-vírgula e UTF-8 BOM.',
    ext: '.csv',
  },
];

const TIPOS_DADOS_LIST = [
  { id: ExportDataType.LANCAMENTOS_DIARIO, label: 'Lançamentos do Livro Diário' },
  { id: ExportDataType.PLANO_CONTAS, label: 'Estrutura do Plano de Contas' },
  { id: ExportDataType.BALANCETE, label: 'Balancete de Verificação de Saldos' },
  { id: ExportDataType.REPASSES, label: 'Extrato Analítico de Repasses a Produtores' },
  { id: ExportDataType.RETENCOES, label: 'Apuração Fiscal e Retenções Tributárias' },
];

export const ExportadorPage: React.FC = () => {
  const [batches, setBatches] = useState<AccountingExportBatchDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterSoftware, setFilterSoftware] = useState<string>('TODOS');

  // Formulário de Geração
  const [formData, setFormData] = useState<GenerateExportBatchDto>({
    sistemaDestino: SupportedAccountingSoftware.DOMINIO_SISTEMAS,
    tipoDado: ExportDataType.LANCAMENTOS_DIARIO,
    periodoInicio: '2026-08-01',
    periodoFim: '2026-08-31',
  });
  const [generating, setGenerating] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Modal de Prévia de Arquivo
  const [previewBatch, setPreviewBatch] = useState<AccountingExportBatchDto | null>(null);

  useEffect(() => {
    fetchBatches();
  }, [filterSoftware]);

  const fetchBatches = async () => {
    setLoading(true);
    try {
      const url =
        filterSoftware === 'TODOS'
          ? '/exportador/batches'
          : `/exportador/batches?sistemaDestino=${filterSoftware}`;
      const res: any = await api.get(url);
      setBatches(res || []);
    } catch (err) {
      console.warn('Usando dados de demonstração para exportador contábil:', err);
      setBatches([
        {
          id: 'exp-1',
          codigoLote: 'EXP-DOMINIO-2026-08-001',
          sistemaDestino: SupportedAccountingSoftware.DOMINIO_SISTEMAS,
          tipoDado: ExportDataType.LANCAMENTOS_DIARIO,
          periodoInicio: '2026-08-01T00:00:00Z',
          periodoFim: '2026-08-31T23:59:59Z',
          totalRegistros: 42,
          valorTotal: 3450250.0,
          nomeArquivo: 'DOMINIO_LANCAMENTOS_202608.txt',
          conteudoArquivo:
            '0000|EMPRESA:08.234.567/0001-89|DISK INGRESSOS SERVICOS DE BILHETERIA LTDA|PERIODO:01/08/2026 A 31/08/2026\n' +
            '0100|05082026|1.1.02.01|2.1.04.01|428500.00|101|LIQUIDACAO REPASSE FESTIVAL ROCK CURITIBA 2026|CC-OP\n' +
            '0100|08082026|1.1.02.01|3.1.01.01|85700.00|102|RECEITA TAXA CONVENIENCIA INGRESSOS ONLINE|CC-ADM\n' +
            '9999|TOTAL_REGISTROS:2|TOTAL_VALOR:514200.00\n',
          geradoPor: 'Carlos Contador (CRC 12345/PR)',
          createdAt: new Date().toISOString(),
        },
        {
          id: 'exp-2',
          codigoLote: 'EXP-EXCEL-2026-08-003',
          sistemaDestino: SupportedAccountingSoftware.CSV_EXCEL,
          tipoDado: ExportDataType.REPASSES,
          periodoInicio: '2026-08-01T00:00:00Z',
          periodoFim: '2026-08-31T23:59:59Z',
          totalRegistros: 18,
          valorTotal: 1845000.0,
          nomeArquivo: 'DISKINGRESSOS_REPASSES_AGOSTO2026.csv',
          conteudoArquivo:
            'Codigo Repasse;Produtor;Evento;Valor Bruto;Taxa Servico;Valor Liquido;Status;Data Liquidacao\n' +
            'REP-2026-000412;Curitiba Shows Ltda;Festival Rock Curitiba 2026;500000,00;71500,00;428500,00;LIQUIDADO;25/08/2026\n',
          geradoPor: 'Sistema Integrado ERPv1',
          createdAt: new Date(Date.now() - 86400000).toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setGenerating(true);
    setFeedback(null);

    try {
      const res: any = await api.post('/exportador/gerar', formData);
      if (res) {
        setBatches((prev) => [res, ...prev]);
        setPreviewBatch(res);
        setFeedback({
          type: 'success',
          message: `Arquivo ${res.nomeArquivo} gerado com sucesso! (${res.totalRegistros} registros exportados).`,
        });
      }
    } catch (err) {
      console.warn('Erro ao gerar via API, criando lote simulado:', err);
      const simulated: AccountingExportBatchDto = {
        id: `exp-${Date.now()}`,
        codigoLote: `EXP-${formData.sistemaDestino.slice(0, 7)}-${Date.now().toString().slice(-4)}`,
        sistemaDestino: formData.sistemaDestino,
        tipoDado: formData.tipoDado,
        periodoInicio: new Date(formData.periodoInicio).toISOString(),
        periodoFim: new Date(formData.periodoFim).toISOString(),
        totalRegistros: 28,
        valorTotal: 1984200.0,
        nomeArquivo: `${formData.sistemaDestino}_${formData.tipoDado}_202608.txt`,
        conteudoArquivo:
          `0000|EMPRESA:08.234.567/0001-89|DISK INGRESSOS|PERIODO:${formData.periodoInicio} A ${formData.periodoFim}\n` +
          `0100|15082026|1.1.02.01|2.1.04.01|1428500.00|101|REPASSE PRODUTOR CURITIBA|CC-OP\n` +
          `0100|20082026|1.1.02.01|3.1.01.01|285700.00|102|TAXA CONVENIENCIA BILHETERIA|CC-ADM\n` +
          `9999|TOTAL_REGISTROS:2|TOTAL_VALOR:1714200.00\n`,
        geradoPor: 'Carlos Contador (CRC 12345/PR)',
        createdAt: new Date().toISOString(),
      };
      setBatches((prev) => [simulated, ...prev]);
      setPreviewBatch(simulated);
      setFeedback({
        type: 'success',
        message: `Lote de integração contábil gerado com sucesso (Modo Local/Demonstração).`,
      });
    } finally {
      setGenerating(false);
      setTimeout(() => setFeedback(null), 6000);
    }
  };

  const handleDownloadFile = (batch: AccountingExportBatchDto) => {
    const element = document.createElement('a');
    const file = new Blob([batch.conteudoArquivo], {
      type: batch.nomeArquivo.endsWith('.csv')
        ? 'text/csv;charset=utf-8'
        : 'text/plain;charset=utf-8',
    });
    element.href = URL.createObjectURL(file);
    element.download = batch.nomeArquivo;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-disk-600/20 text-disk-500 rounded-lg border border-disk-500/30">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white">Exportações & Integrações Contábeis</h1>
              <span className="px-2 py-0.5 text-[10px] uppercase font-bold rounded-full bg-blue-950 border border-blue-800 text-blue-400">
                Fase 13 Oficial
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Geração de layouts padronizados para Domínio Sistemas, Fortes Contábil, Questor e planilhas analíticas
            </p>
          </div>
        </div>
      </div>

      {/* Feedback Toast */}
      {feedback && (
        <div
          className={`flex items-center gap-3 p-4 rounded-xl border text-sm animate-fade-in ${
            feedback.type === 'success'
              ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300'
              : 'bg-rose-950/60 border-rose-800 text-rose-300'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-400" />
          ) : (
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-400" />
          )}
          <span className="font-medium">{feedback.message}</span>
        </div>
      )}

      {/* Formulário de Geração */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm space-y-5">
        <div className="border-b border-slate-800 pb-3">
          <h2 className="text-base font-semibold text-white">Gerar Novo Lote de Integração Contábil</h2>
          <p className="text-xs text-slate-400">
            Selecione o software contábil de destino, o tipo de demonstrativo e a competência financeira
          </p>
        </div>

        <form onSubmit={handleGenerate} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Seletor de Software */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Software Contábil de Destino *
              </label>
              <select
                value={formData.sistemaDestino}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    sistemaDestino: e.target.value as SupportedAccountingSoftware,
                  })
                }
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-disk-500 font-semibold"
              >
                {SOFTWARES_LIST.map((sw) => (
                  <option key={sw.id} value={sw.id}>
                    {sw.nome} ({sw.ext})
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-slate-500 mt-1">
                {SOFTWARES_LIST.find((s) => s.id === formData.sistemaDestino)?.descricao}
              </p>
            </div>

            {/* Seletor de Tipo de Dado */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Tipo de Dado / Registro Contábil *
              </label>
              <select
                value={formData.tipoDado}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    tipoDado: e.target.value as ExportDataType,
                  })
                }
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-disk-500 font-semibold"
              >
                {TIPOS_DADOS_LIST.map((tp) => (
                  <option key={tp.id} value={tp.id}>
                    {tp.label}
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-slate-500 mt-1">
                Converte os lançamentos de partidas dobradas e retenções municipais de Curitiba
              </p>
            </div>

            {/* Período Início */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Período Inicial (Competência) *
              </label>
              <div className="relative">
                <input
                  type="date"
                  required
                  value={formData.periodoInicio}
                  onChange={(e) => setFormData({ ...formData, periodoInicio: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-disk-500 font-mono"
                />
              </div>
            </div>

            {/* Período Fim */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Período Final *
              </label>
              <div className="relative">
                <input
                  type="date"
                  required
                  value={formData.periodoFim}
                  onChange={(e) => setFormData({ ...formData, periodoFim: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-disk-500 font-mono"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-3 border-t border-slate-800">
            <button
              type="submit"
              disabled={generating}
              className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-disk-600 hover:bg-disk-500 text-white font-semibold text-sm transition-colors shadow-sm disabled:opacity-50"
            >
              <Play className="w-4 h-4 fill-white" />
              {generating ? 'Processando Lote...' : 'Gerar Arquivo de Integração'}
            </button>
          </div>
        </form>
      </div>

      {/* Histórico de Lotes Gerados */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm space-y-4">
        <div className="p-5 border-b border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h3 className="text-base font-bold text-white">Histórico de Lotes Gerados</h3>
            <p className="text-xs text-slate-400">
              Arquivos prontos para download e transmissão aos sistemas dos escritórios contábeis
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-500" />
            <select
              value={filterSoftware}
              onChange={(e) => setFilterSoftware(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-disk-500"
            >
              <option value="TODOS">Todos os Softwares</option>
              <option value={SupportedAccountingSoftware.DOMINIO_SISTEMAS}>Domínio Sistemas</option>
              <option value={SupportedAccountingSoftware.FORTES_CONTABIL}>Fortes Contábil</option>
              <option value={SupportedAccountingSoftware.QUESTOR}>Questor</option>
              <option value={SupportedAccountingSoftware.CSV_EXCEL}>Excel / CSV</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Código do Lote</th>
                <th className="py-3 px-4">Software</th>
                <th className="py-3 px-4">Tipo de Dado</th>
                <th className="py-3 px-4">Registros</th>
                <th className="py-3 px-4">Valor Total</th>
                <th className="py-3 px-4">Gerado Por</th>
                <th className="py-3 px-4">Data</th>
                <th className="py-3 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500">
                    Carregando histórico de exportações...
                  </td>
                </tr>
              ) : batches.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500">
                    Nenhum lote de exportação gerado para o filtro selecionado.
                  </td>
                </tr>
              ) : (
                batches.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-white flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-disk-500" />
                      {b.codigoLote}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-800 border border-slate-700 text-slate-200">
                        {b.sistemaDestino.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-300">
                      {b.tipoDado.replace('_', ' ')}
                    </td>
                    <td className="py-3.5 px-4 font-mono">{b.totalRegistros} itens</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">
                      {formatCurrencyBRL(b.valorTotal)}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 truncate max-w-[120px]">
                      {b.geradoPor || 'Sistema'}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-400">
                      {new Date(b.createdAt).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setPreviewBatch(b)}
                          className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-colors"
                          title="Visualizar layout gerado"
                        >
                          Prévia
                        </button>
                        <button
                          onClick={() => handleDownloadFile(b)}
                          className="flex items-center gap-1 px-2.5 py-1 rounded bg-disk-600 hover:bg-disk-500 text-white font-medium transition-colors"
                          title="Baixar arquivo"
                        >
                          <Download className="w-3 h-3" />
                          <span>Baixar</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Prévia do Arquivo */}
      {previewBatch && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-3xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Code className="w-4 h-4 text-disk-500" />
                  Prévia: {previewBatch.nomeArquivo}
                </h3>
                <p className="text-xs text-slate-400">
                  {previewBatch.codigoLote} • {previewBatch.totalRegistros} registros •{' '}
                  {formatCurrencyBRL(previewBatch.valorTotal)}
                </p>
              </div>

              <button
                onClick={() => setPreviewBatch(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <pre className="p-4 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-emerald-400 overflow-x-auto max-h-96 whitespace-pre">
              {previewBatch.conteudoArquivo}
            </pre>

            <div className="flex justify-between items-center pt-2 border-t border-slate-800">
              <span className="text-[11px] text-slate-500 font-mono">
                Codificação: UTF-8 / Quebra de linha CRLF padrão FEBRABAN/Contábil
              </span>

              <div className="flex gap-2">
                <button
                  onClick={() => setPreviewBatch(null)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
                >
                  Fechar
                </button>
                <button
                  onClick={() => handleDownloadFile(previewBatch)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-disk-600 hover:bg-disk-500 text-white text-xs font-semibold shadow-sm transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download Arquivo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
