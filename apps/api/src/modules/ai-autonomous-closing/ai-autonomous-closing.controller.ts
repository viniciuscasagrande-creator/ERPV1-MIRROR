import {
  Controller,
  Get,
  Post,
  Body,
  Param,
} from '@nestjs/common';
import { AiAutonomousClosingService } from './ai-autonomous-closing.service';
import type {
  ExecutarFechamentoZeroTouchRequestDto,
  ConsultarCfoCopilotRequestDto,
} from '@diskingressos/types';

@Controller('ai-closing')
export class AiAutonomousClosingController {
  constructor(private readonly aiService: AiAutonomousClosingService) {}

  @Get('dashboard')
  async getDashboardKpis() {
    return this.aiService.getDashboardKpis();
  }

  @Get('executions')
  async listarExecucoesFechamento() {
    return this.aiService.listarExecucoesFechamento();
  }

  @Get('executions/:id')
  async obterExecucaoPorId(@Param('id') id: string) {
    return this.aiService.obterExecucaoPorId(id);
  }

  @Post('executions/zero-touch')
  async executarFechamentoZeroTouch(@Body() dto: ExecutarFechamentoZeroTouchRequestDto) {
    return this.aiService.executarFechamentoZeroTouch(dto);
  }

  @Get('agent-logs')
  async listarLogsAgentes() {
    return this.aiService.listarLogsAgentes();
  }

  @Post('cfo-copilot/ask')
  async consultarCfoCopilot(@Body() dto: ConsultarCfoCopilotRequestDto) {
    return this.aiService.consultarCfoCopilot(dto);
  }

  @Get('predictive-insights')
  async listarInsightsPreditivos() {
    return this.aiService.listarInsightsPreditivos();
  }
}
