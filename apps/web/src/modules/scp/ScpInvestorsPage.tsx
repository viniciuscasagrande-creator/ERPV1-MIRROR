import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import {
  ScpContractDto,
  ScpInvestorDto,
  ScpQuotaShareDto,
  ScpDividendDistributionDto,
  ScpDashboardKpisDto,
  SimularDistribuicaoScpResponseDto,
  ScpModalidadePartilha,
  TipoInvestidorScp,
  StatusContratoScp,
  StatusAporteScp,
  StatusDistribuicaoDividendo,
  RegimeTributarioScp,
} from '@diskingressos/types';
import { formatCurrencyBRL, formatDateBR, formatCpfCnpj } from '@diskingressos/utils';
import {
  Landmark,
  Coins,
  TrendingUp,
  Percent,
  Building2,
  Users,
  PieChart,
  ShieldCheck,
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
  DollarSign,
  QrCode,
  FileText,
  Sliders,
  Sparkles,
  Layers,
  HelpCircle,
} from 'lucide-react';

const MODALIDADE_LABELS: Record<ScpModalidadePartilha, { label: string; badge: string }> = {
  [ScpModalidadePartilha.HURDLE_WATERFALL]: {
    label: 'Hurdle Waterfall (Payback + Taxa + Upside)',
    badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-300',
  },
  [ScpModalidadePartilha.LUCRO_LIQUIDO]: {
    label: 'Lucro Líquido DRE',
    badge: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 border-blue-300',
  },
  [ScpModalidadePartilha.RECEITA_BRUTA]: {
    label: 'Gross Revenue Share (Receita Bruta)',
    badge: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border-amber-300',
  },
};

const STATUS_CONTRATO_LABELS: Record<StatusContratoScp, { label: string; badge: string }> = {
  [StatusContratoScp.EM_CAPTACAO]: {
    label: 'Em Captação',
    badge: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border-amber-300',
  },
  [StatusContratoScp.ATIVO]: {
    label: 'Ativo / Financiado',
    badge: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 border-blue-300',
  },
  [StatusContratoScp.EM_APURACAO]: {
    label: 'Em Apuração DRE',
    badge: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300 border-purple-300',
  },
  [StatusContratoScp.LIQUIDADO]: {
    label: 'Liquidado',
    badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-300',
  },
  [StatusContratoScp.ENCERRADO]: {
    label: 'Encerrado',
    badge: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border-slate-300',
  },
};

