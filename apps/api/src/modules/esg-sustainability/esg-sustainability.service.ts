import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
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

@Injectable()
export class EsgSustainabilityService {
  private readonly logger = new Logger(EsgSustainabilityService.name);

  // Armazenamento em memória para demonstração imediata e resiliência offline
  private inMemoryFootprints: EventCarbonFootprintDto[] = [];
  private inMemoryCredits: CarbonCreditOffsetDto[] = [];
  private inMemoryBorderoEntries: GreenBorderoEntryDto[] = [];
  private inMemoryEsgReports: EsgReportIfrsDto[] = [];
  private isInitialized = false;

  constructor(private readonly prisma: PrismaService) {}

  private async ensureSeedData(): Promise<void> {
    if (this.isInitialized) return;

    this.logger.log('Inicializando base de dados em memória para Governança ESG e Pegada de Carbono...');

    // 1. Inventários de Emissões GHG Protocol por Evento
    const fp1: EventCarbonFootprintDto = {
      id: 'ghg-001',
      eventoId: 'evt-001',
      codigoInventario: 'GHG-EVT-2026-001',
      nomeEvento: 'Festival Rock Curitiba Prime 2026',
      periodoReferencia: '2026-03',
      publicoPresenteTotal: 18500,
      totalIngressosEmitidos: 20000,
      escopo1KgCo2e: 12500.0, // Geradores diesel de palco e carretas de som
      escopo2KgCo2e: 4800.0,  // Iluminação cênica da arena (rede SIN)
      escopo3KgCo2e: 36200.0, // Deslocamento modal misto do público (CEP) + resíduos
      totalKgCo2e: 53500.0,
      totalToneladasCo2e: 53.5,
      fatorMedioPorIngressoKg: 2.675,
      statusInventario: StatusInventarioCarbono.NEUTRALIZADO,
      auditadoPor: 'Bureau Veritas ESG Certification',
      criadoEm: new Date('2026-03-01T10:00:00Z').toISOString(),
    };

    const fp2: EventCarbonFootprintDto = {
      id: 'ghg-002',
      eventoId: 'evt-002',
      codigoInventario: 'GHG-EVT-2026-002',
      nomeEvento: 'Tour Coldplay Eco Music Experience 2026',
      periodoReferencia: '2026-03',
      publicoPresenteTotal: 42000,
      totalIngressosEmitidos: 45000,
      escopo1KgCo2e: 18400.0,
      escopo2KgCo2e: 9600.0,
      escopo3KgCo2e: 88500.0,
      totalKgCo2e: 116500.0,
      totalToneladasCo2e: 116.5,
      fatorMedioPorIngressoKg: 2.589,
      statusInventario: StatusInventarioCarbono.AUDITADO_TERCEIROS,
      auditadoPor: 'PwC Climate & Sustainability Assurance',
      criadoEm: new Date('2026-03-02T11:00:00Z').toISOString(),
    };

    const fp3: EventCarbonFootprintDto = {
      id: 'ghg-003',
      eventoId: 'evt-003',
      codigoInventario: 'GHG-EVT-2026-003',
      nomeEvento: 'Eletrônica Sunset Pedreira Paulo Leminski',
      periodoReferencia: '2026-03',
      publicoPresenteTotal: 12000,
      totalIngressosEmitidos: 12500,
      escopo1KgCo2e: 6200.0,
      escopo2KgCo2e: 3100.0,
      escopo3KgCo2e: 21800.0,
      totalKgCo2e: 31100.0,
      totalToneladasCo2e: 31.1,
      fatorMedioPorIngressoKg: 2.488,
      statusInventario: StatusInventarioCarbono.EM_APURACAO,
      criadoEm: new Date('2026-03-03T14:30:00Z').toISOString(),
    };

    this.inMemoryFootprints = [fp1, fp2, fp3];

    // 2. Lotes de Créditos de Carbono Certificados no Portfólio
    const cr1: CarbonCreditOffsetDto = {
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
      dataAposentadoria: new Date('2026-03-02T15:00:00Z').toISOString(),
      criadoEm: new Date('2026-02-15T09:00:00Z').toISOString(),
    };

    const cr2: CarbonCreditOffsetDto = {
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
      dataAposentadoria: new Date('2026-03-03T16:20:00Z').toISOString(),
      criadoEm: new Date('2026-02-20T10:00:00Z').toISOString(),
    };

    const cr3: CarbonCreditOffsetDto = {
      id: 'cr-003',
      codigoCertificado: 'GS-2026-3021',
      padraoCertificacao: PadraoCertificacaoCarbono.GOLD_STANDARD,
      projetoNome: 'Restauração de Nascentes Serra do Mar',
      bioma: BiomaProjetoCarbono.MATA_ATLANTICA,
      numeroSerieSerial: 'GS-BR-7712-2026-X01',
      toneladasDisponiveis: 950.0,
      toneladasCompensadas: 0.0,
      precoPorToneladaBrl: 85.0,
      custoTotalBrl: 80750.0,
      status: 'RESERVADO',
      urlRegistroPublico: 'https://registry.goldstandard.org/projects/details/3021',
      criadoEm: new Date('2026-03-01T08:00:00Z').toISOString(),
    };

    this.inMemoryCredits = [cr1, cr2, cr3];

    // 3. Borderôs Verdes com Retenção de Sustentabilidade
    const gb1: GreenBorderoEntryDto = {
      id: 'gbr-001',
      codigoRetencaoVerde: 'GBR-2026-0001',
      borderoFechamentoId: 'bor-2026-01',
      eventoId: 'evt-001',
      eventoNome: 'Festival Rock Curitiba Prime 2026',
      produtorId: 'prod-001',
      produtorNome: 'Prime Eventos Culturais S.A.',
      taxaVerdePorIngressoBrl: 1.5,
      totalIngressosCompensados: 20000,
      totalRetidoSustentabilidadeBrl: 30000.0, // 20.000 * 1,50
      toneladasCompensadas: 53.5,
      statusCompensacao: StatusCompensacaoVerde.CERTIFICADO_EMITIDO,
      contaContabilDebito: '3.2.4.01 - Despesa com Compensação Socioambiental / Selo Verde',
      contaContabilCredito: '2.1.8.05 - Contas a Pagar Fornecedores de Créditos de Carbono',
      dataLancamento: new Date('2026-03-02T16:00:00Z').toISOString(),
      certificadoSerial: 'VCS-BR-9982-2026-0001-A',
    };

    const gb2: GreenBorderoEntryDto = {
      id: 'gbr-002',
      codigoRetencaoVerde: 'GBR-2026-0002',
      borderoFechamentoId: 'bor-2026-02',
      eventoId: 'evt-002',
      eventoNome: 'Tour Coldplay Eco Music Experience 2026',
      produtorId: 'prod-002',
      produtorNome: 'Live Nation Brasil Entretenimento Ltda',
      taxaVerdePorIngressoBrl: 1.8,
      totalIngressosCompensados: 45000,
      totalRetidoSustentabilidadeBrl: 81000.0, // 45.000 * 1,80
      toneladasCompensadas: 116.5,
      statusCompensacao: StatusCompensacaoVerde.APLICADO,
      contaContabilDebito: '3.2.4.01 - Despesa com Compensação Socioambiental / Selo Verde',
      contaContabilCredito: '2.1.8.05 - Contas a Pagar Fornecedores de Créditos de Carbono',
      dataLancamento: new Date('2026-03-03T17:00:00Z').toISOString(),
      certificadoSerial: 'B3-BIO-2026-8812-441',
    };

    this.inMemoryBorderoEntries = [gb1, gb2];

    // 4. Relatórios IFRS S1 e S2 (CVM Resolução 193/2023)
    const r1: EsgReportIfrsDto = {
      id: 'esg-rep-001',
      codigoRelatorio: 'ESG-CVM193-2026-1T',
      anoFiscal: 2026,
      trimestre: '1T',
      totalEmissoesGeradasTCo2e: 201.1,
      totalCompensadoTCo2e: 170.0,
      taxaNeutralizacaoPercent: 84.54, // 170 / 201.1
      investimentoSocioambientalBrl: 111000.0,
      residuosDesviadosAterroPercent: 88.5,
      eventosComSeloVerde: 2,
      statusRelatorio: StatusRelatorioEsg.PUBLICADO_CVM_193,
      publicadoEm: new Date('2026-03-03T18:00:00Z').toISOString(),
      criadoEm: new Date('2026-03-03T17:30:00Z').toISOString(),
    };

    this.inMemoryEsgReports = [r1];
    this.isInitialized = true;
  }

