import { Module } from '@nestjs/common';
import { PosCashierService } from './pos-cashier.service';
import { PosCashierController } from './pos-cashier.controller';
import { PrismaModule } from '../../database/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PosCashierController],
  providers: [PosCashierService],
  exports: [PosCashierService],
})
export class PosCashierModule {}
