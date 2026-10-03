import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CreateNotificationDto } from '@diskingressos/types';

@ApiTags('Notificações em Tempo Real & Alertas')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar notificações do usuário ou produtor autenticado' })
  async getNotifications(
    @Req() req: any,
    @Query('unreadOnly') unreadOnly?: string,
  ) {
    const user = req.user;
    return this.notificationsService.findAll({
      userId: user?.id,
      producerId: user?.producerId,
      unreadOnly: unreadOnly === 'true',
    });
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Marcar notificação individual como lida' })
  async markAsRead(@Param('id') id: string) {
    return this.notificationsService.markAsRead(id);
  }

  @Post('read-all')
  @ApiOperation({ summary: 'Marcar todas as notificações como lidas' })
  async markAllAsRead(@Req() req: any) {
    const user = req.user;
    return this.notificationsService.markAllAsRead(user?.id);
  }

  @Post()
  @ApiOperation({ summary: 'Criar ou emitir nova notificação / alerta' })
  async createNotification(@Body() body: CreateNotificationDto) {
    return this.notificationsService.create(body);
  }
}