  // ============================================================================
  // KPIS CONSOLIDADOS ESG & EMISSÕES
  // ============================================================================
  async getDashboardKpis(): Promise<EsgDashboardKpisDto> {
    await this.ensureSeedData();

    const totalEmissoesMapeadasTCo2e = Number(
      this.inMemoryFootprints
        .reduce((acc, f) => acc + f.totalToneladasCo2e, 0)
        .toFixed(2),
    );

    const totalEmissoesNeutralizadasTCo2e = Number(
      this.inMemoryCredits
        .reduce((acc, c) => acc + c.toneladasCompensadas, 0)
        .toFixed(2),
    );

    const taxaNeutralizacaoGlobalPercent =
      totalEmissoesMapeadasTCo2e > 0
        ? Number(
            (
              (totalEmissoesNeutralizadasTCo2e / totalEmissoesMapeadasTCo2e) *
              100
            ).toFixed(2),
          )
        : 100.0;

    const investimentoVerdeAcumuladoBrl = Number(
      this.inMemoryBorderoEntries
        .reduce((acc, b) => acc + b.totalRetidoSustentabilidadeBrl, 0)
        .toFixed(2),
    );

    const creditosDisponiveisToneladas = Number(
      this.inMemoryCredits
        .reduce((acc, c) => acc + c.toneladasDisponiveis, 0)
        .toFixed(2),
    );

    return {
      totalEmissoesMapeadasTCo2e,
      totalEmissoesNeutralizadasTCo2e,
      taxaNeutralizacaoGlobalPercent,
      investimentoVerdeAcumuladoBrl,
      eventosAuditadosCount: this.inMemoryFootprints.length,
      creditosDisponiveisToneladas,
    };
  }

