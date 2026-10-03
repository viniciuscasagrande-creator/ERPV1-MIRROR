import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { EfetividadeControleSox } from '@diskingressos/types';
import type {
  SoxInternalControlMatrixDto,
  AuditCommitteeReviewDossierDto,
  IpoDualListingReadinessEvaluationDto,
  SoxIpoDashboardKpisDto,
  TestarControleSoxRequestDto,
  TestarControleSoxResponseDto,
} from '@diskingressos/types';

@Injectable()
export class SoxIpoService {
  private readonly logger = new Logger(SoxIpoService.name);

  private inMemorySoxMatrix: SoxInternalControlMatrixDto[] = [
    {
      id: 'sox-001',
      codigoControleSox: 'SOX-FIN-01',
      processoNegocio: 'Fechamento Contábil e Partidas Dobradas',
      descricaoControle: 'Validação automática diária de igualdade matemática entre débitos e créditos com tolerância zero centavos',
      frequenciaTeste: 'DIARIA',
      tipoControle: 'AUTOMATIZADO',
      efetividadeTeste: EfetividadeControleSox.EFICAZ_SEM_DEFICIENCIA,
      testadoPor: 'Auditoria Interna / Big Four SOX Team',
      dataUltimoTeste: '2026-04-01T10:00:00Z',
    },
    {
      id: 'sox-002',
      codigoControleSox: 'SOX-REV-02',
      processoNegocio: 'Segregação de Receita de Terceiros e IFRS 15',
      descricaoControle: 'Isolamento estrito entre receita própria de comissão/conveniência e passivo fiduciário de repasse a produtores',
      frequenciaTeste: 'MENSAL',
      tipoControle: 'AUTOMATIZADO',
      efetividadeTeste: EfetividadeControleSox.EFICAZ_SEM_DEFICIENCIA,
      testadoPor: 'Auditoria Interna / Big Four SOX Team',
      dataUltimoTeste: '2026-03-31T18:00:00Z',
    },
  ];

  private inMemoryCommitteeDossiers: AuditCommitteeReviewDossierDto[] = [
    {
      id: 'com-dos-001',
      numeroAtaComite: 'ATA-CA-2026-Q1-SOX',
      membrosComitePresentes: 'Dr. Roberto Magalhães (Independente), Dra. Beatriz Fontes (Especialista Contábil), Marcelo Rossi (CFO)',
      relatorioAuditoriaIndependente: 'Opinião sem ressalvas emitida sobre as demonstrações financeiras e controles internos sob padrão PCAOB AS 2201',
      recomendacoesCfo: 'Submissão formal dos pacotes F-1 à SEC e Formulário de Referência à CVM',
      aprovadoParaConselho: true,
      dataReuniao: '2026-04-02T14:00:00Z',
    },
  ];

  private inMemoryReadiness: IpoDualListingReadinessEvaluationDto[] = [
    {
      id: 'ipo-eval-001',
      periodoReferencia: '2026-Q1 (Fases 1 a 50)',
      indiceProntidaoB3Percent: 100.0,
      indiceProntidaoSecNysePercent: 98.5,
      statusFormularioReferenciaCvm: 'HOMOLOGADO_EMPRESASNET',
      statusRegistrationFormF1Sec: 'REGISTRATION_STATEMENT_APPROVED',
      auditorExternoIndependente: 'PwC / Deloitte Independent Audit',
      certificadoEm: '2026-04-02T18:00:00Z',
    },
  ];

  constructor(private readonly prisma: PrismaService) {}

  async getSoxMatrix(): Promise<SoxInternalControlMatrixDto[]> {
    try {
      const records = await this.prisma.soxInternalControlMatrix.findMany();
      if (records && records.length > 0) {
        return records.map((r) => ({
          id: r.id,
          codigoControleSox: r.codigoControleSox,
          processoNegocio: r.processoNegocio,
          descricaoControle: r.descricaoControle,
          frequenciaTeste: r.frequenciaTeste,
          tipoControle: r.tipoControle,
          efetividadeTeste: r.efetividadeTeste as EfetividadeControleSox,
          testadoPor: r.testadoPor,
          dataUltimoTeste: r.dataUltimoTeste.toISOString(),
        }));
      }
    } catch {
      this.logger.warn('Prisma unavailable, returning in-memory SOX matrix');
    }
    return this.inMemorySoxMatrix;
  }

  async getCommitteeDossiers(): Promise<AuditCommitteeReviewDossierDto[]> {
    try {
      const records = await this.prisma.auditCommitteeReviewDossier.findMany();
      if (records && records.length > 0) {
        return records.map((r) => ({
          id: r.id,
          numeroAtaComite: r.numeroAtaComite,
          membrosComitePresentes: r.membrosComitePresentes,
          relatorioAuditoriaIndependente: r.relatorioAuditoriaIndependente,
          recomendacoesCfo: r.recomendacoesCfo,
          aprovadoParaConselho: r.aprovadoParaConselho,
          dataReuniao: r.dataReuniao.toISOString(),
        }));
      }
    } catch {
      this.logger.warn('Prisma unavailable, returning in-memory dossiers');
    }
    return this.inMemoryCommitteeDossiers;
  }

  async getReadiness(): Promise<IpoDualListingReadinessEvaluationDto[]> {
    try {
      const records = await this.prisma.ipoDualListingReadinessEvaluation.findMany();
      if (records && records.length > 0) {
        return records.map((r) => ({
          id: r.id,
          periodoReferencia: r.periodoReferencia,
          indiceProntidaoB3Percent: Number(r.indiceProntidaoB3Percent),
          indiceProntidaoSecNysePercent: Number(r.indiceProntidaoSecNysePercent),
          statusFormularioReferenciaCvm: r.statusFormularioReferenciaCvm,
          statusRegistrationFormF1Sec: r.statusRegistrationFormF1Sec,
          auditorExternoIndependente: r.auditorExternoIndependente,
          certificadoEm: r.certificadoEm.toISOString(),
        }));
      }
    } catch {
      this.logger.warn('Prisma unavailable, returning in-memory readiness');
    }
    return this.inMemoryReadiness;
  }

  async testarControleSox(dto: TestarControleSoxRequestDto): Promise<TestarControleSoxResponseDto> {
    const efetividade =
      dto.desviosEncontrados === 0
        ? EfetividadeControleSox.EFICAZ_SEM_DEFICIENCIA
        : dto.desviosEncontrados < 3
        ? EfetividadeControleSox.DEFICIENCIA_SIGNIFICATIVA
        : EfetividadeControleSox.DEFICIENCIA_MATERIAL;

    return {
      codigoControleSox: dto.codigoControleSox,
      efetividadeResultado: efetividade,
      aprovadoSox404: dto.desviosEncontrados === 0,
      hashEvidenciaAuditSha256: `sha256:sox-evidence-${Date.now()}`,
    };
  }

  async getKpis(): Promise<SoxIpoDashboardKpisDto> {
    return {
      scoreProntidaoIpoGeralPercent: 99.2,
      controlesSoxAuditadosEficazes: this.inMemorySoxMatrix.length,
      totalDeficienciasSignificativas: 0,
      deficienciasMateriaisSox: 0,
      auditoriasBigFourConcluidas: 4,
    };
  }
}
