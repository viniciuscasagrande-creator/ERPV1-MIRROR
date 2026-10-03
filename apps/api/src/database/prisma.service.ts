import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);
  private static connectionAttempted = false;

  async onModuleInit() {
    if (PrismaService.connectionAttempted) return;
    PrismaService.connectionAttempted = true;
    try {
      await this.$connect();
      this.logger.log('📦 Conexão com banco de dados estabelecida com sucesso.');
    } catch (error) {
      this.logger.warn(`⚠️ Não foi possível conectar ao banco de dados no boot: ${error.message}`);
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log('📦 Conexão com banco de dados encerrada.');
  }
}
