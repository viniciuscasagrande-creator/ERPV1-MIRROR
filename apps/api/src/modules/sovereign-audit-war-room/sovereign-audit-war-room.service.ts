import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { StatusKernelSoberano } from '@diskingressos/types';
import type {
  ZeroTrustAuditKernelDto,
  PatrimonialKillSwitchEventDto,
  Isae3402ComplianceDossierDto,
  WarRoomDashboardKpisDto,
  DispararAuditoriaKernelRequestDto,
  DispararAuditoriaKernelResponseDto,
} from '@diskingressos/types';
import * as crypto from 'crypto';

@Injectable()
export class SovereignAuditWarRoomService {
  private readonly logger = new Logger(SovereignAuditWarRoomService.name);

  private inMemoryKernels: ZeroTrustAuditKernelDto[] = [];
  private inMemoryKillSwitches: PatrimonialKillSwitchEventDto[] = [];
  private inMemoryDossiers: Isae3402ComplianceDossierDto[] = [];
  private isInitialized = false;

  constructor(private readonly prisma: PrismaService) {}

  private async ensureSeedData(): Promise<void> {
    if (this.isInitialized) return;

    this.logger.log('Inicializando motor do War Room Soberano e Zero-Trust Financial Kernel (Fase 40)...');

    const mptRootHash = crypto
      .createHash('sha256')
      .update('MERKLE_PATRICIA_TREE_ROOT_40_PHASES_CONSOLIDATED_2026')
      .digest('hex');

    const k1: ZeroTrustAuditKernelDto = {
      id: 'knl-001',
      codigoCicloKernel: 'KNL-ZERO-TRUST-2026-0042',
      timestampExecucao: '2026-04-01T18:00:00Z',
      totalRegrasAuditadas: 480,
      regrasConformes: 480,
      violacoesCriticas: 0,
      integridadeContabilScore: 100.0,
      statusKernel: StatusKernelSoberano.SOBERANO_EQUILIBRADO,
      hashGlobalMptSha256: mptRootHash,
    };

    this.inMemoryKernels = [k1];

    const ks1: PatrimonialKillSwitchEventDto = {
      id: 'ks-001',
      eventoKillSwitchId: 'KS-ARMED-NORMAL',
      motivoAcionamento: 'Nenhum acionamento necessário - Parâmetros patrimoniais equilibrados em todas as 40 fases',
      ativo: false,
      acionadoPor: 'SISTEMA_SOBERANO_AUTOMATICO',
      quarentenaPatrimonialStatus: 'DESATIVADO_NORMAL',
    };

    this.inMemoryKillSwitches = [ks1];

    const d1: Isae3402ComplianceDossierDto = {
      id: 'dos-001',
      codigoDossie: 'ISAE-3402-TYPE-II-2026-Q1',
      anoPeriodoAuditoria: '2026-Q1',
      auditorResponsavel: 'Auditores Independentes Big Four Registrados CVM',
      statusHomologacao: 'APROVADO_SEM_RESSALVAS',
      hashAssinaturaAuditoria: crypto
        .createHash('sha256')
        .update('ISAE-3402-TYPE-II-2026-Q1|BIG_FOUR_CVM_COMPLIANT')
        .digest('hex'),
      emitidoEm: '2026-04-01T18:30:00Z',
    };

    this.inMemoryDossiers = [d1];
    this.isInitialized = true;
  }

  async getDashboardKpis(): Promise<WarRoomDashboardKpisDto> {
    await this.ensureSeedData();
    return {
      scoreIntegridadePatrimonialPercent: 100.0,
      totalFasesConformes: 40,
      totalRegrasContabeisValidadas: 480,
      saldoConsolidadoSegregadoBrl: 48250000.0,
      tempoMedioAuditoriaKernelMs: 240,
      statusKillSwitchGeral: 'ARMADO_OPERACIONAL',
    };
  }

  async listarCiclosKernel(): Promise<ZeroTrustAuditKernelDto[]> {
    await this.ensureSeedData();
    return this.inMemoryKernels;
  }

  async listarDossies(): Promise<Isae3402ComplianceDossierDto[]> {
    await this.ensureSeedData();
    return this.inMemoryDossiers;
  }

  async dispararAuditoriaKernel(dto: DispararAuditoriaKernelRequestDto): Promise<DispararAuditoriaKernelResponseDto> {
    await this.ensureSeedData();
    const duracaoMs = dto.profundidadeVerificacao === 'COMPLETA_40_FASES' ? 320 : 110;
    const codigoCicloKernel = `KNL-ZERO-TRUST-2026-${Date.now().toString().slice(-4)}`;
    const merkleRootHash = crypto
      .createHash('sha256')
      .update(`${codigoCicloKernel}|${Date.now()}|40_FASES_OK`)
      .digest('hex');

    const novoKernel: ZeroTrustAuditKernelDto = {
      id: `knl-${Date.now()}`,
      codigoCicloKernel,
      timestampExecucao: new Date().toISOString(),
      totalRegrasAuditadas: 480,
      regrasConformes: 480,
      violacoesCriticas: 0,
      integridadeContabilScore: 100.0,
      statusKernel: StatusKernelSoberano.SOBERANO_EQUILIBRADO,
      hashGlobalMptSha256: merkleRootHash,
    };

    this.inMemoryKernels.unshift(novoKernel);

    return {
      codigoCicloKernel,
      scoreIntegridade: 100.0,
      regrasConformes: 480,
      totalRegras: 480,
      merkleRootHash,
      status: StatusKernelSoberano.SOBERANO_EQUILIBRADO,
      duracaoMs,
    };
  }
}
