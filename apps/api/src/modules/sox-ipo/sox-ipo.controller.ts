import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { SoxIpoService } from './sox-ipo.service';
import type {
  SoxInternalControlMatrixDto,
  AuditCommitteeReviewDossierDto,
  IpoDualListingReadinessEvaluationDto,
  SoxIpoDashboardKpisDto,
  TestarControleSoxRequestDto,
  TestarControleSoxResponseDto,
} from '@diskingressos/types';

@ApiTags('Fase 50 - Governança SOX 404, PCAOB & IPO Dual-Listing')
@Controller('api/v1/sox-ipo')
export class SoxIpoController {
  constructor(private readonly service: SoxIpoService) {}

  @Get('sox-matrix')
  @ApiOperation({ summary: 'Listar matriz de controles internos SOX 404' })
  async getSoxMatrix(): Promise<SoxInternalControlMatrixDto[]> {
    return this.service.getSoxMatrix();
  }

  @Get('committee-dossiers')
  @ApiOperation({ summary: 'Listar atas e pareceres do Comitê de Auditoria Independente' })
  async getCommitteeDossiers(): Promise<AuditCommitteeReviewDossierDto[]> {
    return this.service.getCommitteeDossiers();
  }

  @Get('readiness')
  @ApiOperation({ summary: 'Obter avaliação de prontidão para IPO B3 e Dual-Listing SEC/NYSE' })
  async getReadiness(): Promise<IpoDualListingReadinessEvaluationDto[]> {
    return this.service.getReadiness();
  }

  @Post('test-control')
  @ApiOperation({ summary: 'Executar teste de controle interno SOX 404' })
  async testarControleSox(@Body() dto: TestarControleSoxRequestDto): Promise<TestarControleSoxResponseDto> {
    return this.service.testarControleSox(dto);
  }

  @Get('kpis')
  @ApiOperation({ summary: 'KPIs do dashboard de governança SOX 404 e prontidão para IPO' })
  async getKpis(): Promise<SoxIpoDashboardKpisDto> {
    return this.service.getKpis();
  }
}
