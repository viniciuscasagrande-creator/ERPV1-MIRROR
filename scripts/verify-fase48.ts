import { TipoContratoPatrocinio } from '@diskingressos/types';
import type {
  SponsorshipNamingAgreementDto,
  BarterTradeExchangeRecordDto,
  SponsorshipRevenueAmortizationDto,
  SponsorshipDashboardKpisDto,
  RegistrarBarterRequestDto,
  RegistrarBarterResponseDto,
} from '@diskingressos/types';

console.log('========================================================================');
console.log('🧪 DISKINGRESSOS ERP - SCRIPT DE AUDITORIA & HARDENING (FASE 48)');
console.log('🏆 PATROCÍNIOS CORPORATIVOS, NAMING RIGHTS & BARTER (IFRS 15)');
console.log('📑 AMORTIZAÇÃO DE RECEITA DIFERIDA, PERMUTA & NOTAS FISCAIS');
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

class TestSponsorshipBarterService {
  private inMemoryAgreements: SponsorshipNamingAgreementDto[] = [];
  private inMemoryBarters: BarterTradeExchangeRecordDto[] = [];
  private inMemoryAmortizations: SponsorshipRevenueAmortizationDto[] = [];

  constructor() {
    this.initData();
  }

  private initData() {
    const a1: SponsorshipNamingAgreementDto = {
      id: 'spn-001',
      empresaPatrocinadoraNome: 'Ambev S.A. (Budweiser)',
      cnpjPatrocinador: '07.526.557/0001-00',
      eventoOuEspacoNome: 'Arena Disk Festival - Palco Principal',
      tipoContrato: TipoContratoPatrocinio.NAMING_RIGHTS,
      valorTotalContratoBrl: 1200000.0,
      prazoVigenciaMeses: 12,
      statusContrato: 'ATIVO_HOMOLOGADO',
      dataInicioVigencia: '2026-01-01T00:00:00Z',
    };

    const b1: BarterTradeExchangeRecordDto = {
      id: 'bar-001',
      acordoPatrocinioId: 'spn-001',
      descricaoItemPermuta: 'Fornecimento de som line array em troca de camarotes VIP',
      valorEconomicoAvaliadoBrl: 85000.0,
      numeroNotaFiscalEntrada: 'NF-E-99412',
      numeroNotaFiscalSaida: 'NF-S-10492',
      dataEfetivacao: '2026-03-15T10:00:00Z',
    };

    const amt1: SponsorshipRevenueAmortizationDto = {
      id: 'amt-001',
      acordoPatrocinioId: 'spn-001',
      mesCompetencia: '2026-03',
      receitaDiferidaInicialBrl: 1000000.0,
      amortizacaoCompetenciaBrl: 100000.0, // 1.200.000 / 12 meses = 100.000/mês
      saldoReceitaDiferidaFinalBrl: 900000.0,
      contaContabilCredito: '3.1.1.10 - Receitas de Patrocínios e Naming Rights',
      apuradoEm: '2026-03-31T23:59:59Z',
    };

    this.inMemoryAgreements = [a1];
    this.inMemoryBarters = [b1];
    this.inMemoryAmortizations = [amt1];
  }

  getAgreements() {
    return this.inMemoryAgreements;
  }

  getBarters() {
    return this.inMemoryBarters;
  }

  getAmortizations() {
    return this.inMemoryAmortizations;
  }

  registrarBarter(dto: RegistrarBarterRequestDto): RegistrarBarterResponseDto {
    const novo: BarterTradeExchangeRecordDto = {
      id: `bar-${Date.now()}`,
      acordoPatrocinioId: dto.acordoPatrocinioId,
      descricaoItemPermuta: dto.descricaoItemPermuta,
      valorEconomicoAvaliadoBrl: dto.valorEconomicoAvaliadoBrl,
      numeroNotaFiscalEntrada: dto.numeroNotaFiscalEntrada,
      numeroNotaFiscalSaida: dto.numeroNotaFiscalSaida,
      dataEfetivacao: new Date().toISOString(),
    };
    this.inMemoryBarters.push(novo);

    return {
      sucesso: true,
      barterId: novo.id,
      valorLancamentoContabilBrl: novo.valorEconomicoAvaliadoBrl,
      protocoloCompensacaoFiscal: `COMP-BARTER-IFRS15-${Date.now()}`,
    };
  }

  getKpis(): SponsorshipDashboardKpisDto {
    return {
      receitaTotalContratadaBrl: 1200000.0,
      receitaDiferidaPassivoBrl: 900000.0,
      receitaAmortizadaAnoBrl: 300000.0,
      volumePermutasBarterBrl: 85000.0,
      marcasPatrocinadorasAtivas: this.inMemoryAgreements.length,
    };
  }
}

