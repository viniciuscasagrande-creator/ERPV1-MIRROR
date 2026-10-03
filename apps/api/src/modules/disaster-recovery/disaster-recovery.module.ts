import { Module } from '@nestjs/common';
import { DisasterRecoveryService } from './disaster-recovery.service';
import { DisasterRecoveryController } from './disaster-recovery.controller';

@Module({
  controllers: [DisasterRecoveryController],
  providers: [DisasterRecoveryService],
  exports: [DisasterRecoveryService],
})
export class DisasterRecoveryModule {}
