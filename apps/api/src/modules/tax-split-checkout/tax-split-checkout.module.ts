import { Module } from '@nestjs/common';
import { TaxSplitCheckoutService } from './tax-split-checkout.service';
import { TaxSplitCheckoutController } from './tax-split-checkout.controller';

@Module({
  controllers: [TaxSplitCheckoutController],
  providers: [TaxSplitCheckoutService],
  exports: [TaxSplitCheckoutService],
})
export class TaxSplitCheckoutModule {}
