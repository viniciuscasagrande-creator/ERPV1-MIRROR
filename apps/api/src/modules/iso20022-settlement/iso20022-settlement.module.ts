import { Module } from '@nestjs/common';
import { Iso20022SettlementService } from './iso20022-settlement.service';
import { Iso20022SettlementController } from './iso20022-settlement.controller';
import { PrismaModule } from '../../database/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [Iso20022SettlementController],
  providers: [Iso20022SettlementService],
  exports: [Iso20022SettlementService],
})
export class Iso20022SettlementModule {}
