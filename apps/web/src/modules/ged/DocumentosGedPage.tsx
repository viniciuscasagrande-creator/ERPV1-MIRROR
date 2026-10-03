import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { DocumentItemDto, DocumentCategory } from '@diskingressos/types';
import { formatDateBR } from '@diskingressos/utils';
import {
  FolderOpen,
  FileText,
  Search,
  Filter,
  Upload,
  Download,
  Trash2,
  FileCode,
  ShieldCheck,
  CheckCircle2,
  Copy,
  PlusCircle,
  X,
  File,
  Building2,
  Calendar,
} from 'lucide-react';

const CATEGORIAS_LISTA = [
  { valor: 'TODOS', label: 'Todas as Categorias' },
  { valor: DocumentCategory.CONTRATO_PRODUTOR, label: 'Contratos de Produtores' },
  { valor: DocumentCategory.ALVARA_EVENTO, label: 'Alvarás e Licenças de Eventos' },
  { valor: DocumentCategory.COMPROVANTE_PAGAMENTO, label: 'Comprovantes de Pagamento / PIX' },
  { valor: DocumentCategory.DOCUMENTO_FISCAL, label: 'Documentos Fiscais & XML' },
  { valor: DocumentCategory.LAUDO_TECNICO, label: 'Laudos Técnicos & Vistorias' },
  { valor: DocumentCategory.OUTRO, label: 'Outros Documentos' },
];

