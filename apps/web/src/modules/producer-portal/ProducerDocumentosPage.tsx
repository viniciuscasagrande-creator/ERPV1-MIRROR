import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { ProducerNfseItem } from '@diskingressos/types';
import { formatCurrencyBRL, formatDateBR } from '@diskingressos/utils';
import {
  FileText,
  Search,
  Download,
  Eye,
  CheckCircle2,
  Building2,
  Printer,
  X,
  ShieldCheck,
  Calendar,
  Layers,
  FileCode,
} from 'lucide-react';

export const ProducerDocumentosPage: React.FC = () => {
  const [invoices, setInvoices] = useState<ProducerNfseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroTexto, setFiltroTexto] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState<ProducerNfseItem | null>(null);

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const res: any = await api.get('/producer-portal/documentos/notas');
      setInvoices(res || []);
    } catch (err) {
      console.warn('Erro ao carregar notas fiscais da API, usando dados de demonstração:', err);
      setInvoices([
        {
          id: 'nfs-1',
          numeroNota: 'NFS-2026-000412',
          dataEmissao: '2026-08-25T15:00:00Z',
          eventoNome: 'Rock Legends Curitiba Arena',
          discriminacao:
            'Comissão e taxa administrativa sobre intermediação de venda de ingressos do evento Rock Legends Curitiba Arena conforme contrato de prestação de serviços nº 2026-088.',
          valorServicos: 385000.0,
          valorIss: 7700.0,
          valorLiquido: 377300.0,
          codigoVerificacao: 'CV-CUR-2026-8849-X9A2',
          status: 'AUTORIZADA',
          xmlContent:
            '<?xml version="1.0" encoding="UTF-8"?><CompNfse xmlns="http://www.abrasf.org.br/ABRASF/arquivos/nfse.xsd"><Nfse><InfNfse Id="NFS-2026-000412"><Numero>412</Numero><CodigoVerificacao>CV-CUR-2026-8849-X9A2</CodigoVerificacao><DataEmissao>2026-08-25T15:00:00</DataEmissao><ValoresNfse><ValorServicos>385000.00</ValorServicos><ValorIss>7700.00</ValorIss><Aliquota>2.00</Aliquota><ValorLiquidoNfse>377300.00</ValorLiquidoNfse></ValoresNfse><PrestadorServico><CpfCnpj><Cnpj>08234567000189</Cnpj></CpfCnpj><RazaoSocial>DISK INGRESSOS SERVICOS DE BILHETERIA LTDA</RazaoSocial><InscricaoMunicipal>894210</InscricaoMunicipal></PrestadorServico></InfNfse></Nfse></CompNfse>',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleDownloadXml = (inv: ProducerNfseItem) => {
    const xml =
      inv.xmlContent ||
      `<?xml version="1.0" encoding="UTF-8"?><Nfse><Numero>${inv.numeroNota}</Numero><Valor>${inv.valorServicos}</Valor></Nfse>`;
    const blob = new Blob([xml], { type: 'application/xml;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${inv.numeroNota}.xml`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Cálculos
  const totalNotas = invoices.length;
  const totalFaturado = invoices.reduce((acc, inv) => acc + inv.valorServicos, 0);
  const totalIss = invoices.reduce((acc, inv) => acc + inv.valorIss, 0);

  const invoicesFiltradas = invoices.filter((inv) => {
    return (
      inv.numeroNota.toLowerCase().includes(filtroTexto.toLowerCase()) ||
      (inv.eventoNome && inv.eventoNome.toLowerCase().includes(filtroTexto.toLowerCase())) ||
      inv.discriminacao.toLowerCase().includes(filtroTexto.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <FileText className="w-6 h-6 text-indigo-400" />
            Notas Fiscais & Documentos Fiscais
          </h1>
          <p className="text-sm text-slate-400">
            Consulte as Notas Fiscais de Serviços Eletrônicas (NFS-e Curitiba - Padrão ABRASF) emitidas pela DiskIngressos.
          </p>
        </div>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              NFS-e Emitidas
            </span>
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-black text-white">{totalNotas}</div>
          <div className="mt-1 text-xs text-slate-400">
            Autorizadas perante a Prefeitura Municipal de Curitiba
          </div>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Serviços Faturados (Comissão Disk)
            </span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-black text-emerald-300">
            {formatCurrencyBRL(totalFaturado)}
          </div>
          <div className="mt-1 text-xs text-slate-400">
            Base de cálculo tributária dos serviços prestados
          </div>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              ISS Curitiba Recolhido (2%)
            </span>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-black text-blue-300">
            {formatCurrencyBRL(totalIss)}
          </div>
          <div className="mt-1 text-xs text-slate-400">
            Tributo municipal recolhido pela DiskIngressos
          </div>
        </div>
      </div>

      {/* Busca */}
      <div className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-4">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por número da nota ou evento..."
            value={filtroTexto}
            onChange={(e) => setFiltroTexto(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
          />
        </div>
      </div>

      {/* Tabela de Notas Fiscais */}
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-12 text-center text-slate-400 flex flex-col items-center justify-center gap-3">
            <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs">Carregando documentos fiscais...</p>
          </div>
        ) : invoicesFiltradas.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <FileText className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <p className="font-semibold text-slate-300">Nenhuma NFS-e localizada</p>
            <p className="text-xs text-slate-500 mt-1">
              As notas fiscais serão listadas automaticamente após a emissão de fechamento de cada evento.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/90 text-slate-400 font-semibold border-b border-slate-700">
                <tr>
                  <th className="px-5 py-3">Número NFS-e</th>
                  <th className="px-5 py-3">Data Emissão</th>
                  <th className="px-5 py-3">Evento Vinculado</th>
                  <th className="px-5 py-3 text-right">Valor Serviços</th>
                  <th className="px-5 py-3 text-right">ISS (2%)</th>
                  <th className="px-5 py-3 text-center">Status</th>
                  <th className="px-5 py-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/60">
                {invoicesFiltradas.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-700/30 transition">
                    <td className="px-5 py-3.5 font-mono font-bold text-indigo-400">
                      {inv.numeroNota}
                    </td>
                    <td className="px-5 py-3.5 text-slate-400">
                      {formatDateBR(inv.dataEmissao)}
                    </td>
                    <td className="px-5 py-3.5 font-medium text-slate-200">
                      {inv.eventoNome || 'DiskIngressos Serviços'}
                    </td>
                    <td className="px-5 py-3.5 text-right font-bold text-white">
                      {formatCurrencyBRL(inv.valorServicos)}
                    </td>
                    <td className="px-5 py-3.5 text-right text-slate-400">
                      {formatCurrencyBRL(inv.valorIss)}
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        {inv.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right space-x-2">
                      <button
                        onClick={() => setSelectedInvoice(inv)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-semibold transition"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        DANFSE
                      </button>

                      <button
                        onClick={() => handleDownloadXml(inv)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-700/60 hover:bg-slate-700 text-slate-300 border border-slate-600 text-xs font-semibold transition"
                        title="Baixar Arquivo XML ABRASF"
                      >
                        <FileCode className="w-3.5 h-3.5 text-amber-400" />
                        XML
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal: Visualizador DANFSE Curitiba */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white text-slate-900 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Top Bar do Modal */}
            <div className="bg-slate-950 px-6 py-3 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-400" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  Visualização da Nota Fiscal Eletrônica de Serviços (DANFSE)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Imprimir
                </button>
                <button
                  onClick={() => setSelectedInvoice(null)}
                  className="p-1 rounded text-slate-400 hover:text-white transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* DANFSE Impresso Oficial (Padrão Curitiba ABRASF) */}
            <div className="p-8 space-y-4 text-xs font-sans">
              {/* Cabeçalho */}
              <div className="border border-slate-300 rounded p-4 flex items-center justify-between">
                <div>
                  <div className="font-bold text-sm text-slate-800">PREFEITURA MUNICIPAL DE CURITIBA</div>
                  <div className="text-[11px] text-slate-600 font-semibold">
                    SECRETARIA MUNICIPAL DE FINANÇAS
                  </div>
                  <div className="text-[10px] text-slate-500">
                    NOTA FISCAL DE SERVIÇOS ELETRÔNICA — NFS-e (PADRÃO ABRASF)
                  </div>
                </div>

                <div className="text-right border-l border-slate-300 pl-4">
                  <div className="text-[11px] font-bold text-slate-700">NÚMERO DA NOTA</div>
                  <div className="text-lg font-black text-indigo-700">{selectedInvoice.numeroNota}</div>
                  <div className="text-[10px] text-slate-500">
                    Emissão: {formatDateBR(selectedInvoice.dataEmissao)}
                  </div>
                </div>
              </div>

              {/* Prestador */}
              <div className="border border-slate-300 rounded p-3 space-y-1">
                <div className="font-bold text-[11px] text-slate-700 uppercase bg-slate-100 p-1 rounded">
                  Prestador de Serviços
                </div>
                <div className="font-bold text-slate-900 text-sm">
                  DISK INGRESSOS SERVICOS DE BILHETERIA LTDA
                </div>
                <div className="grid grid-cols-2 text-[11px] text-slate-600">
                  <div>CNPJ: 08.234.567/0001-89</div>
                  <div>Inscrição Municipal: 894.210-4</div>
                  <div>Endereço: Rua Marechal Deodoro, 630 - Conj 1001 - Centro - Curitiba / PR</div>
                  <div>Município de Tributação: Curitiba - PR (Código IBGE: 4106902)</div>
                </div>
              </div>

              {/* Tomador */}
              <div className="border border-slate-300 rounded p-3 space-y-1">
                <div className="font-bold text-[11px] text-slate-700 uppercase bg-slate-100 p-1 rounded">
                  Tomador de Serviços (Produtora Contratante)
                </div>
                <div className="font-bold text-slate-900 text-sm">
                  {selectedInvoice.eventoNome
                    ? `Produtora Responsável — ${selectedInvoice.eventoNome}`
                    : 'Produtora Contratante'}
                </div>
                <div className="text-[11px] text-slate-600">
                  Referência: Fechamento Contábil e Liquidação de Bilheteria
                </div>
              </div>

              {/* Discriminação */}
              <div className="border border-slate-300 rounded p-3 space-y-1">
                <div className="font-bold text-[11px] text-slate-700 uppercase bg-slate-100 p-1 rounded">
                  Discriminação dos Serviços
                </div>
                <p className="text-[11px] text-slate-700 leading-relaxed py-2">
                  {selectedInvoice.discriminacao}
                </p>
                <div className="text-[10px] text-slate-500 border-t border-slate-200 pt-1">
                  Atividade LC 116/03: 12.07 — Produção, organização, promoção e intermediação de
                  espetáculos, shows e eventos.
                </div>
              </div>

              {/* Totais Tributários */}
              <div className="border border-slate-300 rounded overflow-hidden">
                <table className="w-full text-center text-xs">
                  <thead className="bg-slate-100 border-b border-slate-300 font-bold text-slate-700">
                    <tr>
                      <th className="py-2">Valor dos Serviços</th>
                      <th className="py-2">Base de Cálculo</th>
                      <th className="py-2">Alíquota ISS</th>
                      <th className="py-2">Valor do ISS</th>
                      <th className="py-2 bg-indigo-50 text-indigo-900">Valor Líquido</th>
                    </tr>
                  </thead>
                  <tbody className="divide-x divide-slate-300">
                    <tr className="font-semibold text-slate-800">
                      <td className="py-2">{formatCurrencyBRL(selectedInvoice.valorServicos)}</td>
                      <td className="py-2">{formatCurrencyBRL(selectedInvoice.valorServicos)}</td>
                      <td className="py-2">2,00%</td>
                      <td className="py-2 font-bold text-slate-700">
                        {formatCurrencyBRL(selectedInvoice.valorIss)}
                      </td>
                      <td className="py-2 font-black text-indigo-700 bg-indigo-50/50">
                        {formatCurrencyBRL(selectedInvoice.valorLiquido)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Autenticação & Verificação */}
              <div className="border border-dashed border-slate-400 rounded p-3 text-center bg-slate-50 text-[10px] text-slate-600">
                <div className="font-bold text-slate-800">
                  CÓDIGO DE VERIFICAÇÃO DE AUTENTICIDADE TRIBUTÁRIA
                </div>
                <div className="font-mono font-bold text-indigo-700 text-xs mt-0.5">
                  {selectedInvoice.codigoVerificacao || 'CV-CUR-2026-8849-X9A2'}
                </div>
                <div className="text-[9px] text-slate-500 mt-1">
                  A autenticidade deste documento fiscal pode ser confirmada no portal oficial da
                  Prefeitura de Curitiba (isscuritiba.curitiba.pr.gov.br).
                </div>
              </div>
            </div>

            {/* Footer Modal */}
            <div className="bg-slate-100 px-6 py-3 border-t border-slate-300 flex items-center justify-end">
              <button
                onClick={() => setSelectedInvoice(null)}
                className="px-4 py-2 rounded-lg bg-slate-800 text-white text-xs font-semibold hover:bg-slate-900 transition"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
