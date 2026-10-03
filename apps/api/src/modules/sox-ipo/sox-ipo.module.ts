import { Module } from '@nestjs/common';
import { PrismaModule } from '../../database/prisma.module';
import { SoxIpoService } from './sox-ipo.service';
import { SoxIpoController } from './sox-ipo.controller';

@Module({
  imports: [PrismaModule],
  controllers: [SoxIpoController],
  providers: [SoxIpoService],
  exports: [SoxIpoService],
})
export class SoxIpoModule {}
