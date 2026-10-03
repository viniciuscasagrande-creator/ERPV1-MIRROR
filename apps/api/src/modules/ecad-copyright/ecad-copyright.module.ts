import { Module } from '@nestjs/common';
import { EcadCopyrightService } from './ecad-copyright.service';
import { EcadCopyrightController } from './ecad-copyright.controller';
import { PrismaModule } from '../../database/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [EcadCopyrightController],
  providers: [EcadCopyrightService],
  exports: [EcadCopyrightService],
})
export class EcadCopyrightModule {}
