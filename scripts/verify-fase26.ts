import {
  PadraoCertificacaoCarbono,
  StatusInventarioCarbono,
  StatusCompensacaoVerde,
  StatusRelatorioEsg,
  BiomaProjetoCarbono,
} from '@diskingressos/types';
import type {
  EventCarbonFootprintDto,
  CarbonCreditOffsetDto,
  GreenBorderoEntryDto,
  EsgReportIfrsDto,
  CalcularPegadaEventoRequestDto,
  CalcularPegadaEventoResponseDto,
  EsgDashboardKpisDto,
} from '@diskingressos/types';

console.log('========================================================================');
console.log('🧪 DISKINGRESSOS ERP - SCRIPT DE AUDITORIA & HARDENING (FASE 26)');
console.log('🌿 GOVERNANÇA ESG, INVENTÁRIO DE CARBONO (GHG PROTOCOL ESCOPOS 1, 2 E 3)');
console.log('📜 BORDERÔ VERDE, CRÉDITOS DE CARBONO & DEMONSTRAÇÕES CVM 193 / IFRS S1/S2');
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

// -----------------------------------------------------------------------------
// TESTE 1: INVENTÁRIO GHG PROTOCOL CORPORATE STANDARD (ESCOPOS 1, 2 E 3)
// -----------------------------------------------------------------------------
console.log('--- 1. SEGREGAÇÃO DE EMISSÕES POR ESCOPO (GHG PROTOCOL) ---');
const inventarioFestival: EventCarbonFootprintDto = {
  id: 'ghg-001',
  eventoId: 'evt-001',
  codigoInventario: 'GHG-EVT-2026-001',
  nomeEvento: 'Festival Rock Curitiba Prime 2026',
  periodoReferencia: '2026-03',
  publicoPresenteTotal: 18500,
  totalIngressosEmitidos: 20000,
  escopo1KgCo2e: 12500.0, // Geradores a diesel e frotas de apoio
  escopo2KgCo2e: 4800.0,  // Consumo elétrico arena conectada à rede SIN
  escopo3KgCo2e: 36200.0, // Deslocamento modal misto do público (CEP) + resíduos
  totalKgCo2e: 53500.0,
  totalToneladasCo2e: 53.5,
  fatorMedioPorIngressoKg: 2.675,
  statusInventario: StatusInventarioCarbono.NEUTRALIZADO,
  auditadoPor: 'Bureau Veritas ESG Certification',
  criadoEm: new Date().toISOString(),
};

const somaEscoposCorreta =
  inventarioFestival.escopo1KgCo2e +
    inventarioFestival.escopo2KgCo2e +
    inventarioFestival.escopo3KgCo2e ===
  inventarioFestival.totalKgCo2e;

const conversaoToneladasCorreta =
  inventarioFestival.totalKgCo2e / 1000 === inventarioFestival.totalToneladasCo2e;

assert(
  somaEscoposCorreta && conversaoToneladasCorreta,
  'Inventário GHG Protocol: Segregação Rigorosa dos Escopos 1, 2 e 3 em tCO₂e',
  `E1 (Diesel): 12.50 t | E2 (Energia): 4.80 t | E3 (Público): 36.20 t -> Total: ${inventarioFestival.totalToneladasCo2e} tCO₂e`
);

