import { Module } from '@nestjs/common';
import { SplitPaymentService } from './split-payment.service';
import { SplitPaymentController } from './split-payment.controller';

@Module({
  controllers: [SplitPaymentController],
  providers: [SplitPaymentService],
  exports: [SplitPaymentService],
})
export class SplitPaymentModule {}