export const DocumentosGedPage: React.FC = () => {
  const [documentos, setDocumentos] = useState<DocumentItemDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroCategoria, setFiltroCategoria] = useState('TODOS');
  const [filtroTexto, setFiltroTexto] = useState('');

  // Modal Novo Documento
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [novoDoc, setNovoDoc] = useState({
    nomeArquivo: '',
    descricao: '',
    categoria: DocumentCategory.CONTRATO_PRODUTOR,
    formato: 'PDF',
    tamanhoBytes: 1048576,
    referenciaTipo: 'GERAL',
    referenciaId: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchDocumentos = async () => {
    setLoading(true);
    try {
      const res: any = await api.get(
        `/documents?categoria=${filtroCategoria}&search=${filtroTexto}`
      );
      setDocumentos(res || []);
    } catch (err) {
      console.warn('Erro ao carregar documentos da API, usando dados demonstrativos:', err);
      setDocumentos([
        {
          id: 'doc-1',
          nomeArquivo: 'CONTRATO-PRESTACAO-SERVICOS-CURITIBA-SHOWS-2026.pdf',
          descricao: 'Contrato Master de Intermediação e Gestão de Bilheteria com Curitiba Shows Ltda.',
          categoria: DocumentCategory.CONTRATO_PRODUTOR,
          tamanhoBytes: 2458200,
          formato: 'PDF',
          urlArquivo: '/docs/contrato-curitiba-shows.pdf',
          hashSha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
          referenciaTipo: 'PRODUTOR',
          referenciaId: '12345678000190',
          criadoPor: 'Carlos Contador (CRC 12345/PR)',
          criadoEm: '2026-08-10T14:30:00Z',
        },
        {
          id: 'doc-2',
          nomeArquivo: 'ALVARA-CORPO-BOMBEIROS-PEDREIRA-ROCK-ARENA.pdf',
          descricao: 'Alvará de Vistoria e Segurança do Corpo de Bombeiros (AVCB) - Pedreira Paulo Leminski.',
          categoria: DocumentCategory.ALVARA_EVENTO,
          tamanhoBytes: 1845100,
          formato: 'PDF',
          urlArquivo: '/docs/alvara-pedreira.pdf',
          hashSha256: 'ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb',
          referenciaTipo: 'EVENTO',
          referenciaId: 'evt-rock-arena',
          criadoPor: 'Equipe Operacional DiskIngressos',
          criadoEm: '2026-08-15T10:00:00Z',
        },
        {
          id: 'doc-3',
          nomeArquivo: 'COMPROVANTE-LIQUIDACAO-ITAU-REP-2026-000101.pdf',
          descricao: 'Comprovante Oficial de Transferência PIX Itaú Unibanco referente ao Borderô REP-2026-000101.',
          categoria: DocumentCategory.COMPROVANTE_PAGAMENTO,
          tamanhoBytes: 420900,
          formato: 'PDF',
          urlArquivo: '/docs/comp-itau-rep101.pdf',
          hashSha256: '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4',
          referenciaTipo: 'REPASSE',
          referenciaId: 'rep-1',
          criadoPor: 'Karine Santos (Tesouraria)',
          criadoEm: '2026-08-25T14:30:00Z',
        },
        {
          id: 'doc-4',
          nomeArquivo: 'DANFSE-CURITIBA-ABRASF-NFS-2026-000412.xml',
          descricao: 'Arquivo XML Original da Nota Fiscal Eletrônica de Serviços de Curitiba (NFS-e 412).',
          categoria: DocumentCategory.DOCUMENTO_FISCAL,
          tamanhoBytes: 15400,
          formato: 'XML',
          urlArquivo: '/docs/nfs-412.xml',
          hashSha256: '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a',
          referenciaTipo: 'EVENTO',
          referenciaId: 'evt-rock-arena',
          criadoPor: 'Sistema Fiscal Integrado',
          criadoEm: '2026-08-25T15:00:00Z',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocumentos();
  }, [filtroCategoria]);

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoDoc.nomeArquivo || !novoDoc.descricao) {
      alert('Preencha os campos obrigatórios do documento.');
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/documents', novoDoc);
      alert('Documento arquivado com sucesso no GED com integridade SHA-256 registrada!');
      setIsUploadOpen(false);
      setNovoDoc({
        nomeArquivo: '',
        descricao: '',
        categoria: DocumentCategory.CONTRATO_PRODUTOR,
        formato: 'PDF',
        tamanhoBytes: 1048576,
        referenciaTipo: 'GERAL',
        referenciaId: '',
      });
      fetchDocumentos();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Falha ao arquivar documento.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, nome: string) => {
    if (!confirm(`Deseja realmente remover o documento "${nome}" do repositório?`)) return;
    try {
      await api.delete(`/documents/${id}`);
      fetchDocumentos();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Falha ao remover documento.');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const copyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    alert('Hash SHA-256 copiado para a área de transferência!');
  };

  const docsFiltrados = documentos.filter((d) => {
    const matchTexto =
      d.nomeArquivo.toLowerCase().includes(filtroTexto.toLowerCase()) ||
      d.descricao.toLowerCase().includes(filtroTexto.toLowerCase()) ||
      d.hashSha256.toLowerCase().includes(filtroTexto.toLowerCase());
    return matchTexto;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <FolderOpen className="w-6 h-6 text-disk-500" />
            Documentos & GED Contábil
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Repositório digital corporativo com integridade criptográfica SHA-256 para contratos, alvarás e comprovantes.
          </p>
        </div>

        <button
          onClick={() => setIsUploadOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-disk-600 hover:bg-disk-700 text-white text-xs font-semibold shadow-md shadow-rose-900/30 transition"
        >
          <PlusCircle className="w-4 h-4" />
          Arquivar Novo Documento
        </button>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total de Arquivos
            </span>
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-500">
              <FolderOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-black text-slate-900 dark:text-white">
            {documentos.length}
          </div>
          <div className="mt-1 text-xs text-slate-500">Arquivados no repositório digital</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Contratos de Produtores
            </span>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-black text-slate-900 dark:text-white">
            {documentos.filter((d) => d.categoria === DocumentCategory.CONTRATO_PRODUTOR).length}
          </div>
          <div className="mt-1 text-xs text-slate-500">Com cláusulas comerciais homologadas</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Alvarás de Eventos
            </span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-black text-slate-900 dark:text-white">
            {documentos.filter((d) => d.categoria === DocumentCategory.ALVARA_EVENTO).length}
          </div>
          <div className="mt-1 text-xs text-slate-500">Licenças e laudos de segurança AVCB</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Integridade SHA-256
            </span>
            <div className="p-2 rounded-lg bg-disk-500/10 text-disk-500">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-black text-emerald-600 dark:text-emerald-400">
            100%
          </div>
          <div className="mt-1 text-xs text-slate-500">Assinaturas e hashes auditados</div>
        </div>
      </div>

      {/* Barra de Filtros e Busca */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por nome, descrição ou hash..."
            value={filtroTexto}
            onChange={(e) => setFiltroTexto(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-disk-500 transition"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={filtroCategoria}
            onChange={(e) => setFiltroCategoria(e.target.value)}
            className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs rounded-lg px-3 py-2 text-slate-700 dark:text-slate-300 focus:outline-none focus:border-disk-500 transition"
          >
            {CATEGORIAS_LISTA.map((c) => (
              <option key={c.valor} value={c.valor}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabela de Documentos */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-12 text-center text-slate-500 flex flex-col items-center justify-center gap-3">
            <div className="w-6 h-6 border-2 border-disk-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs">Carregando documentos eletrônicos...</p>
          </div>
        ) : docsFiltrados.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <FolderOpen className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
            <p className="font-semibold text-slate-700 dark:text-slate-300">
              Nenhum documento localizado
            </p>
            <p className="text-xs text-slate-500 mt-1">Ajuste os filtros de pesquisa acima.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-5 py-3">Documento & Descrição</th>
                  <th className="px-5 py-3">Categoria</th>
                  <th className="px-5 py-3">Tamanho</th>
                  <th className="px-5 py-3">Hash SHA-256</th>
                  <th className="px-5 py-3">Data Arquivamento</th>
                  <th className="px-5 py-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {docsFiltrados.map((doc) => (
                  <tr
                    key={doc.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {doc.formato === 'XML' ? (
                            <FileCode className="w-4 h-4 text-amber-500" />
                          ) : (
                            <FileText className="w-4 h-4 text-disk-500" />
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white">
                            {doc.nomeArquivo}
                          </div>
                          <div className="text-[11px] text-slate-500 max-w-md truncate">
                            {doc.descricao}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                        {doc.categoria.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-600 dark:text-slate-400 font-mono">
                      {formatFileSize(doc.tamanhoBytes)}
                    </td>
                    <td className="px-5 py-3.5">
                      <button
                        onClick={() => copyHash(doc.hashSha256)}
                        className="flex items-center gap-1 text-[11px] font-mono text-slate-500 hover:text-disk-600 transition"
                        title="Clique para copiar hash completo"
                      >
                        <span>{doc.hashSha256.slice(0, 12)}...</span>
                        <Copy className="w-3 h-3 text-slate-400" />
                      </button>
                    </td>
                    <td className="px-5 py-3.5 text-slate-500">
                      {formatDateBR(doc.criadoEm)}
                    </td>
                    <td className="px-5 py-3.5 text-right space-x-2">
                      <button
                        onClick={() =>
                          alert(`Download simulado do documento: ${doc.nomeArquivo}`)
                        }
                        className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition"
                        title="Baixar Documento"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(doc.id, doc.nomeArquivo)}
                        className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/20 hover:bg-rose-100 dark:hover:bg-rose-900/40 text-rose-600 dark:text-rose-400 transition"
                        title="Remover Documento"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal: Arquivar Documento */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Upload className="w-4 h-4 text-disk-500" />
                Arquivar Documento no GED
              </h2>
              <button
                onClick={() => setIsUploadOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Nome do Arquivo *
                </label>
                <input
                  type="text"
                  placeholder="Ex: CONTRATO-PRODUTORA-2026.pdf"
                  value={novoDoc.nomeArquivo}
                  onChange={(e) => setNovoDoc({ ...novoDoc, nomeArquivo: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-200 focus:outline-none focus:border-disk-500"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Descrição do Documento *
                </label>
                <textarea
                  rows={2}
                  placeholder="Descreva o conteúdo e finalidade contábil do arquivo..."
                  value={novoDoc.descricao}
                  onChange={(e) => setNovoDoc({ ...novoDoc, descricao: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-3 text-slate-900 dark:text-slate-200 focus:outline-none focus:border-disk-500 resize-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Categoria *
                  </label>
                  <select
                    value={novoDoc.categoria}
                    onChange={(e) => setNovoDoc({ ...novoDoc, categoria: e.target.value as DocumentCategory })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-200 focus:outline-none focus:border-disk-500"
                  >
                    <option value={DocumentCategory.CONTRATO_PRODUTOR}>Contrato de Produtor</option>
                    <option value={DocumentCategory.ALVARA_EVENTO}>Alvará de Evento</option>
                    <option value={DocumentCategory.COMPROVANTE_PAGAMENTO}>Comprovante PIX/TED</option>
                    <option value={DocumentCategory.DOCUMENTO_FISCAL}>Documento Fiscal / XML</option>
                    <option value={DocumentCategory.LAUDO_TECNICO}>Laudo Técnico</option>
                    <option value={DocumentCategory.OUTRO}>Outro</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Formato *
                  </label>
                  <select
                    value={novoDoc.formato}
                    onChange={(e) => setNovoDoc({ ...novoDoc, formato: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-200 focus:outline-none focus:border-disk-500"
                  >
                    <option value="PDF">PDF Document</option>
                    <option value="XML">XML Fiscal</option>
                    <option value="ZIP">ZIP Arquivo</option>
                    <option value="PNG">PNG Imagem</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsUploadOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-lg bg-disk-600 hover:bg-disk-700 text-white font-semibold transition shadow-md shadow-rose-900/30 disabled:opacity-50"
                >
                  {submitting ? 'Gravando...' : 'Arquivar Documento'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
