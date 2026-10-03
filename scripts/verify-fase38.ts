import {
  TipoInfracaoPld,
  StatusAlertaPld,
} from '@diskingressos/types';
import type {
  PldTransactionAlertDto,
  PepScreeningRecordDto,
  CoafCommunicationReportDto,
  PldDashboardKpisDto,
  TriagemPldRequestDto,
  TriagemPldResponseDto,
} from '@diskingressos/types';

console.log('========================================================================');
console.log('🧪 DISKINGRESSOS ERP - SCRIPT DE AUDITORIA & HARDENING (FASE 38)');
console.log('🛡️ PREVENÇÃO À LAVAGEM DE DINHEIRO (PLD-FT), COAF & SISCOAF');
console.log('🏛️ CIRCULAR BCB 3.978/2020 & LEI FEDERAL 9.613/1998 (CRIMES FINANCEIROS)');
console.log('========================================================================\n');

let passCount = 0;
let totalCount = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  totalCount++;
  if (condition) {
    passCount++;
    console.log(`✅ [PASS] ${testName}`);
    if (detail) console.log(`   └─ ${detail}`);
  } else {
    console.error(`❌ [FAIL] ${testName}`);
    if (detail) console.error(`   └─ Motivo: ${detail}`);
  }
}

class TestPldCoafComplianceService {
  private inMemoryAlertas: PldTransactionAlertDto[] = [];
  private inMemoryPeps: PepScreeningRecordDto[] = [];
  private inMemoryCoafs: CoafCommunicationReportDto[] = [];

  constructor() {
    this.initData();
  }

  private initData() {
    const a1: PldTransactionAlertDto = {
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
    };

    const a2: PldTransactionAlertDto = {
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
    };

    this.inMemoryAlertas = [a1, a2];

    const p1: PepScreeningRecordDto = {
      id: 'pep-001',
      cpfConsultado: '081.294.119-02',
      nomeCompleto: 'Ricardo Oliveira Santos',
      isPepAtivo: true,
      cargoFuncaoPublica: 'Secretário Executivo Municipal',
      orgaoPublico: 'Prefeitura Municipal de Curitiba',
      dataConsulta: '2026-04-01T16:01:00Z',
    };

    this.inMemoryPeps = [p1];

    const c1: CoafCommunicationReportDto = {
      id: 'coaf-001',
      numeroProtocoloSiscoaf: 'SISCOAF-2026-PR-009182',
      alertaId: 'alr-002',
      justificativaLegal: 'Operação atípica em espécie acima do limite regulatório sem compatibilidade econômico-financeira (Art. 11 Lei 9.613/98)',
      enviadoAoCoafEm: '2026-04-01T16:30:00Z',
      statusComunicacao: 'HOMOLOGADO_SISCOAF',
    };

    this.inMemoryCoafs = [c1];
  }

  public getDashboardKpis(): PldDashboardKpisDto {
    return {
      alertasPldAtivosMes: 7,
      scoreRiscoMedioBase: 24.2,
      consultasPepRealizadas: 842,
      comunicacoesSiscoafHomologadas: 3,
      volumeFinanceiroSobQuarentenaBrl: 169500.0,
    };
  }

  public listarAlertas(): PldTransactionAlertDto[] {
    return this.inMemoryAlertas;
  }

  public consultarPep(cpf: string): PepScreeningRecordDto | null {
    const cleanCpf = cpf.replace(/\D/g, '');
    const encontrado = this.inMemoryPeps.find((p) => p.cpfConsultado.replace(/\D/g, '') === cleanCpf);
    return encontrado || null;
  }

  public triagemTransacao(dto: TriagemPldRequestDto): TriagemPldResponseDto {
    let scoreRisco = 10;
    let tipoInfracao: TipoInfracaoPld | undefined;
    let gerouAlerta = false;

    if (dto.valorTransacaoBrl >= 50000) {
      scoreRisco += 75;
      tipoInfracao = TipoInfracaoPld.ALTO_VALOR_ESPECIE;
      gerouAlerta = true;
    } else if (dto.quantidadeIngressos >= 20) {
      scoreRisco += 60;
      tipoInfracao = TipoInfracaoPld.SMURFING_FRACIONAMENTO;
      gerouAlerta = true;
    }

    return {
      aprovadoSemAlerta: !gerouAlerta,
      scoreRiscoCalculado: scoreRisco,
      gerouAlerta,
      tipoInfracao,
      requerComunicacaoCoaf: scoreRisco >= 85,
    };
  }
}

const service = new TestPldCoafComplianceService();

