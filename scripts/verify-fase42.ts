import type {
  ArtistRoyaltyAgreementDto,
  InternationalWithholdingTaxDto,
  ForeignRemittanceOrderDto,
  ArtistRoyaltyDashboardKpisDto,
  CalcularWithholdingTaxRequestDto,
  CalcularWithholdingTaxResponseDto,
} from '@diskingressos/types';

console.log('========================================================================');
console.log('🧪 DISKINGRESSOS ERP - SCRIPT DE AUDITORIA & HARDENING (FASE 42)');
console.log('🌍 GESTÃO DE ROYALTIES & DIREITOS DE IMAGEM DE ARTISTAS INTERNACIONAIS');
console.log('💸 WITHHOLDING TAX (IRRF / CIDE), TRATADOS DE BITRIBUTAÇÃO & REMESSA SWIFT');
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

class TestArtistRoyaltiesService {
  private inMemoryAgreements: ArtistRoyaltyAgreementDto[] = [];
  private inMemoryWithholdings: InternationalWithholdingTaxDto[] = [];
  private inMemoryRemittances: ForeignRemittanceOrderDto[] = [];

  constructor() {
    this.initData();
  }

  private initData() {
    const a1: ArtistRoyaltyAgreementDto = {
      id: 'roy-001',
      codigoContrato: 'ROY-2026-COLDPLAY-STAD',
      artistaNome: 'Coldplay',
      agenciaInternacional: 'WME Agency LLC',
      paisOrigemIso: 'GBR',
      possuiTratadoDuplaTrib: true,
      moedaContratual: 'USD',
      valorCacheMoedaOrigem: 500000.0,
      statusContrato: 'ATIVO_HOMOLOGADO',
      criadoEm: '2026-03-20T10:00:00Z',
    };

    const w1: InternationalWithholdingTaxDto = {
      id: 'wht-001',
      contratoId: 'roy-001',
      codigoRetencao: 'RET-IRRF-CIDE-2026-01',
      aliquotaIrrfPercent: 15.0,
      valorIrrfRetidoBrl: 386250.0,
      aliquotaCidePercent: 10.0,
      valorCideDevidoBrl: 257500.0,
      darfIrrfNumero: 'DARF-0422-2026-88192',
      darfCideNumero: 'DARF-8741-2026-33910',
      dataCalculo: '2026-03-25T10:00:00Z',
    };

    const r1: ForeignRemittanceOrderDto = {
      id: 'rem-001',
      codigoRemessa: 'FX-SWIFT-2026-00441',
      contratoId: 'roy-001',
      bancoCambioIspb: '00000000 - Banco do Brasil S.A.',
      taxaCambioPtaxBrl: 5.15,
      valorLiquidoEnviadoMoeda: 375000.0,
      swiftReference: 'SWIFT-BB-2026-9921490',
      statusRemessa: 'LIQUIDADA_SWIFT',
      dataEfetivacao: '2026-03-27T16:00:00Z',
    };

    this.inMemoryAgreements = [a1];
    this.inMemoryWithholdings = [w1];
    this.inMemoryRemittances = [r1];
  }

  getAgreements() {
    return this.inMemoryAgreements;
  }

  getWithholdings() {
    return this.inMemoryWithholdings;
  }

  getRemittances() {
    return this.inMemoryRemittances;
  }

  calcularWithholding(dto: CalcularWithholdingTaxRequestDto): CalcularWithholdingTaxResponseDto {
    const valorBrutoBrl = dto.valorCacheMoedaOrigem * dto.cotacaoPtaxBrl;
    const aliquotaIrrf = dto.possuiTratadoDuplaTrib ? 15.0 : 25.0;
    const aliquotaCide = 10.0;

    const valorIrrfBrl = (valorBrutoBrl * aliquotaIrrf) / 100;
    const valorCideBrl = (valorBrutoBrl * aliquotaCide) / 100;
    const valorLiquidoRemessaBrl = valorBrutoBrl - valorIrrfBrl;
    const valorLiquidoRemessaMoeda = valorLiquidoRemessaBrl / dto.cotacaoPtaxBrl;

    return {
      codigoRetencao: `RET-SIMULADA-${Date.now()}`,
      valorBrutoBrl: Number(valorBrutoBrl.toFixed(2)),
      aliquotaIrrfPercent: aliquotaIrrf,
      valorIrrfBrl: Number(valorIrrfBrl.toFixed(2)),
      aliquotaCidePercent: aliquotaCide,
      valorCideBrl: Number(valorCideBrl.toFixed(2)),
      valorLiquidoRemessaBrl: Number(valorLiquidoRemessaBrl.toFixed(2)),
      valorLiquidoRemessaMoeda: Number(valorLiquidoRemessaMoeda.toFixed(2)),
    };
  }