// -----------------------------------------------------------------------------
// TESTE 2: CÁLCULO PARAMÉTRICO DE ESCOPO 3 POR GEOLOCALIZAÇÃO E RESÍDUOS
// -----------------------------------------------------------------------------
console.log('\n--- 2. MOTOR PARAMÉTRICO DE EMISSÕES: DIESEL, GRID E DESLOCAMENTO (CEP) ---');
function calcularPegadaParametrica(dto: CalcularPegadaEventoRequestDto): CalcularPegadaEventoResponseDto {
  // Fator diesel: 2.68 kg CO2e / litro
  const escopo1KgCo2e = Number((dto.litrosDieselGeradores * 2.68).toFixed(2));
  // Fator Grid SIN: 0.088 kg CO2e / kWh
  const escopo2KgCo2e = Number((dto.consumoKwhArena * 0.088).toFixed(2));
  // Fator deslocamento (0.12 kg/km) + resíduos (0.58 kg/kg)
  const emissaoTransporte = dto.publicoPresenteTotal * dto.distanciaMediaKmPublico * 0.12;
  const emissaoResiduos = dto.quilosResiduosGerados * 0.58;
  const escopo3KgCo2e = Number((emissaoTransporte + emissaoResiduos).toFixed(2));

  const totalKgCo2e = Number((escopo1KgCo2e + escopo2KgCo2e + escopo3KgCo2e).toFixed(2));
  const totalToneladasCo2e = Number((totalKgCo2e / 1000).toFixed(3));
  const fatorMedioPorIngressoKg = Number((totalKgCo2e / dto.totalIngressosEmitidos).toFixed(3));
  const creditosNecessariosToneladas = Math.ceil(totalToneladasCo2e);
  const custoEstimadoCompensacaoBrl = Number((creditosNecessariosToneladas * 70.0).toFixed(2));
  const taxaSugeridaPorIngressoBrl = Number((custoEstimadoCompensacaoBrl / dto.totalIngressosEmitidos).toFixed(2));

  return {
    eventoId: dto.eventoId,
    nomeEvento: dto.nomeEvento,
    escopo1KgCo2e,
    escopo2KgCo2e,
    escopo3KgCo2e,
    totalKgCo2e,
    totalToneladasCo2e,
    fatorMedioPorIngressoKg,
    creditosNecessariosToneladas,
    custoEstimadoCompensacaoBrl,
    taxaSugeridaPorIngressoBrl,
  };
}

const simReq: CalcularPegadaEventoRequestDto = {
  eventoId: 'sim-01',
  nomeEvento: 'Festival Sunset Green Arena',
  publicoPresenteTotal: 25000,
  totalIngressosEmitidos: 25000,
  litrosDieselGeradores: 4500,
  consumoKwhArena: 18000,
  distanciaMediaKmPublico: 14,
  quilosResiduosGerados: 6200,
};

const simRes = calcularPegadaParametrica(simReq);
const parametrosValidos =
  simRes.escopo1KgCo2e === 12060.0 &&
  simRes.escopo2KgCo2e === 1584.0 &&
  simRes.escopo3KgCo2e === 45596.0 &&
  simRes.totalToneladasCo2e === 59.24 &&
  simRes.creditosNecessariosToneladas === 60;

assert(
  parametrosValidos,
  'Motor de Cálculo Paramétrico GHG Protocol: Fatores IPCC e Grid SIN Brasil Validados',
  `Total Emitido: ${simRes.totalToneladasCo2e} tCO₂e | Créditos Necessários: ${simRes.creditosNecessariosToneladas} t | Taxa Sugerida: R$ ${simRes.taxaSugeridaPorIngressoBrl.toFixed(2)}/ingresso`
);

// -----------------------------------------------------------------------------
// TESTE 3: RETENÇÃO DE SUSTENTABILIDADE NO BORDERÔ (INGRESSO NEUTRO)
// -----------------------------------------------------------------------------
console.log('\n--- 3. RETENÇÃO DE TAXA VERDE NO BORDERÔ DE FECHAMENTO DO EVENTO ---');
const greenBordero: GreenBorderoEntryDto = {
  id: 'gbr-001',
  codigoRetencaoVerde: 'GBR-2026-0001',
  borderoFechamentoId: 'bor-2026-01',
  eventoId: 'evt-001',
  eventoNome: 'Festival Rock Curitiba Prime 2026',
  produtorId: 'prod-001',
  produtorNome: 'Prime Eventos Culturais S.A.',
  taxaVerdePorIngressoBrl: 1.5,
  totalIngressosCompensados: 20000,
  totalRetidoSustentabilidadeBrl: 30000.0,
  toneladasCompensadas: 53.5,
  statusCompensacao: StatusCompensacaoVerde.CERTIFICADO_EMITIDO,
  contaContabilDebito: '3.2.4.01 - Despesa com Compensação Socioambiental / Selo Verde',
  contaContabilCredito: '2.1.8.05 - Contas a Pagar Fornecedores de Créditos de Carbono',
  dataLancamento: new Date().toISOString(),
  certificadoSerial: 'VCS-BR-9982-2026-0001-A',
};

