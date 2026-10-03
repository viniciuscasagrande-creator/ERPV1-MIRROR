import React, { useState } from 'react';
import {
  ShieldAlert,
  UserCheck,
  FileWarning,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Search,
  ExternalLink,
  Lock,
} from 'lucide-react';
import {
  TipoInfracaoPld,
  StatusAlertaPld,
} from '@diskingressos/types';
import type {
  PldTransactionAlertDto,
  PepScreeningRecordDto,
  CoafCommunicationReportDto,
  PldDashboardKpisDto,
} from '@diskingressos/types';

export const PldCoafCompliancePage: React.FC = () => {
  const [kpis] = useState<PldDashboardKpisDto>({
    alertasPldAtivosMes: 7,
    scoreRiscoMedioBase: 24.2,
    consultasPepRealizadas: 842,
    comunicacoesSiscoafHomologadas: 3,
    volumeFinanceiroSobQuarentenaBrl: 169500.0,
  });

  const [activeTab, setActiveTab] = useState<'alertas' | 'pep' | 'siscoaf'>('alertas');

  const [alertas] = useState<PldTransactionAlertDto[]>([
    {
      id: 'alr-001',
      codigoAlerta: 'ALR-PLD-2026-0041',
      transacaoId: 'TX-PIX-98124',
      clienteCpfCnpj: '081.294.119-02',
      clienteNome: 'Ricardo Oliveira Santos',
      tipoInfracaoDetectada: TipoInfracaoPld.SMURFING_FRACIONAMENTO,
      scoreRiscoPld: 94.5,
      valorOperacaoBrl: 49500.0,
      statusAnalise: StatusAlertaPld.EM_ANALISE_COMPLIANCE,
      dataDeteccao: '2026-04-01T16:00:00Z',
    },
    {
      id: 'alr-002',
      codigoAlerta: 'ALR-PLD-2026-0042',
      transacaoId: 'TX-CART-99412',
      clienteCpfCnpj: '11.849.201/0001-90',
      clienteNome: 'Eventos Prime Curitiba Participações Ltda',
      tipoInfracaoDetectada: TipoInfracaoPld.ALTO_VALOR_ESPECIE,
      scoreRiscoPld: 98.2,
      valorOperacaoBrl: 120000.0,
      statusAnalise: StatusAlertaPld.COMUNICADO_SISCOAF,
      dataDeteccao: '2026-04-01T16:15:00Z',
    },
    {
      id: 'alr-003',
      codigoAlerta: 'ALR-PLD-2026-0043',
      transacaoId: 'TX-CART-99415',
      clienteCpfCnpj: '029.381.992-44',
      clienteNome: 'Juliana Mendes Carvalho',
      tipoInfracaoDetectada: TipoInfracaoPld.CARTAO_MULTIPLO_SUSPEITO,
      scoreRiscoPld: 78.0,
      valorOperacaoBrl: 14200.0,
      statusAnalise: StatusAlertaPld.BLOQUEIO_CAUTELAR_ATIVO,
      dataDeteccao: '2026-04-01T16:20:00Z',
    },
  ]);

  const [cpfBusca, setCpfBusca] = useState('');
  const [pepResultado, setPepResultado] = useState<PepScreeningRecordDto | null>(null);

  const handleBuscarPep = () => {
    if (!cpfBusca) return;
    if (cpfBusca.includes('081') || cpfBusca.includes('81')) {
      setPepResultado({
        id: 'pep-001',
        cpfConsultado: cpfBusca,
        nomeCompleto: 'Ricardo Oliveira Santos',
        isPepAtivo: true,
        cargoFuncaoPublica: 'Secretário Executivo Municipal',
        orgaoPublico: 'Prefeitura Municipal de Curitiba',
        dataConsulta: new Date().toISOString(),
      });
    } else {
      setPepResultado({
        id: 'pep-002',
        cpfConsultado: cpfBusca,
        nomeCompleto: 'Consumidor Homologado Sem Vínculo Político',
        isPepAtivo: false,
        dataConsulta: new Date().toISOString(),
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300">
              FASE 38 • PLD-FT & COAF / SISCOAF
            </span>
            <span className="text-xs text-slate-500">Circular BCB 3.978/2020 & Lei 9.613/98</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
            Prevenção à Lavagem de Dinheiro (PLD-FT) & Inteligência COAF
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Monitoramento de atipicidades financeiras, radar anti-smurfing, triagem PEP e integração direta SISCOAF.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Alertas Ativos</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-amber-600">
            {kpis.alertasPldAtivosMes}
          </div>
          <span className="text-xs text-slate-500">Exigem Análise Compliance</span>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Score Risco Médio</span>
            <ShieldAlert className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {kpis.scoreRiscoMedioBase}/100
          </div>
          <span className="text-xs text-emerald-600 font-medium">Faixa de Baixo Risco Geral</span>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Triagens PEP</span>
            <UserCheck className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {kpis.consultasPepRealizadas}
          </div>
          <span className="text-xs text-slate-500">Consultas Automatizadas</span>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Comunicações COAF</span>
            <FileWarning className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-bold text-rose-600">
            {kpis.comunicacoesSiscoafHomologadas}
          </div>
          <span className="text-xs text-rose-600 font-medium">Protocoladas no SISCOAF</span>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Sob Quarentena Cautelar</span>
            <Lock className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-bold text-purple-600">
            R$ {(kpis.volumeFinanceiroSobQuarentenaBrl / 1000).toFixed(1)}k
          </div>
          <span className="text-xs text-purple-600 font-medium">Travas Preventivas</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 space-x-4">
        <button
          onClick={() => setActiveTab('alertas')}
          className={`pb-3 text-sm font-semibold transition-colors flex items-center gap-2 border-b-2 ${
            activeTab === 'alertas'
              ? 'border-rose-600 text-rose-600 dark:border-rose-400 dark:text-rose-400'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          Fila de Alertas de Risco PLD
        </button>
        <button
          onClick={() => setActiveTab('pep')}
          className={`pb-3 text-sm font-semibold transition-colors flex items-center gap-2 border-b-2 ${
            activeTab === 'pep'
              ? 'border-rose-600 text-rose-600 dark:border-rose-400 dark:text-rose-400'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          Triagem e Consulta PEP (Bacen)
        </button>
      </div>

      {/* Tab 1: Alertas */}
      {activeTab === 'alertas' && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">
              Operações Financeiras sob Suspeita ou Quarentena
            </h2>
            <span className="text-xs text-slate-500">Algoritmo de Detecção Comportamental</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 text-xs uppercase">
                <tr>
                  <th className="p-3">Código Alerta</th>
                  <th className="p-3">Cliente / CPF</th>
                  <th className="p-3">Infração Detectada</th>
                  <th className="p-3">Score Risco</th>
                  <th className="p-3">Valor Operação</th>
                  <th className="p-3">Status Compliance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {alertas.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="p-3 font-semibold text-slate-900 dark:text-white font-mono text-xs">
                      {item.codigoAlerta}
                    </td>
                    <td className="p-3">
                      <div className="font-medium text-slate-900 dark:text-white">{item.clienteNome}</div>
                      <div className="text-xs text-slate-500 font-mono">{item.clienteCpfCnpj}</div>
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {item.tipoInfracaoDetectada}
                      </span>
                    </td>
                    <td className="p-3">
                      <span
                        className={`font-bold text-xs ${
                          item.scoreRiscoPld >= 90 ? 'text-rose-600' : 'text-amber-600'
                        }`}
                      >
                        {item.scoreRiscoPld}/100
                      </span>
                    </td>
                    <td className="p-3 font-semibold text-slate-900 dark:text-white">
                      R$ {item.valorOperacaoBrl.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${
                          item.statusAnalise === StatusAlertaPld.COMUNICADO_SISCOAF
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                            : item.statusAnalise === StatusAlertaPld.BLOQUEIO_CAUTELAR_ATIVO
                            ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        }`}
                      >
                        {item.statusAnalise}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: PEP */}
      {activeTab === 'pep' && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Triagem de Pessoas Politicamente Expostas (PEP)
            </h2>
            <p className="text-xs text-slate-500">
              Consulta em bases oficiais de governança do Banco Central e COAF para cumprimento da Resolução BCB 3.978/2020.
            </p>
          </div>

          <div className="flex gap-3 max-w-lg">
            <input
              type="text"
              placeholder="Digite o CPF para triagem PEP..."
              value={cpfBusca}
              onChange={(e) => setCpfBusca(e.target.value)}
              className="flex-1 px-3 py-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700 text-sm"
            />
            <button
              onClick={handleBuscarPep}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-sm rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Search className="w-4 h-4" />
              Consultar
            </button>
          </div>

          {pepResultado && (
            <div
              className={`p-5 rounded-xl border ${
                pepResultado.isPepAtivo
                  ? 'bg-amber-50 dark:bg-amber-950/20 border-amber-300 dark:border-amber-800'
                  : 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800'
              } space-y-2`}
            >
              <div className="flex items-center gap-2">
                {pepResultado.isPepAtivo ? (
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                ) : (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                )}
                <span className="font-bold text-sm text-slate-900 dark:text-white">
                  {pepResultado.isPepAtivo ? 'VÍNCULO PEP DETECTADO (ATENÇÃO ESPECIAL REQUERIDA)' : 'CADASTRO REGULAR (NENHUM VÍNCULO PEP)'}
                </span>
              </div>
              <div className="text-xs text-slate-700 dark:text-slate-300 space-y-1">
                <div><span className="font-semibold">Nome:</span> {pepResultado.nomeCompleto}</div>
                {pepResultado.cargoFuncaoPublica && (
                  <div><span className="font-semibold">Cargo:</span> {pepResultado.cargoFuncaoPublica} ({pepResultado.orgaoPublico})</div>
                )}
                <div className="text-slate-500 text-[11px] pt-1">
                  Data da Consulta: {new Date(pepResultado.dataConsulta).toLocaleString('pt-BR')}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