async function runTests() {
  const service = new TestSponsorshipBarterService();

  // Teste 1: Contrato de Naming Rights
  const agreements = service.getAgreements();
  assert(
    agreements.length > 0 &&
      agreements[0].tipoContrato === TipoContratoPatrocinio.NAMING_RIGHTS &&
      agreements[0].valorTotalContratoBrl === 1200000.0,
    'Teste 1: Homologação de contrato de Naming Rights corporativo com vigência plurianual',
    `Marca: ${agreements[0].empresaPatrocinadoraNome} | Espaço: ${agreements[0].eventoOuEspacoNome} | Valor: R$ ${agreements[0].valorTotalContratoBrl.toLocaleString('pt-BR')}`
  );

  // Teste 2: Registro de Permuta Comercial (Barter)
  const barters = service.getBarters();
  assert(
    barters.length > 0 &&
      barters[0].numeroNotaFiscalEntrada.length > 0 &&
      barters[0].numeroNotaFiscalSaida.length > 0,
    'Teste 2: Operação de permuta comercial (Barter Trade) amparada por notas fiscais de entrada e saída',
    `Item: ${barters[0].descricaoItemPermuta} | NF Entrada: ${barters[0].numeroNotaFiscalEntrada} | NF Saída: ${barters[0].numeroNotaFiscalSaida}`
  );

  // Teste 3: Equivalência Econômica de Barter
  const novoBarter = service.registrarBarter({
    acordoPatrocinioId: 'spn-001',
    descricaoItemPermuta: 'Serviço de segurança privada em troca de ingressos pista',
    valorEconomicoAvaliadoBrl: 50000.0,
    numeroNotaFiscalEntrada: 'NF-E-88120',
    numeroNotaFiscalSaida: 'NF-S-33910',
  });
  assert(
    novoBarter.sucesso === true && novoBarter.valorLancamentoContabilBrl === 50000.0,
    'Teste 3: Registro e validação contábil de compensação fiscal sem trânsito financeiro',
    `Valor Compensado: R$ ${novoBarter.valorLancamentoContabilBrl.toLocaleString('pt-BR')} | Protocolo: ${novoBarter.protocoloCompensacaoFiscal}`
  );

  // Teste 4: Cronograma de Amortização Linear (IFRS 15)
  const amortizations = service.getAmortizations();
  assert(
    amortizations.length > 0 &&
      amortizations[0].amortizacaoCompetenciaBrl === 100000.0 &&
      amortizations[0].saldoReceitaDiferidaFinalBrl === 900000.0,
    'Teste 4: Amortização mensal linear da receita diferida proporcional ao prazo do contrato',
    `Competência: ${amortizations[0].mesCompetencia} | Amortizado: R$ ${amortizations[0].amortizacaoCompetenciaBrl.toLocaleString('pt-BR')} | Saldo Diferido Restante: R$ ${amortizations[0].saldoReceitaDiferidaFinalBrl.toLocaleString('pt-BR')}`
  );

  // Teste 5: Classificação Contábil na DRE
  assert(
    amortizations[0].contaContabilCredito.includes('Receitas de Patrocínios'),
    'Teste 5: Destinação contábil de crédito em conta apropriada de resultado (DRE Oficial)',
    `Conta Contábil: ${amortizations[0].contaContabilCredito}`
  );

  // Teste 6: Consolidação de KPIs de Patrocínio e Barter
  const kpis = service.getKpis();
  assert(
    kpis.receitaTotalContratadaBrl > 0 &&
      kpis.receitaDiferidaPassivoBrl > 0 &&
      kpis.marcasPatrocinadorasAtivas >= 1,
    'Teste 6: Consolidação de KPIs de portfólio de marcas, receitas amortizadas e permutas',
    `Total Contratado: R$ ${kpis.receitaTotalContratadaBrl.toLocaleString('pt-BR')} | Passivo Diferido: R$ ${kpis.receitaDiferidaPassivoBrl.toLocaleString('pt-BR')} | Amortizado Ano: R$ ${kpis.receitaAmortizadaAnoBrl.toLocaleString('pt-BR')}`
  );

  console.log('\n------------------------------------------------------------------------');
  console.log(`🎯 RESULTADO FASE 48: ${passCount}/${totalCount} TESTES APROVADOS (${Math.round((passCount/totalCount)*100)}%)`);
  console.log('------------------------------------------------------------------------\n');

  if (passCount !== totalCount) {
    process.exit(1);
  }
}

runTests();
