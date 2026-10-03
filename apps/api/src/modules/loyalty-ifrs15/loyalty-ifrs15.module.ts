import { Module } from '@nestjs/common';
import { LoyaltyIfrs15Service } from './loyalty-ifrs15.service';
import { LoyaltyIfrs15Controller } from './loyalty-ifrs15.controller';
import { PrismaModule } from '../../database/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [LoyaltyIfrs15Controller],
  providers: [LoyaltyIfrs15Service],
  exports: [LoyaltyIfrs15Service],
})
export class LoyaltyIfrs15Module {}
