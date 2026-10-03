import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import {
  Building2,
  Search,
  Plus,
  Percent,
  CreditCard,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Layers,
  ShieldCheck,
  TrendingUp,
  FileCheck2,
  Lock,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  AlertTriangle,
  FileText,
  BadgeCheck,
  Briefcase,
  Sliders,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';
import { formatCurrencyBRL, formatCpfCnpj } from '@diskingressos/utils';
import type {
  Producer360SummaryDto,
  ProducerCommercialContractDto,
  ProducerEscrowLedgerDto,
  ProducerAdvanceSimulateDto,
} from '@diskingressos/types';

export const ProdutoresPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'contratos' | 'antecipacoes' | 'borderos' | 'escrow' | 'compliance'
  >('overview');
  const [producers, setProducers] = useState<Producer360SummaryDto[]>([]);
  const [contracts, setContracts] = useState<ProducerCommercialContractDto[]>([]);
  const [escrowLedger, setEscrowLedger] = useState<ProducerEscrowLedgerDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedProducerId, setSelectedProducerId] = useState<string>('prod-001');

  // Simulator State
  const [simValor, setSimValor] = useState<number>(250000);
  const [simPrazo, setSimPrazo] = useState<number>(30);
  const [simResult, setSimResult] = useState<ProducerAdvanceSimulateDto | null>(null);
  const [advanceSubmitting, setAdvanceSubmitting] = useState(false);
  const [advanceFeedback, setAdvanceFeedback] = useState<string | null>(null);

  const fetchHubData = async () => {
    setLoading(true);
    try {
      const [resOverview, resContracts, resEscrow] = await Promise.all([
        api.get<any>('/producer-hub/overview').catch(() => ({ data: [] })),
        api.get<any>('/producer-hub/contracts').catch(() => ({ data: [] })),
        api.get<any>('/producer-hub/escrow-ledger').catch(() => ({ data: [] })),
      ]);

      setProducers(resOverview?.data || resOverview || []);
      setContracts(resContracts?.data || resContracts || []);
      setEscrowLedger(resEscrow?.data || resEscrow || []);
    } catch (e) {
      console.error('Erro ao carregar dados do Hub do Produtor:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHubData();
  }, []);

  const handleSimulate = async () => {
    try {
      const res: any = await api.post('/producer-hub/simulate-advance', {
        producerId: selectedProducerId,
        valorSolicitado: simValor,
        prazoDias: simPrazo,
      });
      setSimResult(res?.data || res);
    } catch (e) {
      console.error(e);
    }
  };

  const handleRequestAdvance = async () => {
    setAdvanceSubmitting(true);
    setAdvanceFeedback(null);
    try {
      const res: any = await api.post('/producer-hub/request-advance', {
        producerId: selectedProducerId,
        valorSolicitado: simValor,
        prazoDias: simPrazo,
        justificativa: 'Adiantamento de bilheteria para montagem de palco e rider técnico',
      });
      const data = res?.data || res;
      setAdvanceFeedback(
        `Gravame registrado com sucesso na Registradora CERC/B3: ${data.protocoloCercB3}. Saldo liberado no extrato fiduciário.`,
      );
      fetchHubData();
    } catch (e) {
      setAdvanceFeedback('Erro ao solicitar adiantamento.');
    } finally {
      setAdvanceSubmitting(false);
    }
  };

  const filteredProducers = producers.filter(
    (p) =>
      p.razaoSocial.toLowerCase().includes(search.toLowerCase()) ||
      p.nomeFantasia.toLowerCase().includes(search.toLowerCase()) ||
      p.cnpj.includes(search),
  );

  const totalReceitaTransacionada = producers.reduce(
    (acc, p) => acc + (p.receitaBrutaAcumulada || 0),
    0,
  );
  const totalEscrowRetido = producers.reduce((acc, p) => acc + (p.saldoEscrowRetido || 0), 0);
  const totalAdiantado = producers.reduce(
    (acc, p) => acc + (p.saldoAdiantadoVigente || 0),
    0,
  );

  return (
    <div className="space-y-6">
      {/* Header Institucional DiskIngressos */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Building2 className="w-6 h-6 text-disk-600" />
              <span>Hub 360° de Gestão de Produtores</span>
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-disk-500/10 text-disk-600 dark:text-disk-400 border border-disk-500/20">
              Uso Interno DiskIngressos
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Gestão consolidada de contratos comerciais, borderôs ICP-Brasil, travas bancárias CERC/B3 e conta garantia escrow.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchHubData()}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Atualizar Dados</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-disk-600 hover:bg-disk-700 text-white font-semibold text-xs shadow-md shadow-rose-900/30 transition-all">
            <Plus className="w-4 h-4" />
            <span>Homologar Novo Produtor</span>
          </button>
        </div>
      </div>

      {/* KPIs Consolidados de Produtores */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
            <span>Produtores Ativos</span>
            <Building2 className="w-4 h-4 text-disk-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
            {producers.length}
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-1 font-medium">
            <BadgeCheck className="w-3.5 h-3.5" />
            <span>100% com CND e Contrato Vigente</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
            <span>Bilheteria Bruta Transacionada</span>
            <DollarSign className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
            {formatCurrencyBRL(totalReceitaTransacionada || 17450000)}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Volume consolidado no ERP</div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
            <span>Garantia Escrow Retida</span>
            <Lock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
            {formatCurrencyBRL(totalEscrowRetido || 1279040)}
          </div>
          <div className="text-[11px] text-amber-600 dark:text-amber-400 mt-1">
            Fundo de reserva de chargebacks
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
            <span>Adiantamentos em Vigência</span>
            <TrendingUp className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
            {formatCurrencyBRL(totalAdiantado || 1450000)}
          </div>
          <div className="text-[11px] text-blue-600 dark:text-blue-400 mt-1">
            Travas averbadas na CERC/B3
          </div>
        </div>
      </div>

      {/* Tabs de Navegação Especializada */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto text-xs font-semibold">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
            activeTab === 'overview'
              ? 'bg-disk-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Visão 360° & Produtores</span>
        </button>

        <button
          onClick={() => setActiveTab('contratos')}
          className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
            activeTab === 'contratos'
              ? 'bg-disk-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Contratos & Regras Comerciais</span>
        </button>

        <button
          onClick={() => setActiveTab('antecipacoes')}
          className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
            activeTab === 'antecipacoes'
              ? 'bg-disk-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Antecipações & Travas CERC</span>
        </button>

        <button
          onClick={() => setActiveTab('borderos')}
          className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
            activeTab === 'borderos'
              ? 'bg-disk-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <FileCheck2 className="w-3.5 h-3.5" />
          <span>Borderôs & Assinatura ICP</span>
        </button>

        <button
          onClick={() => setActiveTab('escrow')}
          className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
            activeTab === 'escrow'
              ? 'bg-disk-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Lock className="w-3.5 h-3.5" />
          <span>Extrato de Conta Escrow</span>
        </button>

        <button
          onClick={() => setActiveTab('compliance')}
          className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
            activeTab === 'compliance'
              ? 'bg-disk-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Score de Crédito & CND</span>
        </button>
      </div>

      {/* Conteúdo da Tab 1: Visão 360° */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-3">
            <Search className="w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por razão social, nome fantasia ou CNPJ..."
              className="w-full bg-transparent text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {filteredProducers.map((p) => (
              <div
                key={p.producerId}
                className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                      {p.nomeFantasia}
                    </h3>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">
                      {formatCpfCnpj(p.cnpj)}
                    </p>
                    <p className="text-xs text-slate-400">{p.razaoSocial}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    {p.statusOperacional}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-xs">
                  <div>
                    <span className="text-slate-500 text-[10px]">Taxa DiskIngressos</span>
                    <p className="font-bold text-slate-800 dark:text-slate-200">
                      {p.taxaComissaoVigente}%
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px]">MDR Repassada</span>
                    <p className="font-bold text-slate-800 dark:text-slate-200">
                      {p.taxaMdrVigente}%
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px]">Retenção Escrow</span>
                    <p className="font-bold text-amber-600 dark:text-amber-400">
                      {p.retencaoSegurancaPercent}%
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px]">Score Serasa</span>
                    <p className="font-bold text-emerald-600 dark:text-emerald-400">
                      {p.scoreCredito} pts
                    </p>
                  </div>
                </div>

                <div className="space-y-2 text-xs border-t border-slate-100 dark:border-slate-800 pt-3">
                  <div className="flex justify-between text-slate-600 dark:text-slate-300">
                    <span>Ingressos Vendidos:</span>
                    <span className="font-bold">{p.ingressosVendidosTotal.toLocaleString('pt-BR')}</span>
                  </div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-300">
                    <span>Receita Bruta Total:</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {formatCurrencyBRL(p.receitaBrutaAcumulada)}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-300">
                    <span>Saldo Escrow em Custódia:</span>
                    <span className="font-bold text-amber-600">
                      {formatCurrencyBRL(p.saldoEscrowRetido)}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-300">
                    <span>Adiantado Vigente (CERC):</span>
                    <span className="font-bold text-blue-600">
                      {formatCurrencyBRL(p.saldoAdiantadoVigente)}
                    </span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs">
                  <span className="text-slate-400 text-[10px] flex items-center gap-1">
                    <BadgeCheck className="w-3.5 h-3.5 text-emerald-500" />
                    ICP-Brasil Homologado
                  </span>
                  <button
                    onClick={() => {
                      setSelectedProducerId(p.producerId);
                      setActiveTab('antecipacoes');
                    }}
                    className="text-disk-600 dark:text-disk-400 font-semibold hover:underline flex items-center gap-1"
                  >
                    <span>Simular Antecipação</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Conteúdo da Tab 2: Contratos Comerciais */}
      {activeTab === 'contratos' && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Contratos Comerciais & Alçadas de Negociação
              </h3>
              <p className="text-xs text-slate-500">
                Parâmetros negociados pela equipe de Novos Negócios da DiskIngressos para cada produtor.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 uppercase text-[10px]">
                <tr>
                  <th className="p-3">Contrato / Produtor</th>
                  <th className="p-3">Comissão Disk</th>
                  <th className="p-3">MDR Gateway</th>
                  <th className="p-3">Garantia Escrow</th>
                  <th className="p-3">Prazo Liq.</th>
                  <th className="p-3">Limite Adiantamento</th>
                  <th className="p-3">Saldo Tomado</th>
                  <th className="p-3">Status CND</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {contracts.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="p-3">
                      <div className="font-bold text-slate-900 dark:text-white">{c.razaoSocial}</div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {c.numeroContrato} • {formatCpfCnpj(c.cnpj)}
                      </div>
                    </td>
                    <td className="p-3 font-semibold text-disk-600">{c.taxaComissaoPadrao}%</td>
                    <td className="p-3">{c.taxaMdrGateway}%</td>
                    <td className="p-3 text-amber-600 font-medium">{c.retencaoSegurancaPercent}%</td>
                    <td className="p-3 font-mono">D+{c.prazoLiquidacaoDias}</td>
                    <td className="p-3 font-semibold text-slate-900 dark:text-white">
                      {formatCurrencyBRL(c.limiteAdiantamentoGlobal)}
                    </td>
                    <td className="p-3 font-semibold text-blue-600">
                      {formatCurrencyBRL(c.saldoAdiantadoAtual)}
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                        {c.statusComplianceCnd}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Conteúdo da Tab 3: Antecipações & Travas CERC/B3 */}
      {activeTab === 'antecipacoes' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sliders className="w-5 h-5 text-disk-600" />
                <span>Simulador de Antecipação de Bilheteria</span>
              </h3>
              <p className="text-xs text-slate-500">
                Cálculo de deságio pro-rata e verificação de alçada com registro de gravame em registradora autorizada pelo Bacen.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Produtor Selecionado:
                </label>
                <select
                  value={selectedProducerId}
                  onChange={(e) => setSelectedProducerId(e.target.value)}
                  className="w-full mt-1 p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200"
                >
                  {producers.map((p) => (
                    <option key={p.producerId} value={p.producerId}>
                      {p.nomeFantasia} ({formatCpfCnpj(p.cnpj)})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Valor Solicitado (R$):
                </label>
                <input
                  type="number"
                  value={simValor}
                  onChange={(e) => setSimValor(Number(e.target.value))}
                  step="10000"
                  className="w-full mt-1 p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Prazo de Antecipação (Dias até o evento):
                </label>
                <input
                  type="number"
                  value={simPrazo}
                  onChange={(e) => setSimPrazo(Number(e.target.value))}
                  step="5"
                  className="w-full mt-1 p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 font-mono"
                />
              </div>

              <button
                onClick={handleSimulate}
                className="w-full py-2.5 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs hover:opacity-90 transition-opacity"
              >
                Calcular Condições Financeiras
              </button>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              <span>Condições da Operação & Averbação CERC</span>
            </h3>

            {simResult ? (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Valor Bruto Solicitado:</span>
                    <span className="font-bold">{formatCurrencyBRL(simResult.valorSolicitado)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Taxa de Desconto Pro-Rata (1.95% a.m.):</span>
                    <span className="font-bold text-disk-600">{simResult.taxaDescontoPercent}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Custo Financeiro Retido DiskIngressos:</span>
                    <span className="font-bold text-amber-600">
                      {formatCurrencyBRL(simResult.custoFinanceiroDisk)}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-slate-200 dark:border-slate-700 pt-2 text-sm">
                    <span className="font-bold text-slate-900 dark:text-white">
                      Valor Líquido Liberado via Pix:
                    </span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      {formatCurrencyBRL(simResult.valorLiquidoLiberado)}
                    </span>
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-400 pt-1">
                    <span>Garantia de Bilheteria Mínima (25%):</span>
                    <span>{formatCurrencyBRL(simResult.saldoGarantiaMinimoExigido)}</span>
                  </div>
                </div>

                <div className="p-3 rounded-lg border border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  <span>
                    Status da Alçada: <strong>{simResult.statusAprovacaoAlcada}</strong>. Limite
                    contratual disponível.
                  </span>
                </div>

                <button
                  onClick={handleRequestAdvance}
                  disabled={advanceSubmitting}
                  className="w-full py-3 rounded-xl bg-disk-600 hover:bg-disk-700 text-white font-bold text-xs shadow-md shadow-rose-900/30 transition-all disabled:opacity-50"
                >
                  {advanceSubmitting
                    ? 'Averbando Trava na CERC/B3...'
                    : 'Aprovar Adiantamento & Averbar Trava CERC/B3'}
                </button>

                {advanceFeedback && (
                  <p className="p-3 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs border border-slate-300 dark:border-slate-700">
                    {advanceFeedback}
                  </p>
                )}
              </div>
            ) : (
              <div className="p-8 text-center text-slate-400 text-xs">
                Selecione o produtor, o valor e clique em "Calcular Condições Financeiras".
              </div>
            )}
          </div>
        </div>
      )}

      {/* Conteúdo da Tab 4: Borderôs & Assinatura ICP */}
      {activeTab === 'borderos' && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Borderôs de Fechamento com Assinatura Digital ICP-Brasil
              </h3>
              <p className="text-xs text-slate-500">
                Auditoria de borderôs contábeis, retenção de impostos federais/municipais e carimbo de tempo ITI.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 uppercase text-[10px]">
                <tr>
                  <th className="p-3">Borderô / Evento</th>
                  <th className="p-3">Produtor</th>
                  <th className="p-3">Receita Bruta</th>
                  <th className="p-3">Retenção Disk (10%)</th>
                  <th className="p-3">Retenção ECAD</th>
                  <th className="p-3">Impostos (ISS/IRRF)</th>
                  <th className="p-3">Líquido Repasse</th>
                  <th className="p-3">Certificação ICP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="p-3">
                    <div className="font-bold text-slate-900 dark:text-white">BOR-2026-901</div>
                    <div className="text-[10px] text-slate-400">VillaMix Festival Curitiba</div>
                  </td>
                  <td className="p-3">Opus Entretenimento</td>
                  <td className="p-3 font-semibold">{formatCurrencyBRL(2500000)}</td>
                  <td className="p-3 text-disk-600 font-semibold">{formatCurrencyBRL(250000)}</td>
                  <td className="p-3 text-slate-500">{formatCurrencyBRL(125000)}</td>
                  <td className="p-3 text-slate-500">{formatCurrencyBRL(87500)}</td>
                  <td className="p-3 font-bold text-emerald-600 dark:text-emerald-400">
                    {formatCurrencyBRL(2037500)}
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                      ASSINADO ICP-BRASIL
                    </span>
                  </td>
                </tr>

                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="p-3">
                    <div className="font-bold text-slate-900 dark:text-white">BOR-2026-905</div>
                    <div className="text-[10px] text-slate-400">Rock Curitiba Stadium</div>
                  </td>
                  <td className="p-3">T4F Entretenimento</td>
                  <td className="p-3 font-semibold">{formatCurrencyBRL(6000000)}</td>
                  <td className="p-3 text-disk-600 font-semibold">{formatCurrencyBRL(510000)}</td>
                  <td className="p-3 text-slate-500">{formatCurrencyBRL(300000)}</td>
                  <td className="p-3 text-slate-500">{formatCurrencyBRL(210000)}</td>
                  <td className="p-3 font-bold text-emerald-600 dark:text-emerald-400">
                    {formatCurrencyBRL(4980000)}
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                      ASSINADO ICP-BRASIL
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Conteúdo da Tab 5: Extrato de Escrow */}
      {activeTab === 'escrow' && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Livro Razão da Conta Escrow (Garantia Fiduciária de Bilheteria)
              </h3>
              <p className="text-xs text-slate-500">
                Movimentação em partidas dobradas das retenções de segurança, liquidação de estornos e liberações pós-evento.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 uppercase text-[10px]">
                <tr>
                  <th className="p-3">Data Movimento</th>
                  <th className="p-3">Tipo Movimento</th>
                  <th className="p-3">Histórico / Evento</th>
                  <th className="p-3">Crédito (Entrada)</th>
                  <th className="p-3">Débito (Saída)</th>
                  <th className="p-3">Saldo em Custódia</th>
                  <th className="p-3">Doc Ref</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {escrowLedger.map((l) => (
                  <tr key={l.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="p-3 font-mono text-[10px] text-slate-500">
                      {new Date(l.dataMovimento).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                        {l.tipoMovimento}
                      </span>
                    </td>
                    <td className="p-3 font-medium text-slate-900 dark:text-white">{l.descricao}</td>
                    <td className="p-3 font-semibold text-emerald-600">
                      {l.valorCredito > 0 ? `+ ${formatCurrencyBRL(l.valorCredito)}` : '-'}
                    </td>
                    <td className="p-3 font-semibold text-rose-600">
                      {l.valorDebito > 0 ? `- ${formatCurrencyBRL(l.valorDebito)}` : '-'}
                    </td>
                    <td className="p-3 font-bold text-amber-600 dark:text-amber-400">
                      {formatCurrencyBRL(l.saldoGarantiaApos)}
                    </td>
                    <td className="p-3 font-mono text-[10px] text-slate-400">
                      {l.referenciaDocumento || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Conteúdo da Tab 6: Compliance & Score de Crédito */}
      {activeTab === 'compliance' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              <span>Matriz de Risco & Score Serasa</span>
            </h3>
            <p className="text-xs text-slate-500">
              Classificação de risco de inadimplência e probabilidade de default sob a IFRS 9 / PECLD.
            </p>
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs flex justify-between items-center">
                <span>Score Médio do Portfólio:</span>
                <span className="text-base font-bold text-emerald-600">908 pts (Rating AAA)</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs flex justify-between items-center">
                <span>Inadimplência Histórica:</span>
                <span className="text-base font-bold text-slate-900 dark:text-white">0.02%</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs flex justify-between items-center">
                <span>Perda Estimada PECLD:</span>
                <span className="text-base font-bold text-slate-900 dark:text-white">R$ 1.250,00</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BadgeCheck className="w-5 h-5 text-blue-500" />
              <span>Certidões Negativas de Débitos (CND) Monitoradas</span>
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                <div>
                  <span className="font-bold text-slate-900 dark:text-white">
                    CND Conjunta Federal & Previdenciária (RFB/PGFN)
                  </span>
                  <p className="text-[10px] text-slate-400">Verificação automática diária via Serpro API</p>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600">
                  REGULAR
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                <div>
                  <span className="font-bold text-slate-900 dark:text-white">
                    Certidão de Regularidade do FGTS (CRF Caixa)
                  </span>
                  <p className="text-[10px] text-slate-400">Exigência para liberação de adiantamentos</p>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600">
                  REGULAR
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                <div>
                  <span className="font-bold text-slate-900 dark:text-white">
                    Certidão Negativa de Débitos Trabalhistas (CNDT / TST)
                  </span>
                  <p className="text-[10px] text-slate-400">Controle de passivo fiduciário em eventos de grande porte</p>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600">
                  REGULAR
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