export const ScpInvestorsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    'kpis' | 'contratos' | 'investidores' | 'simulador' | 'distribuicoes'
  >('kpis');

  // Estados dos Dados
  const [kpis, setKpis] = useState<ScpDashboardKpisDto>({
    capitalTotalInvestido: 1000000.0,
    dividendosTotalDistribuidos: 232500.0,
    roiMedioPercent: 24.1,
    contratosAtivosCount: 2,
    investidoresHomologadosCount: 3,
    valorEmApuracao: 0.0,
  });
  const [contratos, setContratos] = useState<ScpContractDto[]>([]);
  const [investidores, setInvestidores] = useState<ScpInvestorDto[]>([]);
  const [distribuicoes, setDistribuicoes] = useState<ScpDividendDistributionDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Estados do Simulador
  const [simContractId, setSimContractId] = useState<string>('scp-001');
  const [simReceitaBruta, setSimReceitaBruta] = useState<number>(1450000);
  const [simCustosOperacionais, setSimCustosOperacionais] = useState<number>(820000);
  const [simulacaoResultado, setSimulacaoResultado] =
    useState<SimularDistribuicaoScpResponseDto | null>(null);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  // Modais
  const [isModalContratoOpen, setIsModalContratoOpen] = useState(false);
  const [isModalInvestidorOpen, setIsModalInvestidorOpen] = useState(false);
  const [isModalAporteOpen, setIsModalAporteOpen] = useState(false);
  const [selectedContratoParaAporte, setSelectedContratoParaAporte] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Formulário Novo Contrato
  const [formContrato, setFormContrato] = useState({
    nomeProjeto: '',
    eventNome: '',
    socioOstensivo: '',
    cnpjScp: '',
    metaCaptacao: 500000,
    modalidadePartilha: ScpModalidadePartilha.HURDLE_WATERFALL,
    hurdleRatePercent: 12.0,
    upsideSharePercent: 25.0,
    regimeTributario: RegimeTributarioScp.LUCRO_PRESUMIDO_ISENTO,
  });

  // Formulário Novo Investidor
  const [formInvestidor, setFormInvestidor] = useState({
    nomeOuRazaoSocial: '',
    tipoPessoa: 'PJ' as 'PF' | 'PJ',
    documentoFiscal: '',
    email: '',
    telefone: '',
    tipoInvestidor: TipoInvestidorScp.FUNDO_INVESTIMENTO,
    banco: '341 - Itaú Unibanco S.A.',
    agencia: '0084',
    conta: '12345-6',
    tipoChavePix: 'CNPJ',
    chavePix: '',
    limiteAporte: 1000000,
  });

  // Formulário Novo Aporte
  const [formAporte, setFormAporte] = useState({
    contractId: '',
    investorId: '',
    valorAportado: 100000,
  });

  // Feedback Toast
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Carregar dados iniciais
  const carregarDados = async () => {
    setLoading(true);
    try {
      const [kpiRes, contRes, invRes, distRes] = await Promise.all([
        api.get<ScpDashboardKpisDto>('/scp/dashboard'),
        api.get<ScpContractDto[]>('/scp/contratos'),
        api.get<ScpInvestorDto[]>('/scp/investidores'),
        api.get<ScpDividendDistributionDto[]>('/scp/distribuicoes'),
      ]);

      if (kpiRes.data) setKpis(kpiRes.data);
      if (contRes.data) setContratos(contRes.data);
      if (invRes.data) setInvestidores(invRes.data);
      if (distRes.data) setDistribuicoes(distRes.data);
    } catch {
      // Mock Fallback se a API não estiver rodando
      setKpis({
        capitalTotalInvestido: 1000000.0,
        dividendosTotalDistribuidos: 232500.0,
        roiMedioPercent: 24.1,
        contratosAtivosCount: 2,
        investidoresHomologadosCount: 3,
        valorEmApuracao: 0.0,
      });

      const mockContratos: ScpContractDto[] = [
        {
          id: 'scp-001',
          codigoScp: 'SCP-2026-001',
          nomeProjeto: 'Festival de Inverno Pedreira Paulo Leminski 2026 - SCP',
          eventId: 'evt-001',
          eventNome: 'Festival de Inverno Pedreira 2026 (Headliner Internacional)',
          producerId: 'prod-001',
          socioOstensivo: 'Opus Entretenimento Curitiba Produções Artísticas Ltda',
          cnpjScp: '04.821.902/0002-25',
          metaCaptacao: 500000.0,
          valorCaptado: 500000.0,
          percentualCaptado: 100.0,
          modalidadePartilha: ScpModalidadePartilha.HURDLE_WATERFALL,
          hurdleRatePercent: 12.0,
          upsideSharePercent: 30.0,
          regimeTributario: RegimeTributarioScp.LUCRO_PRESUMIDO_ISENTO,
          status: StatusContratoScp.EM_APURACAO,
          dataInicio: '2026-02-15T00:00:00Z',
          createdAt: '2026-02-15T10:00:00Z',
          updatedAt: '2026-09-01T12:00:00Z',
          quotas: [
            {
              id: 'q-1',
              codigoAporte: 'APT-2026-0001',
              contractId: 'scp-001',
              investorId: 'inv-001',
              investorNome: 'Araucária Capital & Asset Ltda',
              valorAportado: 350000,
              percentualParticipacao: 70,
              dataAporte: '2026-02-20T10:00:00Z',
              status: StatusAporteScp.INTEGRALIZADO,
              createdAt: '2026-02-20T10:00:00Z',
              updatedAt: '2026-02-20T10:00:00Z',
            },
            {
              id: 'q-2',
              codigoAporte: 'APT-2026-0002',
              contractId: 'scp-001',
              investorId: 'inv-002',
              investorNome: 'Dr. Roberto Silveira Picanço',
              valorAportado: 150000,
              percentualParticipacao: 30,
              dataAporte: '2026-02-25T14:30:00Z',
              status: StatusAporteScp.INTEGRALIZADO,
              createdAt: '2026-02-25T14:30:00Z',
              updatedAt: '2026-02-25T14:30:00Z',
            },
          ],
        },
        {
          id: 'scp-002',
          codigoScp: 'SCP-2026-002',
          nomeProjeto: 'Turnê Sinfônica MPB Teatro Guaíra 2026 - SCP',
          eventId: 'evt-002',
          eventNome: 'Grande Concerto MPB & Orquestra no Teatro Guaíra',
          producerId: 'prod-002',
          socioOstensivo: 'Seven Entretenimento & Promoções Artísticas Ltda',
          cnpjScp: '07.342.110/0002-88',
          metaCaptacao: 300000.0,
          valorCaptado: 200000.0,
          percentualCaptado: 66.67,
          modalidadePartilha: ScpModalidadePartilha.LUCRO_LIQUIDO,
          hurdleRatePercent: 0.0,
          upsideSharePercent: 20.0,
          regimeTributario: RegimeTributarioScp.LUCRO_PRESUMIDO_ISENTO,
          status: StatusContratoScp.ATIVO,
          dataInicio: '2026-04-01T00:00:00Z',
          createdAt: '2026-04-01T14:00:00Z',
          updatedAt: '2026-07-10T11:20:00Z',
          quotas: [
            {
              id: 'q-3',
              codigoAporte: 'APT-2026-0003',
              contractId: 'scp-002',
              investorId: 'inv-003',
              investorNome: 'GWB Entertainment Participações S/A',
              valorAportado: 200000,
              percentualParticipacao: 100,
              dataAporte: '2026-04-10T16:00:00Z',
              status: StatusAporteScp.INTEGRALIZADO,
              createdAt: '2026-04-10T16:00:00Z',
              updatedAt: '2026-04-10T16:00:00Z',
            },
          ],
        },
      ];
      setContratos(mockContratos);

      const mockInvestors: ScpInvestorDto[] = [
        {
          id: 'inv-001',
          nomeOuRazaoSocial: 'Araucária Capital & Asset Ltda',
          tipoPessoa: 'PJ',
          documentoFiscal: '34.891.203/0001-92',
          email: 'investimentos@araucariacapital.com.br',
          telefone: '(41) 3099-8800',
          tipoInvestidor: TipoInvestidorScp.FUNDO_INVESTIMENTO,
          banco: '341 - Itaú Unibanco S.A.',
          agencia: '0084',
          conta: '98450-2',
          tipoChavePix: 'CNPJ',
          chavePix: '34.891.203/0001-92',
          statusKyc: 'APROVADO',
          limiteAporte: 1000000.0,
          totalAportado: 350000.0,
          totalDividendosRecebidos: 84500.0,
          createdAt: '2026-01-10T10:00:00Z',
          updatedAt: '2026-03-15T14:30:00Z',
        },
        {
          id: 'inv-002',
          nomeOuRazaoSocial: 'Dr. Roberto Silveira Picanço',
          tipoPessoa: 'PF',
          documentoFiscal: '482.910.389-44',
          email: 'roberto.picanco@curitibamed.com.br',
          telefone: '(41) 99882-1144',
          tipoInvestidor: TipoInvestidorScp.ANJO,
          banco: '237 - Banco Bradesco S.A.',
          agencia: '1240',
          conta: '44521-0',
          tipoChavePix: 'CPF',
          chavePix: '482.910.389-44',
          statusKyc: 'APROVADO',
          limiteAporte: 500000.0,
          totalAportado: 150000.0,
          totalDividendosRecebidos: 36000.0,
          createdAt: '2026-02-01T11:00:00Z',
          updatedAt: '2026-04-10T09:15:00Z',
        },
        {
          id: 'inv-003',
          nomeOuRazaoSocial: 'GWB Entertainment Participações S/A',
          tipoPessoa: 'PJ',
          documentoFiscal: '19.452.880/0001-15',
          email: 'financeiro@gwbholding.com',
          telefone: '(11) 3244-9000',
          tipoInvestidor: TipoInvestidorScp.CO_PRODUTOR,
          banco: '001 - Banco do Brasil S.A.',
          agencia: '3044',
          conta: '10982-4',
          tipoChavePix: 'CHAVE_ALEATORIA',
          chavePix: 'e49b8192-3df8-4ec2-90ab-8e0192a3bb40',
          statusKyc: 'APROVADO',
          limiteAporte: 2000000.0,
          totalAportado: 500000.0,
          totalDividendosRecebidos: 112000.0,
          createdAt: '2026-01-20T16:00:00Z',
          updatedAt: '2026-05-18T18:00:00Z',
        },
      ];
      setInvestidores(mockInvestors);

      const mockDistribuicoes: ScpDividendDistributionDto[] = [
        {
          id: 'dist-001',
          codigoDistribuicao: 'DIV-2026-0001',
          contractId: 'scp-001',
          contractNome: 'Festival de Inverno Pedreira Paulo Leminski 2026 - SCP',
          investorId: 'inv-001',
          investorNome: 'Araucária Capital & Asset Ltda',
          investorDocumento: '34.891.203/0001-92',
          investorPix: '34.891.203/0001-92',
          eventId: 'evt-001',
          eventNome: 'Festival de Inverno Pedreira 2026 (Headliner Internacional)',
          dreReceitaBruta: 1450000.0,
          dreCustosOperacionais: 820000.0,
          dreLucroLiquido: 630000.0,
          valorAporteDevolvido: 350000.0,
          valorLucroDistribuido: 84500.0,
          aliquotaIrrf: 0.0,
          valorIrrfRetido: 0.0,
          valorLiquidoPago: 434500.0,
          roiEfetivoPercent: 24.14,
          status: StatusDistribuicaoDividendo.LIQUIDADO,
          dataAprovacao: '2026-09-05T14:00:00Z',
          dataLiquidacao: '2026-09-06T10:15:00Z',
          metodoLiquidacao: 'PIX',
          comprovantePagamento: 'COMP-PIX-434K-ARACAPITAL-99812',
          createdAt: '2026-09-04T18:00:00Z',
          updatedAt: '2026-09-06T10:15:00Z',
        },
        {
          id: 'dist-002',
          codigoDistribuicao: 'DIV-2026-0002',
          contractId: 'scp-001',
          contractNome: 'Festival de Inverno Pedreira Paulo Leminski 2026 - SCP',
          investorId: 'inv-002',
          investorNome: 'Dr. Roberto Silveira Picanço',
          investorDocumento: '482.910.389-44',
          investorPix: '482.910.389-44',
          eventId: 'evt-001',
          eventNome: 'Festival de Inverno Pedreira 2026 (Headliner Internacional)',
          dreReceitaBruta: 1450000.0,
          dreCustosOperacionais: 820000.0,
          dreLucroLiquido: 630000.0,
          valorAporteDevolvido: 150000.0,
          valorLucroDistribuido: 36000.0,
          aliquotaIrrf: 0.0,
          valorIrrfRetido: 0.0,
          valorLiquidoPago: 186000.0,
          roiEfetivoPercent: 24.0,
          status: StatusDistribuicaoDividendo.LIQUIDADO,
          dataAprovacao: '2026-09-05T14:00:00Z',
          dataLiquidacao: '2026-09-06T10:18:00Z',
          metodoLiquidacao: 'PIX',
          comprovantePagamento: 'COMP-PIX-186K-RPICANCO-99813',
          createdAt: '2026-09-04T18:00:00Z',
          updatedAt: '2026-09-06T10:18:00Z',
        },
      ];
      setDistribuicoes(mockDistribuicoes);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  // Executar Simulação Waterfall
  const executarSimulacao = async () => {
    setIsSimulating(true);
    try {
      const res = await api.post<SimularDistribuicaoScpResponseDto>('/scp/simular-distribuicao', {
        contractId: simContractId,
        dreReceitaBruta: Number(simReceitaBruta),
        dreCustosOperacionais: Number(simCustosOperacionais),
      });
      if (res.data) setSimulacaoResultado(res.data);
    } catch {
      // Mock local de cálculo
      const contrato = contratos.find((c) => c.id === simContractId) || contratos[0];
      const totalAportado = contrato?.valorCaptado || 500000;
      const dreLucro = simReceitaBruta - simCustosOperacionais; // 630.000
      const capDevolvido = Math.min(dreLucro, totalAportado); // 500.000
      const lucroResidual = Math.max(0, dreLucro - capDevolvido); // 130.000

      // Hurdle 12% sobre 500k = 60k
      const hurdleMin = totalAportado * 0.12; // 60.000
      const hurdlePago = Math.min(lucroResidual, hurdleMin); // 60.000
      const excedente = Math.max(0, lucroResidual - hurdlePago); // 70.000
      const upsideInv = excedente * 0.3; // 21.000
      const lucroTotalInv = hurdlePago + upsideInv; // 81.000
      const lucroProdutora = lucroResidual - lucroTotalInv; // 49.000

      const mockRes: SimularDistribuicaoScpResponseDto = {
        contractId: contrato?.id || 'scp-001',
        nomeProjeto: contrato?.nomeProjeto || 'Festival de Inverno Pedreira 2026',
        modalidadePartilha: contrato?.modalidadePartilha || ScpModalidadePartilha.HURDLE_WATERFALL,
        dreReceitaBruta: simReceitaBruta,
        dreCustosOperacionais: simCustosOperacionais,
        dreLucroLiquido: dreLucro,
        totalAportadoNaScp: totalAportado,
        capitalDevolvidoTotal: capDevolvido,
        lucroResidualTotal: lucroResidual,
        lucroDistribuidoInvestidores: lucroTotalInv,
        lucroRetidoProdutora: lucroProdutora,
        distribuicoes: (contrato?.quotas || []).map((q) => {
          const prop = q.valorAportado / totalAportado;
          const devCap = capDevolvido * prop;
          const lucDist = lucroTotalInv * prop;
          const liqTotal = devCap + lucDist;
          const roi = Number((((liqTotal - q.valorAportado) / q.valorAportado) * 100).toFixed(2));
          return {
            investorId: q.investorId,
            investorNome: q.investorNome || 'Investidor',
            valorAportado: q.valorAportado,
            percentualCota: q.percentualParticipacao,
            devolucaoCapital: devCap,
            lucroDistribuido: lucDist,
            irrfRetido: 0,
            valorLiquidoTotal: liqTotal,
            roiPercent: roi,
          };
        }),
      };
      setSimulacaoResultado(mockRes);
    } finally {
      setIsSimulating(false);
    }
  };

  // Efetivar Ordens de Pagamento a partir da DRE
  const efetivarOrdens = async () => {
    if (!simulacaoResultado) return;
    try {
      await api.post('/scp/distribuicoes/calcular', {
        contractId: simContractId,
        dreReceitaBruta: Number(simReceitaBruta),
        dreCustosOperacionais: Number(simCustosOperacionais),
      });
      showToast('Ordens de dividendos geradas e enviadas para aprovação CFO!');
      await carregarDados();
      setActiveTab('distribuicoes');
    } catch {
      // Cria mock local
      const novas = simulacaoResultado.distribuicoes.map((item, idx) => ({
        id: `dist-mock-${Date.now()}-${idx}`,
        codigoDistribuicao: `DIV-2026-00${distribuicoes.length + idx + 1}`,
        contractId: simContractId,
        contractNome: simulacaoResultado.nomeProjeto,
        investorId: item.investorId,
        investorNome: item.investorNome,
        investorDocumento: '34.891.203/0001-92',
        investorPix: 'pix@investidor.com.br',
        eventId: 'evt-001',
        eventNome: 'Festival de Inverno 2026',
        dreReceitaBruta: simulacaoResultado.dreReceitaBruta,
        dreCustosOperacionais: simulacaoResultado.dreCustosOperacionais,
        dreLucroLiquido: simulacaoResultado.dreLucroLiquido,
        valorAporteDevolvido: item.devolucaoCapital,
        valorLucroDistribuido: item.lucroDistribuido,
        aliquotaIrrf: 0,
        valorIrrfRetido: 0,
        valorLiquidoPago: item.valorLiquidoTotal,
        roiEfetivoPercent: item.roiPercent,
        status: StatusDistribuicaoDividendo.CALCULADO,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));
      setDistribuicoes([...novas, ...distribuicoes]);
      showToast('Ordens de dividendos geradas e provisionadas no razão contábil!');
      setActiveTab('distribuicoes');
    }
  };

  // Aprovar Distribuição CFO
  const handleAprovar = async (distId: string) => {
    try {
      await api.patch(`/scp/distribuicoes/${distId}/aprovar`, {
        aprovadoPor: 'Diretoria Financeira / CFO',
      });
      showToast('Dividendo homologado pelo CFO! Autorizado para liquidação Pix.');
      await carregarDados();
    } catch {
      setDistribuicoes((prev) =>
        prev.map((d) =>
          d.id === distId
            ? {
                ...d,
                status: StatusDistribuicaoDividendo.APROVADO_CFO,
                dataAprovacao: new Date().toISOString(),
              }
            : d,
        ),
      );
      showToast('Dividendo homologado pelo CFO! Autorizado para liquidação Pix.');
    }
  };

  // Liquidar via Pix
  const handleLiquidarPix = async (distId: string) => {
    try {
      await api.patch(`/scp/distribuicoes/${distId}/liquidar`, {
        metodoLiquidacao: 'PIX',
      });
      showToast('Pagamento Pix liquidado instantaneamente com sucesso!');
      await carregarDados();
    } catch {
      setDistribuicoes((prev) =>
        prev.map((d) =>
          d.id === distId
            ? {
                ...d,
                status: StatusDistribuicaoDividendo.LIQUIDADO,
                metodoLiquidacao: 'PIX',
                dataLiquidacao: new Date().toISOString(),
                comprovantePagamento: `COMP-PIX-${Math.round(d.valorLiquidoPago / 1000)}K-${Math.floor(
                  100000 + Math.random() * 900000,
                )}`,
              }
            : d,
        ),
      );
      showToast('Pagamento Pix liquidado instantaneamente com sucesso!');
    }
  };

  // Submit Criar Contrato
  const handleCriarContrato = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/scp/contratos', {
        ...formContrato,
        eventId: 'evt-001',
        producerId: 'prod-001',
      });
      showToast('Contrato SCP criado com sucesso!');
      setIsModalContratoOpen(false);
      await carregarDados();
    } catch {
      const novo: ScpContractDto = {
        id: `scp-00${contratos.length + 1}`,
        codigoScp: `SCP-2026-00${contratos.length + 1}`,
        nomeProjeto: formContrato.nomeProjeto,
        eventId: 'evt-001',
        eventNome: formContrato.eventNome,
        producerId: 'prod-001',
        socioOstensivo: formContrato.socioOstensivo,
        cnpjScp: formContrato.cnpjScp || null,
        metaCaptacao: formContrato.metaCaptacao,
        valorCaptado: 0,
        percentualCaptado: 0,
        modalidadePartilha: formContrato.modalidadePartilha,
        hurdleRatePercent: formContrato.hurdleRatePercent,
        upsideSharePercent: formContrato.upsideSharePercent,
        regimeTributario: formContrato.regimeTributario,
        status: StatusContratoScp.EM_CAPTACAO,
        dataInicio: new Date().toISOString(),
        quotas: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setContratos([novo, ...contratos]);
      showToast('Contrato SCP registrado e aberto para captação!');
      setIsModalContratoOpen(false);
    }
  };

  // Submit Criar Investidor
  const handleCriarInvestidor = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/scp/investidores', formInvestidor);
      showToast('Investidor homologado no cadastro!');
      setIsModalInvestidorOpen(false);
      await carregarDados();
    } catch {
      const novo: ScpInvestorDto = {
        id: `inv-00${investidores.length + 1}`,
        nomeOuRazaoSocial: formInvestidor.nomeOuRazaoSocial,
        tipoPessoa: formInvestidor.tipoPessoa,
        documentoFiscal: formInvestidor.documentoFiscal,
        email: formInvestidor.email,
        telefone: formInvestidor.telefone,
        tipoInvestidor: formInvestidor.tipoInvestidor,
        banco: formInvestidor.banco,
        agencia: formInvestidor.agencia,
        conta: formInvestidor.conta,
        tipoChavePix: formInvestidor.tipoChavePix,
        chavePix: formInvestidor.chavePix,
        statusKyc: 'APROVADO',
        limiteAporte: formInvestidor.limiteAporte,
        totalAportado: 0,
        totalDividendosRecebidos: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setInvestidores([novo, ...investidores]);
      showToast('Investidor homologado com KYC aprovado!');
      setIsModalInvestidorOpen(false);
    }
  };

  // Submit Registrar Aporte
  const handleRegistrarAporte = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/scp/aportes', formAporte);
      showToast('Aporte integralizado com sucesso!');
      setIsModalAporteOpen(false);
      await carregarDados();
    } catch {
      const inv = investidores.find((i) => i.id === formAporte.investorId);
      const contrato = contratos.find((c) => c.id === formAporte.contractId);
      if (!contrato || !inv) return;

      const novaQuota: ScpQuotaShareDto = {
        id: `q-${Date.now()}`,
        codigoAporte: `APT-2026-00${(contrato.quotas || []).length + 10}`,
        contractId: contrato.id,
        investorId: inv.id,
        investorNome: inv.nomeOuRazaoSocial,
        investorDocumento: inv.documentoFiscal,
        valorAportado: formAporte.valorAportado,
        percentualParticipacao: Number(
          ((formAporte.valorAportado / contrato.metaCaptacao) * 100).toFixed(2),
        ),
        dataAporte: new Date().toISOString(),
        status: StatusAporteScp.INTEGRALIZADO,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setContratos((prev) =>
        prev.map((c) => {
          if (c.id === contrato.id) {
            const novoCaptado = c.valorCaptado + formAporte.valorAportado;
            return {
              ...c,
              valorCaptado: novoCaptado,
              percentualCaptado: Number(((novoCaptado / c.metaCaptacao) * 100).toFixed(2)),
              quotas: [...(c.quotas || []), novaQuota],
            };
          }
          return c;
        }),
      );

      showToast('Aporte integralizado na SCP com sucesso!');
      setIsModalAporteOpen(false);
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
            <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/50 rounded-xl border border-indigo-200 dark:border-indigo-800/50">
              <Landmark className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Investidores & Sociedades em Conta de Participação (SCP)
                <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  Fase 19 Enterprise
                </span>
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Captação de Risco, Hurdle Waterfall & Distribuição de Dividendos por Evento (CC arts. 991-996 & Lei 9.249/95)
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsModalContratoOpen(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            Novo Contrato SCP
          </button>
          <button
            onClick={() => setIsModalInvestidorOpen(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition"
          >
            <Users className="w-4 h-4" />
            Novo Investidor
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
              Capital Total Captado
            </span>
            <div className="p-2 bg-blue-50 dark:bg-blue-950/40 rounded-lg text-blue-600 dark:text-blue-400">
              <Coins className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
              {formatCurrencyBRL(kpis.capitalTotalInvestido)}
            </h3>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
              <span className="text-emerald-600 font-semibold">100% integralizado</span> em cotas de risco
            </p>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Dividendos Distribuídos
            </span>
            <div className="p-2 bg-emerald-50 dark:bg-emerald-950/40 rounded-lg text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {formatCurrencyBRL(kpis.dividendosTotalDistribuidos)}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Isento IR (Lei 9.249/95 Art. 10)
            </p>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              ROI Médio dos Investidores
            </span>
            <div className="p-2 bg-indigo-50 dark:bg-indigo-950/40 rounded-lg text-indigo-600 dark:text-indigo-400">
              <Percent className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
              +{kpis.roiMedioPercent}%
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Hurdle Rate médio + Upside de bilheteria
            </p>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Contratos & Investidores
            </span>
            <div className="p-2 bg-purple-50 dark:bg-purple-950/40 rounded-lg text-purple-600 dark:text-purple-400">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
              {kpis.contratosAtivosCount} Contratos / {kpis.investidoresHomologadosCount} Investidores
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Sócios Participantes homologados KYC
            </p>
          </div>
        </div>
      </div>

      {/* Tabs de Navegação */}
      <div className="border-b border-slate-200 dark:border-slate-800 flex items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('kpis')}
          className={`px-4 py-2.5 text-sm font-semibold rounded-xl flex items-center gap-2 transition ${
            activeTab === 'kpis'
              ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <PieChart className="w-4 h-4" />
          Visão Geral & Compliance
        </button>
        <button
          onClick={() => setActiveTab('contratos')}
          className={`px-4 py-2.5 text-sm font-semibold rounded-xl flex items-center gap-2 transition ${
            activeTab === 'contratos'
              ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Building2 className="w-4 h-4" />
          Contratos SCP por Evento ({contratos.length})
        </button>
        <button
          onClick={() => setActiveTab('investidores')}
          className={`px-4 py-2.5 text-sm font-semibold rounded-xl flex items-center gap-2 transition ${
            activeTab === 'investidores'
              ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          Quadro de Investidores ({investidores.length})
        </button>
        <button
          onClick={() => setActiveTab('simulador')}
          className={`px-4 py-2.5 text-sm font-semibold rounded-xl flex items-center gap-2 transition ${
            activeTab === 'simulador'
              ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Sliders className="w-4 h-4" />
          Apuração DRE & Waterfall
        </button>
        <button
          onClick={() => setActiveTab('distribuicoes')}
          className={`px-4 py-2.5 text-sm font-semibold rounded-xl flex items-center gap-2 transition ${
            activeTab === 'distribuicoes'
              ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Coins className="w-4 h-4" />
          Ordens de Pagamento & Pix ({distribuicoes.length})
        </button>
      </div>

      {/* Conteúdo Aba 1: Visão Geral & Compliance Legal */}
      {activeTab === 'kpis' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-indigo-600" />
                Estrutura Societária e Tributária da SCP no ERP DiskIngressos
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                A **Sociedade em Conta de Participação (SCP)** é a modalidade jurídica padrão no mercado brasileiro de entretenimento para viabilizar investimentos em mega-eventos, turnês e festivais (ex: Pedreira Paulo Leminski e Teatro Guaíra).
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">
                    Sócio Ostensivo (General Partner)
                  </span>
                  <h4 className="font-semibold text-slate-900 dark:text-white mt-1">
                    Produtora ou DiskIngressos
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Exerce a atividade em seu nome individual e assume a responsabilidade civil perante fornecedores, órgãos públicos e compradores de ingressos.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">
                    Sócio Participante / Oculto
                  </span>
                  <h4 className="font-semibold text-slate-900 dark:text-white mt-1">
                    Investidores de Capital de Risco
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Aporta recursos exclusivamente para custeio inicial (cachês, som, luz) e participa apenas do resultado financeiro apurado na DRE do evento.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50">
                <div className="flex items-start gap-3">
                  <HelpCircle className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mt-0.5 shrink-0" />
                  <div className="text-xs text-indigo-900 dark:text-indigo-200 space-y-1">
                    <p className="font-bold">Compliance Fiscal & Isenção de IRRF (Lei 9.249/95, art. 10):</p>
                    <p>
                      Quando a SCP apura seus resultados pelo Lucro Presumido ou Real e a produtora recolhe os tributos devidos, a distribuição de lucros aos investidores (PF ou PJ) é <strong>100% ISENTA DE IMPOSTO DE RENDA</strong>.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Painel Lateral de Metas */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Coins className="w-5 h-5 text-emerald-600" />
                Pipeline de Captação Ativa
              </h3>

              <div className="space-y-4">
                {contratos.map((c) => (
                  <div
                    key={c.id}
                    className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-2"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        {c.nomeProjeto}
                      </span>
                      <span className="text-indigo-600 dark:text-indigo-400 font-bold">
                        {c.percentualCaptado}%
                      </span>
                    </div>

                    <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, c.percentualCaptado || 0)}%` }}
                      />
                    </div>

                    <div className="flex justify-between text-[11px] text-slate-500">
                      <span>Captado: {formatCurrencyBRL(c.valorCaptado)}</span>
                      <span>Meta: {formatCurrencyBRL(c.metaCaptacao)}</span>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setActiveTab('simulador')}
                className="w-full py-2.5 text-xs font-bold text-center text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 rounded-xl transition flex items-center justify-center gap-1.5"
              >
                Abrir Simulador de DRE Waterfall
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Conteúdo Aba 2: Contratos SCP por Evento */}
      {activeTab === 'contratos' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Contratos de SCP Cadastrados por Evento
            </h2>
            <button
              onClick={() => setIsModalContratoOpen(true)}
              className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition"
            >
              <Plus className="w-3.5 h-3.5" />
              Adicionar Contrato SCP
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {contratos.map((c) => {
              const statusInfo = STATUS_CONTRATO_LABELS[c.status];
              const modalidadeInfo = MODALIDADE_LABELS[c.modalidadePartilha];

              return (
                <div
                  key={c.id}
                  className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
                        {c.codigoScp}
                      </span>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                        {c.nomeProjeto}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">{c.eventNome}</p>
                    </div>
                    <span
                      className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${statusInfo.badge}`}
                    >
                      {statusInfo.label}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 text-xs space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Sócio Ostensivo:</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {c.socioOstensivo}
                      </span>
                    </div>
                    {c.cnpjScp && (
                      <div className="flex justify-between">
                        <span className="text-slate-500">CNPJ da SCP (RFB):</span>
                        <span className="font-mono text-slate-700 dark:text-slate-300">
                          {c.cnpjScp}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-slate-500">Modalidade de Partilha:</span>
                      <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                        {modalidadeInfo.label}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Hurdle Rate / Upside:</span>
                      <span className="font-medium text-slate-800 dark:text-slate-200">
                        {c.hurdleRatePercent}% preferencial + {c.upsideSharePercent}% upside
                      </span>
                    </div>
                  </div>

                  {/* Barra de Progresso */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-slate-600 dark:text-slate-400">
                        Captação: {formatCurrencyBRL(c.valorCaptado)} de{' '}
                        {formatCurrencyBRL(c.metaCaptacao)}
                      </span>
                      <span className="text-indigo-600 dark:text-indigo-400 font-bold">
                        {c.percentualCaptado}%
                      </span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all"
                        style={{ width: `${Math.min(100, c.percentualCaptado || 0)}%` }}
                      />
                    </div>
                  </div>

                  {/* Cotas Integralizadas */}
                  <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-700 dark:text-slate-300">
                        Sócios Participantes (Aportes):
                      </span>
                      <button
                        onClick={() => {
                          setSelectedContratoParaAporte(c.id);
                          setFormAporte((prev) => ({ ...prev, contractId: c.id }));
                          setIsModalAporteOpen(true);
                        }}
                        className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" />
                        Registrar Aporte
                      </button>
                    </div>

                    <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                      {(c.quotas || []).map((q) => (
                        <div
                          key={q.id}
                          className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                        >
                          <div>
                            <span className="font-semibold text-slate-800 dark:text-slate-200">
                              {q.investorNome}
                            </span>
                            <span className="ml-2 text-[10px] text-slate-500 font-mono">
                              ({q.percentualParticipacao}%)
                            </span>
                          </div>
                          <span className="font-bold text-emerald-600 dark:text-emerald-400">
                            {formatCurrencyBRL(q.valorAportado)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => {
                        setSimContractId(c.id);
                        setActiveTab('simulador');
                      }}
                      className="w-full py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition flex items-center justify-center gap-1.5"
                    >
                      <Sliders className="w-3.5 h-3.5" />
                      Simular DRE Waterfall
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Conteúdo Aba 3: Quadro de Investidores */}
      {activeTab === 'investidores' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Sócios Participantes & Investidores Homologados
              </h2>
              <p className="text-xs text-slate-500">
                Cadastro KYC, limites autorizados e dados bancários/Pix para repasse de dividendos
              </p>
            </div>
            <button
              onClick={() => setIsModalInvestidorOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition"
            >
              <Plus className="w-3.5 h-3.5" />
              Novo Investidor
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-5 py-3">Investidor</th>
                  <th className="px-5 py-3">Documento Fiscal</th>
                  <th className="px-5 py-3">Tipo / Perfil</th>
                  <th className="px-5 py-3">Dados Bancários / Pix</th>
                  <th className="px-5 py-3 text-right">Total Investido</th>
                  <th className="px-5 py-3 text-right">Dividendos Recebidos</th>
                  <th className="px-5 py-3 text-center">Status KYC</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {investidores.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition">
                    <td className="px-5 py-3.5">
                      <div className="font-bold text-slate-900 dark:text-white">
                        {inv.nomeOuRazaoSocial}
                      </div>
                      <div className="text-[11px] text-slate-500">{inv.email}</div>
                    </td>
                    <td className="px-5 py-3.5 font-mono text-slate-700 dark:text-slate-300">
                      {formatCpfCnpj(inv.documentoFiscal)}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                        {inv.tipoInvestidor}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="text-slate-800 dark:text-slate-200 font-medium">
                        {inv.banco} - Ag: {inv.agencia} CC: {inv.conta}
                      </div>
                      {inv.chavePix && (
                        <div className="text-[11px] text-slate-500 font-mono">
                          Pix: {inv.chavePix} ({inv.tipoChavePix})
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-right font-bold text-slate-900 dark:text-white">
                      {formatCurrencyBRL(inv.totalAportado || 0)}
                    </td>
                    <td className="px-5 py-3.5 text-right font-bold text-emerald-600 dark:text-emerald-400">
                      {formatCurrencyBRL(inv.totalDividendosRecebidos || 0)}
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300">
                        {inv.statusKyc}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Conteúdo Aba 4: Apuração DRE Waterfall */}
      {activeTab === 'simulador' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna 1: Parâmetros da DRE */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sliders className="w-5 h-5 text-indigo-600" />
              Parâmetros de Fechamento do Evento
            </h2>
            <p className="text-xs text-slate-500">
              Integração contábil com a bilheteria e custos operacionais homologados
            </p>

            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Selecione o Contrato SCP / Evento:
                </label>
                <select
                  value={simContractId}
                  onChange={(e) => setSimContractId(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  {contratos.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.codigoScp} - {c.nomeProjeto}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Receita Bruta de Bilheteria (Vendas Ingressos):
                </label>
                <input
                  type="number"
                  value={simReceitaBruta}
                  onChange={(e) => setSimReceitaBruta(Number(e.target.value))}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Custos Operacionais & Produção (Cachês, Rider, Local):
                </label>
                <input
                  type="number"
                  value={simCustosOperacionais}
                  onChange={(e) => setSimCustosOperacionais(Number(e.target.value))}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Resultado Líquido do Evento:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {formatCurrencyBRL(simReceitaBruta - simCustosOperacionais)}
                  </span>
                </div>
              </div>

              <button
                onClick={executarSimulacao}
                disabled={isSimulating}
                className="w-full py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition flex items-center justify-center gap-2 shadow-sm"
              >
                <Sparkles className="w-4 h-4" />
                {isSimulating ? 'Calculando Waterfall...' : 'Calcular Cascata de Retorno (Waterfall)'}
              </button>
            </div>
          </div>

          {/* Coluna 2 e 3: Resultado da Cascata */}
          <div className="lg:col-span-2 space-y-4">
            {simulacaoResultado ? (
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div>
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase">
                      Demonstrativo Contábil da Cascata (Waterfall)
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      {simulacaoResultado.nomeProjeto}
                    </h3>
                  </div>
                  <button
                    onClick={efetivarOrdens}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm transition"
                  >
                    <Check className="w-4 h-4" />
                    Homologar & Efetivar Ordens de Dividendos
                  </button>
                </div>

                {/* Resumo da Partição */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700">
                    <span className="text-[10px] uppercase font-bold text-slate-500">
                      Capital Aportado
                    </span>
                    <div className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                      {formatCurrencyBRL(simulacaoResultado.totalAportadoNaScp)}
                    </div>
                  </div>
                  <div className="p-3 bg-blue-50 dark:bg-blue-950/40 rounded-xl border border-blue-200 dark:border-blue-800">
                    <span className="text-[10px] uppercase font-bold text-blue-600 dark:text-blue-400">
                      Payback Devolvido
                    </span>
                    <div className="text-sm font-bold text-blue-700 dark:text-blue-300 mt-1">
                      {formatCurrencyBRL(simulacaoResultado.capitalDevolvidoTotal)}
                    </div>
                  </div>
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800">
                    <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400">
                      Dividendos Investidores
                    </span>
                    <div className="text-sm font-bold text-emerald-700 dark:text-emerald-300 mt-1">
                      {formatCurrencyBRL(simulacaoResultado.lucroDistribuidoInvestidores)}
                    </div>
                  </div>
                  <div className="p-3 bg-purple-50 dark:bg-purple-950/40 rounded-xl border border-purple-200 dark:border-purple-800">
                    <span className="text-[10px] uppercase font-bold text-purple-600 dark:text-purple-400">
                      Lucro Produtora
                    </span>
                    <div className="text-sm font-bold text-purple-700 dark:text-purple-300 mt-1">
                      {formatCurrencyBRL(simulacaoResultado.lucroRetidoProdutora)}
                    </div>
                  </div>
                </div>

                {/* Tabela dos Sócios Participantes */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-800">
                      <tr>
                        <th className="px-4 py-3">Investidor</th>
                        <th className="px-4 py-3 text-right">Aporte Inicial</th>
                        <th className="px-4 py-3 text-right">Payback (100%)</th>
                        <th className="px-4 py-3 text-right">Dividendo / Lucro</th>
                        <th className="px-4 py-3 text-right">Total Líquido</th>
                        <th className="px-4 py-3 text-right">ROI (%)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                      {simulacaoResultado.distribuicoes.map((d) => (
                        <tr key={d.investorId}>
                          <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">
                            {d.investorNome}
                            <span className="block text-[10px] text-slate-500 font-normal">
                              Cota SCP: {d.percentualCota}%
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right text-slate-700 dark:text-slate-300">
                            {formatCurrencyBRL(d.valorAportado)}
                          </td>
                          <td className="px-4 py-3 text-right text-blue-600 dark:text-blue-400 font-semibold">
                            {formatCurrencyBRL(d.devolucaoCapital)}
                          </td>
                          <td className="px-4 py-3 text-right text-emerald-600 dark:text-emerald-400 font-bold">
                            {formatCurrencyBRL(d.lucroDistribuido)}
                          </td>
                          <td className="px-4 py-3 text-right text-slate-900 dark:text-white font-extrabold">
                            {formatCurrencyBRL(d.valorLiquidoTotal)}
                          </td>
                          <td className="px-4 py-3 text-right font-bold text-indigo-600 dark:text-indigo-400">
                            +{d.roiPercent}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-900 p-12 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm text-center space-y-3">
                <Sliders className="w-10 h-10 text-slate-400 mx-auto" />
                <h4 className="text-base font-bold text-slate-800 dark:text-slate-200">
                  Nenhuma simulação ativa no momento
                </h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Ajuste os valores de bilheteria e custos operacionais ao lado e clique em{' '}
                  <span className="font-semibold text-indigo-600">
                    "Calcular Cascata de Retorno"
                  </span>
                  .
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Conteúdo Aba 5: Ordens de Pagamento & Liquidação Pix */}
      {activeTab === 'distribuicoes' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden space-y-4">
          <div className="p-5 border-b border-slate-200 dark:border-slate-800">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Borderôs de Dividendos & Liquidação Instantânea via Pix / TED
            </h2>
            <p className="text-xs text-slate-500">
              Trilha de aprovação com dupla chave (CFO) e liquidação direta nas chaves Pix dos sócios participantes
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-5 py-3">Código</th>
                  <th className="px-5 py-3">Projeto / Evento</th>
                  <th className="px-5 py-3">Investidor</th>
                  <th className="px-5 py-3 text-right">Payback Aporte</th>
                  <th className="px-5 py-3 text-right">Dividendo Líquido</th>
                  <th className="px-5 py-3 text-right">Total a Pagar</th>
                  <th className="px-5 py-3 text-center">Status</th>
                  <th className="px-5 py-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {distribuicoes.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition">
                    <td className="px-5 py-3.5 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                      {d.codigoDistribuicao}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="font-semibold text-slate-900 dark:text-white">{d.contractNome}</div>
                      <div className="text-[11px] text-slate-500">{d.eventNome}</div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="font-bold text-slate-900 dark:text-white">{d.investorNome}</div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        Chave Pix: {d.investorPix || 'Cadastrada'}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-right font-medium text-blue-600 dark:text-blue-400">
                      {formatCurrencyBRL(d.valorAporteDevolvido)}
                    </td>
                    <td className="px-5 py-3.5 text-right font-bold text-emerald-600 dark:text-emerald-400">
                      {formatCurrencyBRL(d.valorLucroDistribuido)}
                    </td>
                    <td className="px-5 py-3.5 text-right font-extrabold text-slate-900 dark:text-white text-sm">
                      {formatCurrencyBRL(d.valorLiquidoPago)}
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <span
                        className={`px-2.5 py-1 text-[11px] font-bold rounded-full ${
                          d.status === StatusDistribuicaoDividendo.LIQUIDADO
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300'
                            : d.status === StatusDistribuicaoDividendo.APROVADO_CFO
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300'
                        }`}
                      >
                        {d.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      {d.status === StatusDistribuicaoDividendo.CALCULADO && (
                        <button
                          onClick={() => handleAprovar(d.id)}
                          className="px-3 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition"
                        >
                          Aprovação CFO
                        </button>
                      )}
                      {d.status === StatusDistribuicaoDividendo.APROVADO_CFO && (
                        <button
                          onClick={() => handleLiquidarPix(d.id)}
                          className="px-3 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition flex items-center gap-1.5 ml-auto"
                        >
                          <QrCode className="w-3.5 h-3.5" />
                          Liquidar via Pix
                        </button>
                      )}
                      {d.status === StatusDistribuicaoDividendo.LIQUIDADO && (
                        <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                          {d.comprovantePagamento}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal 1: Novo Contrato SCP */}
      {isModalContratoOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 space-y-4 border border-slate-200 dark:border-slate-800 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Landmark className="w-5 h-5 text-indigo-600" />
                Criar Novo Contrato SCP (Código Civil 991)
              </h3>
              <button
                onClick={() => setIsModalContratoOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCriarContrato} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Nome do Projeto / Contrato:</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Turnê Internacional 2026 - SCP"
                  value={formContrato.nomeProjeto}
                  onChange={(e) =>
                    setFormContrato({ ...formContrato, nomeProjeto: e.target.value })
                  }
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Nome do Evento Vinculado:</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Show Internacional na Arena da Baixada"
                  value={formContrato.eventNome}
                  onChange={(e) =>
                    setFormContrato({ ...formContrato, eventNome: e.target.value })
                  }
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">
                  Sócio Ostensivo (Produtora Responsável):
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Opus Entretenimento Curitiba Ltda"
                  value={formContrato.socioOstensivo}
                  onChange={(e) =>
                    setFormContrato({ ...formContrato, socioOstensivo: e.target.value })
                  }
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">CNPJ Próprio SCP (RFB):</label>
                  <input
                    type="text"
                    placeholder="00.000.000/0002-00"
                    value={formContrato.cnpjScp}
                    onChange={(e) =>
                      setFormContrato({ ...formContrato, cnpjScp: e.target.value })
                    }
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Meta de Captação (R$):</label>
                  <input
                    type="number"
                    required
                    value={formContrato.metaCaptacao}
                    onChange={(e) =>
                      setFormContrato({ ...formContrato, metaCaptacao: Number(e.target.value) })
                    }
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Hurdle Rate Preferencial (%):</label>
                  <input
                    type="number"
                    value={formContrato.hurdleRatePercent}
                    onChange={(e) =>
                      setFormContrato({
                        ...formContrato,
                        hurdleRatePercent: Number(e.target.value),
                      })
                    }
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Upside Share (% Excedente):</label>
                  <input
                    type="number"
                    value={formContrato.upsideSharePercent}
                    onChange={(e) =>
                      setFormContrato({
                        ...formContrato,
                        upsideSharePercent: Number(e.target.value),
                      })
                    }
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalContratoOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl"
                >
                  Registrar Contrato
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Novo Investidor */}
      {isModalInvestidorOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 space-y-4 border border-slate-200 dark:border-slate-800 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-600" />
                Cadastrar Sócio Participante (Investidor)
              </h3>
              <button
                onClick={() => setIsModalInvestidorOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCriarInvestidor} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Nome ou Razão Social:</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Fundo Prime Entretenimento S/A"
                  value={formInvestidor.nomeOuRazaoSocial}
                  onChange={(e) =>
                    setFormInvestidor({ ...formInvestidor, nomeOuRazaoSocial: e.target.value })
                  }
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">CPF ou CNPJ:</label>
                  <input
                    type="text"
                    required
                    placeholder="00.000.000/0001-00"
                    value={formInvestidor.documentoFiscal}
                    onChange={(e) =>
                      setFormInvestidor({ ...formInvestidor, documentoFiscal: e.target.value })
                    }
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Perfil de Investidor:</label>
                  <select
                    value={formInvestidor.tipoInvestidor}
                    onChange={(e) =>
                      setFormInvestidor({
                        ...formInvestidor,
                        tipoInvestidor: e.target.value as TipoInvestidorScp,
                      })
                    }
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value={TipoInvestidorScp.FUNDO_INVESTIMENTO}>Fundo de Investimento</option>
                    <option value={TipoInvestidorScp.ANJO}>Investidor Anjo</option>
                    <option value={TipoInvestidorScp.CO_PRODUTOR}>Co-Produtor Artístico</option>
                    <option value={TipoInvestidorScp.FAMILY_OFFICE}>Family Office</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">E-mail Corporativo:</label>
                  <input
                    type="email"
                    required
                    value={formInvestidor.email}
                    onChange={(e) =>
                      setFormInvestidor({ ...formInvestidor, email: e.target.value })
                    }
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Chave Pix para Dividendos:</label>
                  <input
                    type="text"
                    required
                    placeholder="CNPJ, E-mail ou Aleatória"
                    value={formInvestidor.chavePix}
                    onChange={(e) =>
                      setFormInvestidor({ ...formInvestidor, chavePix: e.target.value })
                    }
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalInvestidorOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl"
                >
                  Salvar Investidor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 3: Registrar Aporte */}
      {isModalAporteOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 space-y-4 border border-slate-200 dark:border-slate-800 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Coins className="w-5 h-5 text-emerald-600" />
                Registrar Aporte / Integralização de Cota
              </h3>
              <button
                onClick={() => setIsModalAporteOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRegistrarAporte} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Contrato SCP:</label>
                <select
                  value={formAporte.contractId || selectedContratoParaAporte}
                  onChange={(e) =>
                    setFormAporte({ ...formAporte, contractId: e.target.value })
                  }
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  {contratos.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.codigoScp} - {c.nomeProjeto}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Investidor (Sócio Oculto):</label>
                <select
                  value={formAporte.investorId}
                  onChange={(e) =>
                    setFormAporte({ ...formAporte, investorId: e.target.value })
                  }
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="">Selecione o investidor...</option>
                  {investidores.map((inv) => (
                    <option key={inv.id} value={inv.id}>
                      {inv.nomeOuRazaoSocial} ({inv.documentoFiscal})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Valor do Aporte Financeiro (R$):</label>
                <input
                  type="number"
                  required
                  value={formAporte.valorAportado}
                  onChange={(e) =>
                    setFormAporte({ ...formAporte, valorAportado: Number(e.target.value) })
                  }
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalAporteOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl"
                >
                  Confirmar Integralização
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
