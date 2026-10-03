import {
  Controller,
  Get,
  Post,
  Body,
  Param,
} from '@nestjs/common';
import { ExecutiveBoardroomService } from './executive-boardroom.service';
import type { GerarPacoteDfpRequestDto } from '@diskingressos/types';

@Controller('executive-boardroom')
export class ExecutiveBoardroomController {
  constructor(private readonly service: ExecutiveBoardroomService) {}

  @Get('kpis')
  async getBoardroomKpis() {
    return this.service.getBoardroomKpis();
  }

  @Get('telemetry')
  async getLiveTelemetry() {
    return this.service.getLiveTelemetry();
  }

  @Get('dfp-packages')
  async listarPacotesDfp() {
    return this.service.listarPacotesDfp();
  }

  @Get('dfp-packages/:id')
  async obterPacoteDfpPorId(@Param('id') id: string) {
    return this.service.obterPacoteDfpPorId(id);
  }

  @Post('dfp-packages/generate')
  async gerarPacoteDfp(@Body() dto: GerarPacoteDfpRequestDto) {
    return this.service.gerarPacoteDfp(dto);
  }

  @Get('risk-matrix')
  async listarRiscosCorporativos() {
    return this.service.listarRiscosCorporativos();
  }
}
