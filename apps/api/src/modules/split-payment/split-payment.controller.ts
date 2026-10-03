import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SplitPaymentService } from './split-payment.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import {
  PerfilUsuario,
  SimularSplitRequestDto,
  ConfigurarSplitEventoDto,
  CriarSubaccountDto,
  ExecutarEstornoSplitDto,
} from '@diskingressos/types';

@ApiTags('Split de Pagamento Nativo em Gateway & Subadquirência')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('split-payment')
export class SplitPaymentController {
  constructor(private readonly splitService: SplitPaymentService) {}

  @Get('kpis')
  @Roles(
    PerfilUsuario.ADMIN,
    PerfilUsuario.DIRETORIA,
    PerfilUsuario.FINANCEIRO,
    PerfilUsuario.CONTABILIDADE,
  )
  @ApiOperation({ summary: 'Obter indicadores de split nativo, receita própria e volumes liquidados' })
  async getKpis() {
    return this.splitService.getKpis();
  }

  @Get('subaccounts')
  @Roles(
    PerfilUsuario.ADMIN,
    PerfilUsuario.DIRETORIA,
    PerfilUsuario.FINANCEIRO,
    PerfilUsuario.CONTABILIDADE,
    PerfilUsuario.PRODUTOR,
  )
  @ApiOperation({ summary: 'Listar subcontas homologadas nas adquirentes (Cielo/Stone/Rede)' })
  async getSubaccounts(
    @Query('gateway') gateway?: string,
    @Req() req?: any,
  ) {
    const isProdutor = req.user?.roles?.includes(PerfilUsuario.PRODUTOR);
    const producerId = isProdutor ? req.user?.producerId : undefined;
    return this.splitService.getSubaccounts(producerId, gateway);
  }

  @Post('subaccounts')
  @Roles(
    PerfilUsuario.ADMIN,
    PerfilUsuario.DIRETORIA,
    PerfilUsuario.FINANCEIRO,
    PerfilUsuario.PRODUTOR,
  )
  @ApiOperation({ summary: 'Cadastrar nova subconta de produtor para split direto na adquirente' })
  async criarSubaccount(@Body() dto: CriarSubaccountDto, @Req() req: any) {
    const isProdutor = req.user?.roles?.includes(PerfilUsuario.PRODUTOR);
    if (isProdutor && req.user?.producerId) {
      dto.producerId = req.user.producerId;
    }
    return this.splitService.criarSubaccount(dto);
  }

  @Get('configs')
  @Roles(
    PerfilUsuario.ADMIN,
    PerfilUsuario.DIRETORIA,
    PerfilUsuario.FINANCEIRO,
    PerfilUsuario.CONTABILIDADE,
    PerfilUsuario.PRODUTOR,
  )
  @ApiOperation({ summary: 'Listar configurações de split por evento' })
  async getConfigs(
    @Query('eventId') eventId?: string,
    @Req() req?: any,
  ) {
    const isProdutor = req.user?.roles?.includes(PerfilUsuario.PRODUTOR);
    const producerId = isProdutor ? req.user?.producerId : undefined;
    return this.splitService.getSplitConfigs(producerId, eventId);
  }

  @Post('configs')
  @Roles(PerfilUsuario.ADMIN, PerfilUsuario.DIRETORIA, PerfilUsuario.FINANCEIRO)
  @ApiOperation({ summary: 'Definir ou atualizar regras de split de um evento' })
  async salvarConfig(@Body() dto: ConfigurarSplitEventoDto, @Req() req: any) {
    if (!dto.criadoPor && req.user?.nome) {
      dto.criadoPor = req.user.nome;
    }
    return this.splitService.salvarSplitConfig(dto);
  }

  @Post('simular')
  @Roles(
    PerfilUsuario.ADMIN,
    PerfilUsuario.DIRETORIA,
    PerfilUsuario.FINANCEIRO,
    PerfilUsuario.CONTABILIDADE,
    PerfilUsuario.PRODUTOR,
  )
  @ApiOperation({ summary: 'Simular partição de checkout (Produtor vs Disk vs MDR Adquirente)' })
  async simular(@Body() dto: SimularSplitRequestDto) {
    return this.splitService.simularSplit(dto);
  }

  @Get('transactions')
  @Roles(
    PerfilUsuario.ADMIN,
    PerfilUsuario.DIRETORIA,
    PerfilUsuario.FINANCEIRO,
    PerfilUsuario.CONTABILIDADE,
    PerfilUsuario.PRODUTOR,
  )
  @ApiOperation({ summary: 'Consultar histórico de transações com split na raiz da adquirente' })
  async getTransactions(
    @Query('status') status?: string,
    @Query('eventId') eventId?: string,
    @Req() req?: any,
  ) {
    const isProdutor = req.user?.roles?.includes(PerfilUsuario.PRODUTOR);
    const producerId = isProdutor ? req.user?.producerId : undefined;
    return this.splitService.getTransactions(status, eventId, producerId);
  }

  @Post('transactions/:id/estorno')
  @Roles(PerfilUsuario.ADMIN, PerfilUsuario.DIRETORIA, PerfilUsuario.FINANCEIRO)
  @ApiOperation({ summary: 'Executar estorno pro-rata die no split primário' })
  async estornar(
    @Param('id') id: string,
    @Body() dto: ExecutarEstornoSplitDto,
    @Req() req: any,
  ) {
    if (!dto.solicitadoPor && req.user?.nome) {
      dto.solicitadoPor = req.user.nome;
    }
    return this.splitService.executarEstorno(id, dto);
  }
}