  // ============================================================================
  // INVENTÁRIOS GHG PROTOCOL POR EVENTO
  // ============================================================================
  async listarInventarios(): Promise<EventCarbonFootprintDto[]> {
    await this.ensureSeedData();
    return this.inMemoryFootprints;
  }

  async obterInventarioPorId(id: string): Promise<EventCarbonFootprintDto | null> {
    await this.ensureSeedData();
    return this.inMemoryFootprints.find((f) => f.id === id) || null;
  }

  // ============================================================================
  // CALCULADORA & SIMULADOR DE PEGADA DE CARBONO (GHG PROTOCOL)
  // ============================================================================
  calcularPegadaEvento(
    dto: CalcularPegadaEventoRequestDto,
  ): CalcularPegadaEventoResponseDto {
    // Escopo 1: Geradores diesel e frotas próprias da montagem
    // Fator oficial IPCC / GHG Protocol Brasil: 2.68 kg CO2e / litro de óleo diesel
    const escopo1KgCo2e = Number((dto.litrosDieselGeradores * 2.68).toFixed(2));

    // Escopo 2: Consumo de energia elétrica da arena conectada ao SIN (Grid Nacional)
    // Fator médio anual SIN Brasil: 0.088 kg CO2e / kWh
    const escopo2KgCo2e = Number((dto.consumoKwhArena * 0.088).toFixed(2));

    // Escopo 3: Deslocamento do público geolocalizado por CEP + destinação de resíduos
    // Deslocamento modal misto (carros, vans, transporte coletivo): ~0.12 kg CO2e / passageiro-km
    // Resíduos sólidos em aterro/reciclagem: ~0.58 kg CO2e / kg resíduo
    const emissaoTransporteKg =
      dto.publicoPresenteTotal * dto.distanciaMediaKmPublico * 0.12;
    const emissaoResiduosKg = dto.quilosResiduosGerados * 0.58;
    const escopo3KgCo2e = Number(
      (emissaoTransporteKg + emissaoResiduosKg).toFixed(2),
    );

    const totalKgCo2e = Number(
      (escopo1KgCo2e + escopo2KgCo2e + escopo3KgCo2e).toFixed(2),
    );
    const totalToneladasCo2e = Number((totalKgCo2e / 1000).toFixed(3));

    const totalIngressos = dto.totalIngressosEmitidos > 0 ? dto.totalIngressosEmitidos : dto.publicoPresenteTotal;
    const fatorMedioPorIngressoKg = Number(
      (totalKgCo2e / (totalIngressos || 1)).toFixed(3),
    );

    const creditosNecessariosToneladas = Math.ceil(totalToneladasCo2e);
    // Preço médio de mercado para crédito Verra VCS / B3 no Brasil: R$ 70,00 / tCO2e
    const precoMedioPorTonelada = 70.0;
    const custoEstimadoCompensacaoBrl = Number(
      (creditosNecessariosToneladas * precoMedioPorTonelada).toFixed(2),
    );

    const taxaSugeridaPorIngressoBrl = Number(
      (custoEstimadoCompensacaoBrl / (totalIngressos || 1)).toFixed(2),
    );

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

  // ============================================================================
  // CRÉDITOS DE CARBONO & APOSENTADORIA
  // ============================================================================
  async listarCreditosCarbono(): Promise<CarbonCreditOffsetDto[]> {
    await this.ensureSeedData();
    return this.inMemoryCredits;
  }

  async aposentarCredito(id: string): Promise<CarbonCreditOffsetDto> {
    await this.ensureSeedData();
    const credito = this.inMemoryCredits.find((c) => c.id === id);
    if (!credito) {
      throw new Error(`Crédito de carbono com ID ${id} não localizado.`);
    }

    credito.status = 'APOSENTADO_REGISTRO';
    credito.dataAposentadoria = new Date().toISOString();
    return credito;
  }

  // ============================================================================
  // BORDERÔS VERDES & RETENÇÕES CONTÁBEIS
  // ============================================================================
  async listarBorderosVerdes(): Promise<GreenBorderoEntryDto[]> {
    await this.ensureSeedData();
    return this.inMemoryBorderoEntries;
  }

  // ============================================================================
  // RELATÓRIOS IFRS S1 E S2 / CVM 193
  // ============================================================================
  async listarRelatoriosIfrs(): Promise<EsgReportIfrsDto[]> {
    await this.ensureSeedData();
    return this.inMemoryEsgReports;
  }
}