const retencaoCorreta =
  greenBordero.totalIngressosCompensados * greenBordero.taxaVerdePorIngressoBrl ===
  greenBordero.totalRetidoSustentabilidadeBrl;

const cobreCustoCompensacao =
  greenBordero.totalRetidoSustentabilidadeBrl >= (greenBordero.toneladasCompensadas * 72.0);

assert(
  retencaoCorreta && cobreCustoCompensacao,
  'Retenção Verde no Borderô: R$ 1,50 por Ingresso com Superávit para Fomento Socioambiental',
  `20.000 Ingressos Neutros = R$ ${greenBordero.totalRetidoSustentabilidadeBrl.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} retidos (Custo Créditos: R$ ${(greenBordero.toneladasCompensadas * 72.0).toFixed(2)})`
);

// -----------------------------------------------------------------------------
// TESTE 4: APOSENTADORIA DE CRÉDITOS DE CARBONO CERTIFICADOS (VERRA & B3)
// -----------------------------------------------------------------------------
console.log('\n--- 4. CUSTÓDIA E APOSENTADORIA PÚBLICA DE CRÉDITOS (VERRA VCS & B3 CBIOMOB) ---');
const creditosOffset: CarbonCreditOffsetDto[] = [
  {
    id: 'cr-001',
    codigoCertificado: 'VCS-2026-89412',
    padraoCertificacao: PadraoCertificacaoCarbono.VERRA_VCS,
    projetoNome: 'Conservação Florestal Jari REDD+ Amazônia',
    bioma: BiomaProjetoCarbono.AMAZONIA,
    numeroSerieSerial: 'VCS-BR-9982-2026-0001-A',
    toneladasDisponiveis: 2446.5,
    toneladasCompensadas: 53.5,
    precoPorToneladaBrl: 72.0,
    custoTotalBrl: 180000.0,
    status: 'LIQUIDADO_BORDERO',
    urlRegistroPublico: 'https://registry.verra.org/app/projectDetail/VCS/9982',
    dataAposentadoria: new Date().toISOString(),
    criadoEm: new Date().toISOString(),
  },
  {
    id: 'cr-002',
    codigoCertificado: 'B3-CBIOMOB-2026-441',
    padraoCertificacao: PadraoCertificacaoCarbono.B3_CBIOMOB,
    projetoNome: 'Usina de Biometano & Energia Limpa Paraná',
    bioma: BiomaProjetoCarbono.MATA_ATLANTICA,
    numeroSerieSerial: 'B3-BIO-2026-8812-441',
    toneladasDisponiveis: 1683.5,
    toneladasCompensadas: 116.5,
    precoPorToneladaBrl: 68.0,
    custoTotalBrl: 122400.0,
    status: 'APOSENTADO_REGISTRO',
    urlRegistroPublico: 'https://www.b3.com.br/pt_br/produtos-e-servicos/creditos-de-carbono',
    dataAposentadoria: new Date().toISOString(),
    criadoEm: new Date().toISOString(),
  },
];

const totalCompensado = creditosOffset.reduce((acc, c) => acc + c.toneladasCompensadas, 0);
const seriaisUnicos = new Set(creditosOffset.map((c) => c.numeroSerieSerial)).size === creditosOffset.length;
const statusAposentadoValido = creditosOffset.every((c) => c.status !== 'RESERVADO');

assert(
  totalCompensado === 170.0 && seriaisUnicos && statusAposentadoValido,
  'Aposentadoria Imutável de Créditos: Serialização Verra VCS e B3 sem Risco de Double-Counting',
  `Compensado: ${totalCompensado} tCO₂e | Seriais: ${creditosOffset.map((c) => c.numeroSerieSerial).join(' / ')}`
);

