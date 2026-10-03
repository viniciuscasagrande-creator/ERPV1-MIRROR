import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import type {
  TicketInsurancePolicyDto,
  InsuranceClaimRecordDto,
  SusepBrokerageCommissionDto,
  InsuranceDashboardKpisDto,
  EmitirApoliceRequestDto,
  EmitirApoliceResponseDto,
} from '@diskingressos/types';

@Injectable()
export class TicketInsuranceService {
  private readonly logger = new Logger(TicketInsuranceService.name);

  private inMemoryApolices: TicketInsurancePolicyDto[] = [];
  private inMemorySinistros: InsuranceClaimRecordDto[] = [];
  private inMemoryComissoes: SusepBrokerageCommissionDto[] = [];
  private isInitialized = false;

  constructor(private readonly prisma: PrismaService) {}

  private async ensureSeedData(): Promise<void> {
    if (this.isInitialized) return;

    this.logger.log('Inicializando motor de Seguro de Ingressos & Sinistros SUSEP (Fase 45)...');

    const ap1: TicketInsurancePolicyDto = {
      id: 'apol-001',
      numeroApoliceSusep: 'POL-SUSEP-2026-991204',
      pedidoId: 'PED-ROCK-2026-4421',
      seguradoNome: 'Mariana Duarte',
      seguradoCpf: '419.001.294-11',
      seguradoraParceira: 'Porto Seguro Companhia de Seguros Gerais',
      valorPremioTotalBrl: 32.0, // 8% do ingresso de R$ 400
      comissaoCorretagemBrl: 9.6, // 30% comissão de corretagem
      premioLiquidoCiaBrl: 22.4,
      statusApolice: 'VIGENTE_SEGURADO',
      emitidaEm: '2026-04-01T10:00:00Z',
    };

    this.inMemoryApolices = [ap1];

    const s1: InsuranceClaimRecordDto = {
      id: 'sin-001',
      codigoSinistro: 'SIN-SUSEP-2026-0042',
      apoliceId: 'apol-001',
      motivoSinistro: 'EMERGENCIA_MEDICA_COMPROVADA_ATESTADO',
      valorIndenizacaoBrl: 400.0,
      statusSinistro: 'INDENIZADO_DIRETO_SEGURADORA',
      dataAprovacao: '2026-04-01T15:00:00Z',
    };

    this.inMemorySinistros = [s1];

    const c1: SusepBrokerageCommissionDto = {
      id: 'com-001',
      codigoLoteComissao: 'COM-SUSEP-2026-04',
      mesCompetencia: '2026-04',
      totalApolicesEmitidas: 1420,
      volumePremiosBrl: 45440.0,
      receitaComissaoBrl: 13632.0,
      contaReceitaContabil: '3.1.1.09 - Receitas de Corretagem e Seguros de Bilheteria',
      apuradoEm: '2026-04-01T16:00:00Z',
    };

    this.inMemoryComissoes = [c1];
    this.isInitialized = true;
  }

  async getDashboardKpis(): Promise<InsuranceDashboardKpisDto> {
    await this.ensureSeedData();
    return {
      totalApolicesVigentes: 1420,
      volumePremiosEmitidosBrl: 45440.0,
      receitaCorretagemBrl: 13632.0,
      taxaSinistralidadePercent: 1.4,
      sinistrosLiquidadosMes: 12,
    };
  }

  async listarApolices(): Promise<TicketInsurancePolicyDto[]> {
    await this.ensureSeedData();
    return this.inMemoryApolices;
  }

  async listarSinistros(): Promise<InsuranceClaimRecordDto[]> {
    await this.ensureSeedData();
    return this.inMemorySinistros;
  }

  async emitirApolice(dto: EmitirApoliceRequestDto): Promise<EmitirApoliceResponseDto> {
    await this.ensureSeedData();
    const premioTotal = Number((dto.valorIngressoBrl * 0.08).toFixed(2));
    const comissao = Number((premioTotal * 0.3).toFixed(2));
    const premioLiquido = Number((premioTotal - comissao).toFixed(2));
    const numeroApoliceSusep = `POL-SUSEP-2026-${Date.now().toString().slice(-6)}`;
    const protocoloHomologacaoSusep = `SUSEP-CIRC-621-${Date.now().toString().slice(-4)}`;

    const novaApolice: TicketInsurancePolicyDto = {
      id: `apol-${Date.now()}`,
      numeroApoliceSusep,
      pedidoId: dto.pedidoId,
      seguradoNome: dto.seguradoNome,
      seguradoCpf: dto.seguradoCpf,
      seguradoraParceira: dto.seguradoraParceira || 'Porto Seguro Cia de Seguros',
      valorPremioTotalBrl: premioTotal,
      comissaoCorretagemBrl: comissao,
      premioLiquidoCiaBrl: premioLiquido,
      statusApolice: 'VIGENTE_SEGURADO',
      emitidaEm: new Date().toISOString(),
    };

    this.inMemoryApolices.unshift(novaApolice);

    return {
      sucesso: true,
      numeroApoliceSusep,
      valorPremioTotalBrl: premioTotal,
      comissaoCorretagemBrl: comissao,
      premioLiquidoCiaBrl: premioLiquido,
      protocoloHomologacaoSusep,
    };
  }
}