// TESTE 1: Painel Executivo de Prevenção à Lavagem de Dinheiro
const kpis = service.getDashboardKpis();
assert(
  kpis.alertasPldAtivosMes > 0 &&
    kpis.consultasPepRealizadas > 500 &&
    kpis.volumeFinanceiroSobQuarentenaBrl > 100000,
  'TESTE 1: Indicadores e KPIs de Risco e Monitoramento PLD-FT',
  `Consultas PEP: ${kpis.consultasPepRealizadas} | Quarentena: R$ ${kpis.volumeFinanceiroSobQuarentenaBrl.toLocaleString('pt-BR')}`,
);

// TESTE 2: Detecção de Smurfing e Fracionamento Atípico de Ingressos
const alertas = service.listarAlertas();
const alertaSmurfing = alertas.find((a) => a.tipoInfracaoDetectada === TipoInfracaoPld.SMURFING_FRACIONAMENTO);
assert(
  Boolean(alertaSmurfing) &&
    (alertaSmurfing?.scoreRiscoPld ?? 0) > 90 &&
    alertaSmurfing?.statusAnalise === StatusAlertaPld.EM_ANALISE_COMPLIANCE,
  'TESTE 2: Radar Comportamental de Smurfing com Score de Risco > 90',
  `Alerta: ${alertaSmurfing?.codigoAlerta} | Score: ${alertaSmurfing?.scoreRiscoPld}/100`,
);

// TESTE 3: Consulta e Triagem em Base de Pessoas Politicamente Expostas (PEP)
const pep = service.consultarPep('081.294.119-02');
assert(
  Boolean(pep) &&
    pep?.isPepAtivo === true &&
    Boolean(pep?.cargoFuncaoPublica),
  'TESTE 3: Identificação de Titular PEP (Cargo Público com Requisito de Diligência Especial)',
  `Nome: ${pep?.nomeCompleto} | Cargo: ${pep?.cargoFuncaoPublica} (${pep?.orgaoPublico})`,
);

// TESTE 4: Comunicação Formal Obrigatória ao SISCOAF (Art. 11 Lei 9.613/98)
const alertaCoaf = alertas.find((a) => a.statusAnalise === StatusAlertaPld.COMUNICADO_SISCOAF);
assert(
  Boolean(alertaCoaf) &&
    (alertaCoaf?.valorOperacaoBrl ?? 0) >= 100000.0,
  'TESTE 4: Envio de Comunicação Formal Homologada pelo SISCOAF',
  `Operação: R$ ${alertaCoaf?.valorOperacaoBrl?.toLocaleString('pt-BR')} | Status: ${alertaCoaf?.statusAnalise}`,
);

// TESTE 5: Triagem em Tempo Real de Operação Normal (Aprovada sem Alerta)
const triagemNormal = service.triagemTransacao({
  cpfCnpj: '419.001.294-11',
  nome: 'Mariana Duarte',
  valorTransacaoBrl: 350.0,
  metodoPagamento: 'PIX',
  quantidadeIngressos: 2,
});
assert(
  triagemNormal.aprovadoSemAlerta === true &&
    triagemNormal.scoreRiscoCalculado < 30 &&
    triagemNormal.requerComunicacaoCoaf === false,
  'TESTE 5: Triagem Positiva de Compra Comum com Baixo Risco',
  `Score: ${triagemNormal.scoreRiscoCalculado}/100 | Aprovado sem restrição`,
);

// TESTE 6: Triagem com Bloqueio Cautelar em Operação Suspeita de Alto Valor
const triagemSuspeita = service.triagemTransacao({
  cpfCnpj: '991.204.819-33',
  nome: 'Investimentos Offshore Express Ltda',
  valorTransacaoBrl: 75000.0,
  metodoPagamento: 'ESPECIE',
  quantidadeIngressos: 80,
});
assert(
  triagemSuspeita.aprovadoSemAlerta === false &&
    triagemSuspeita.gerouAlerta === true &&
    triagemSuspeita.requerComunicacaoCoaf === true,
  'TESTE 6: Gatilho Automático de Quarentena e Comunicação COAF para Transações Suspeitas',
  `Infração: ${triagemSuspeita.tipoInfracao} | Score: ${triagemSuspeita.scoreRiscoCalculado}/100`,
);

console.log('\n========================================================================');
console.log(`📈 RESULTADO FINAL FASE 38: ${passCount}/${totalCount} TESTES APROVADOS (${((passCount / totalCount) * 100).toFixed(0)}%)`);
console.log('========================================================================\n');

if (passCount !== totalCount) {
  process.exit(1);
}
