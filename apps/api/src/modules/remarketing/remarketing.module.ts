import { Module } from '@nestjs/common';
import { RemarketingService } from './remarketing.service';
import { RemarketingController } from './remarketing.controller';
import { PrismaModule } from '../../database/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [RemarketingController],
  providers: [RemarketingService],
  exports: [RemarketingService],
})
export class RemarketingModule {}
