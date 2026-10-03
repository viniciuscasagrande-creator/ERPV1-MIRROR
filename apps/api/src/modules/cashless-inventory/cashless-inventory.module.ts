import { Module } from '@nestjs/common';
import { PrismaModule } from '../../database/prisma.module';
import { CashlessInventoryService } from './cashless-inventory.service';
import { CashlessInventoryController } from './cashless-inventory.controller';

@Module({
  imports: [PrismaModule],
  controllers: [CashlessInventoryController],
  providers: [CashlessInventoryService],
  exports: [CashlessInventoryService],
})
export class CashlessInventoryModule {}
