import { Module } from '@nestjs/common';
import { AiBankReconciliationService } from './ai-bank-reconciliation.service';
import { AiBankReconciliationController } from './ai-bank-reconciliation.controller';

@Module({
  controllers: [AiBankReconciliationController],
  providers: [AiBankReconciliationService],
  exports: [AiBankReconciliationService],
})
export class AiBankReconciliationModule {}
