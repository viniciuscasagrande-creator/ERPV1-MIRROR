import { Module } from '@nestjs/common';
import { GovernanceSodService } from './governance-sod.service';
import { GovernanceSodController } from './governance-sod.controller';

@Module({
  controllers: [GovernanceSodController],
  providers: [GovernanceSodService],
  exports: [GovernanceSodService],
})
export class GovernanceSodModule {}
