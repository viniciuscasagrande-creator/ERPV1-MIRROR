import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ProducerHubService } from './producer-hub.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { PerfilUsuario } from '@diskingressos/types';

@ApiTags('Hub 360° de Gestão de Produtores (DiskIngressos)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('producer-hub')
export class ProducerHubController {
  constructor(private readonly producerHubService: ProducerHubService) {}

  @Get('overview')
  @Roles(PerfilUsuario.ADMIN, PerfilUsuario.DIRETORIA, PerfilUsuario.FINANCEIRO, PerfilUsuario.PRODUTOR)
  @ApiOperation({ summary: 'Visão consolidada 360° dos produtores conveniados' })
  async get360Overview(@Query('producerId') producerId?: string) {
    return this.producerHubService.get360Overview(producerId);
  }

  @Get('contracts')
  @Roles(PerfilUsuario.ADMIN, PerfilUsuario.DIRETORIA, PerfilUsuario.FINANCEIRO)
  @ApiOperation({ summary: 'Contratos comerciais, alçadas e taxas dos produtores' })
  async getContracts() {
    return this.producerHubService.getContracts();
  }

  @Get('escrow-ledger')
  @Roles(PerfilUsuario.ADMIN, PerfilUsuario.DIRETORIA, PerfilUsuario.FINANCEIRO, PerfilUsuario.CONTABILIDADE)
  @ApiOperation({ summary: 'Livro razão de conta garantia / escrow fiduciário' })
  async getEscrowLedger(@Query('producerId') producerId?: string) {
    return this.producerHubService.getEscrowLedger(producerId);
  }

  @Post('simulate-advance')
  @Roles(PerfilUsuario.ADMIN, PerfilUsuario.DIRETORIA, PerfilUsuario.FINANCEIRO, PerfilUsuario.PRODUTOR)
  @ApiOperation({ summary: 'Simulação de antecipação de recebíveis de bilheteria' })
  async simulateAdvance(
    @Body() body: { producerId: string; valorSolicitado: number; prazoDias: number },
  ) {
    return this.producerHubService.simulateAdvance(
      body.producerId,
      body.valorSolicitado,
      body.prazoDias,
    );
  }

  @Post('request-advance')
  @Roles(PerfilUsuario.ADMIN, PerfilUsuario.DIRETORIA, PerfilUsuario.FINANCEIRO)
  @ApiOperation({ summary: 'Homologação e gravação de trava registradora CERC/B3 de adiantamento' })
  async requestAdvance(
    @Body()
    body: {
      producerId: string;
      valorSolicitado: number;
      prazoDias: number;
      justificativa: string;
    },
  ) {
    return this.producerHubService.requestAdvance(body);
  }
}
