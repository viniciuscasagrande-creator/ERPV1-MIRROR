import { Module } from '@nestjs/common';
import { PrismaModule } from '../../database/prisma.module';
import { DebtRecoveryService } from './debt-recovery.service';
import { DebtRecoveryController } from './debt-recovery.controller';

@Module({
  imports: [PrismaModule],
  controllers: [DebtRecoveryController],
  providers: [DebtRecoveryService],
  exports: [DebtRecoveryService],
})
export class DebtRecoveryModule {}