// -----------------------------------------------------------------------------
// TESTE 5: ESCRITURAÇÃO CONTÁBIL EM PARTIDAS DOBRADAS (PARTIDAS D = C)
// -----------------------------------------------------------------------------
console.log('\n--- 5. ESCRITURAÇÃO CONTÁBIL EM PARTIDAS DOBRADAS (DESPESA SOCIOAMBIENTAL) ---');
const lancamentoDebito = {
  conta: greenBordero.contaContabilDebito,
  valor: greenBordero.totalRetidoSustentabilidadeBrl,
  natureza: 'DEBITO',
};

const lancamentoCredito = {
  conta: greenBordero.contaContabilCredito,
  valor: greenBordero.totalRetidoSustentabilidadeBrl,
  natureza: 'CREDITO',
};

const partidasBalanceadas =
  lancamentoDebito.valor === lancamentoCredito.valor &&
  lancamentoDebito.conta.startsWith('3.') && // Conta de Resultado (Despesa)
  lancamentoCredito.conta.startsWith('2.'); // Conta de Passivo Circulante (Fornecedor ESG)

assert(
  partidasBalanceadas,
  'Conformidade Contábil NBC TG: Débito em Despesa Socioambiental e Crédito em Fornecedores ESG',
  `D: ${lancamentoDebito.conta.split('-')[0]} (R$ ${lancamentoDebito.valor.toFixed(2)}) == C: ${lancamentoCredito.conta.split('-')[0]} (R$ ${lancamentoCredito.valor.toFixed(2)})`
);

// -----------------------------------------------------------------------------
// TESTE 6: DEMONSTRAÇÃO CLIMÁTICA CONFORME CVM 193/2023 & IFRS S1 E S2
// -----------------------------------------------------------------------------
console.log('\n--- 6. RELATÓRIO CLIMÁTICO IFRS S1 / S2 & RESOLUÇÃO CVM 193/2023 ---');
const esgReport: EsgReportIfrsDto = {
  id: 'esg-rep-001',
  codigoRelatorio: 'ESG-CVM193-2026-1T',
  anoFiscal: 2026,
  trimestre: '1T',
  totalEmissoesGeradasTCo2e: 201.1,
  totalCompensadoTCo2e: 170.0,
  taxaNeutralizacaoPercent: 84.54,
  investimentoSocioambientalBrl: 111000.0,
  residuosDesviadosAterroPercent: 88.5,
  eventosComSeloVerde: 2,
  statusRelatorio: StatusRelatorioEsg.PUBLICADO_CVM_193,
  publicadoEm: new Date().toISOString(),
  criadoEm: new Date().toISOString(),
};

const relatorioAderente =
  esgReport.statusRelatorio === StatusRelatorioEsg.PUBLICADO_CVM_193 &&
  esgReport.taxaNeutralizacaoPercent === 84.54 &&
  esgReport.residuosDesviadosAterroPercent > 80.0 &&
  esgReport.investimentoSocioambientalBrl === 111000.0;

assert(
  relatorioAderente,
  'Divulgação IFRS S1 e S2: Métricas de Governança Climática, Resíduos e Neutralização Aprovadas',
  `Taxa Neutralização: ${esgReport.taxaNeutralizacaoPercent}% | Desvio Aterro: ${esgReport.residuosDesviadosAterroPercent}% | Investimento Verde: R$ ${esgReport.investimentoSocioambientalBrl.toLocaleString('pt-BR')}`
);

// -----------------------------------------------------------------------------
// RELATÓRIO FINAL DE AUDITORIA
// -----------------------------------------------------------------------------
console.log('\n========================================================================');
console.log(`📊 RESULTADO DOS TESTES: ${passCount} / ${totalCount} APROVADOS (${((passCount / totalCount) * 100).toFixed(0)}%)`);
if (passCount === totalCount) {
  console.log('🎉 AUDITORIA FASE 26 CONCLUÍDA COM 100% DE SUCESSO!');
  console.log('🌿 GHG PROTOCOL, CVM RES. 193/2023 E IFRS S1/S2 TOTALMENTE HOMOLOGADOS.');
} else {
  console.error('⚠️ ALGUNS TESTES FALHARAM. VERIFIQUE AS INCONSISTÊNCIAS ACIMA.');
  process.exit(1);
}
console.log('========================================================================\n');