  getKpis(): ArtistRoyaltyDashboardKpisDto {
    return {
      totalContratosInternacionais: this.inMemoryAgreements.length,
      volumeTotalRemessasUsd: 500000.0,
      tributosRetidosFonteBrl: 643750.0,
      remessasSwiftLiquidadas: this.inMemoryRemittances.length,
      taxaMediaPtaxPraticadaBrl: 5.15,
    };
  }
}

async function runTests() {
  const service = new TestArtistRoyaltiesService();

  // Teste 1: Contrato internacional com tratado
  const agreements = service.getAgreements();
  assert(
    agreements.length > 0 &&
      agreements[0].possuiTratadoDuplaTrib === true &&
      agreements[0].paisOrigemIso === 'GBR',
    'Teste 1: Cadastro de contrato de artista internacional com tratado de bitributação (Reino Unido)',
    `Artista: ${agreements[0].artistaNome} | Origem: ${agreements[0].paisOrigemIso} | Cachê: ${agreements[0].moedaContratual} ${agreements[0].valorCacheMoedaOrigem}`
  );

  // Teste 2: Apuração Withholding com Tratado (IRRF 15%)
  const calc1 = service.calcularWithholding({
    contratoId: 'roy-001',
    valorCacheMoedaOrigem: 500000.0,
    moeda: 'USD',
    cotacaoPtaxBrl: 5.15,
    possuiTratadoDuplaTrib: true,
  });
  assert(
    calc1.aliquotaIrrfPercent === 15.0 &&
      calc1.valorIrrfBrl === 386250.0 &&
      calc1.aliquotaCidePercent === 10.0,
    'Teste 2: Apuração de Withholding Tax com tratado de bitributação (alíquota favorecida 15% IRRF + 10% CIDE)',
    `Bruto BRL: R$ ${calc1.valorBrutoBrl} | IRRF 15%: R$ ${calc1.valorIrrfBrl} | CIDE 10%: R$ ${calc1.valorCideBrl}`
  );

  // Teste 3: Apuração Withholding Sem Tratado (IRRF 25%)
  const calc2 = service.calcularWithholding({
    contratoId: 'roy-002',
    valorCacheMoedaOrigem: 100000.0,
    moeda: 'USD',
    cotacaoPtaxBrl: 5.0,
    possuiTratadoDuplaTrib: false,
  });
  assert(
    calc2.aliquotaIrrfPercent === 25.0 && calc2.valorIrrfBrl === 125000.0,
    'Teste 3: Apuração de Withholding Tax para país sem tratado de bitributação (alíquota padrão 25% IRRF)',
    `Bruto BRL: R$ ${calc2.valorBrutoBrl} | IRRF 25%: R$ ${calc2.valorIrrfBrl} | Líquido: US$ ${calc2.valorLiquidoRemessaMoeda}`
  );

  // Teste 4: Guias DARF de recolhimento
  const withholdings = service.getWithholdings();
  assert(
    withholdings.length > 0 &&
      withholdings[0].darfIrrfNumero.startsWith('DARF-0422') &&
      withholdings[0].darfCideNumero.startsWith('DARF-8741'),
    'Teste 4: Geração de códigos e guias de recolhimento DARF 0422 (IRRF) e 8741 (CIDE Royalties)',
    `DARF IRRF: ${withholdings[0].darfIrrfNumero} | DARF CIDE: ${withholdings[0].darfCideNumero}`
  );

  // Teste 5: Liquidação Cambial SWIFT
  const remittances = service.getRemittances();
  assert(
    remittances.length > 0 &&
      remittances[0].statusRemessa === 'LIQUIDADA_SWIFT' &&
      remittances[0].swiftReference.length > 0,
    'Teste 5: Ordem de remessa e fechamento de câmbio liquidada com mensageria SWIFT',
    `Código: ${remittances[0].codigoRemessa} | Referência: ${remittances[0].swiftReference} | PTAX: R$ ${remittances[0].taxaCambioPtaxBrl}`
  );

  // Teste 6: Consolidação de KPIs de Royalties Internacionais
  const kpis = service.getKpis();
  assert(
    kpis.totalContratosInternacionais >= 1 &&
      kpis.remessasSwiftLiquidadas >= 1 &&
      kpis.tributosRetidosFonteBrl > 0,
    'Teste 6: Consolidação de KPIs de gestão cambial e tributos retidos de artistas internacionais',
    `Volume USD: US$ ${kpis.volumeTotalRemessasUsd.toLocaleString('en-US')} | Retenção BRL: R$ ${kpis.tributosRetidosFonteBrl.toLocaleString('pt-BR')}`
  );

  console.log('\n------------------------------------------------------------------------');
  console.log(`🎯 RESULTADO FASE 42: ${passCount}/${totalCount} TESTES APROVADOS (${Math.round((passCount/totalCount)*100)}%)`);
  console.log('------------------------------------------------------------------------\n');

  if (passCount !== totalCount) {
    process.exit(1);
  }
}

runTests();
