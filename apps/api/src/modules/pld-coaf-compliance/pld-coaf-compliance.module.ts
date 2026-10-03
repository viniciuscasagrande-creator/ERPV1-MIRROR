import { Module } from '@nestjs/common';
import { PldCoafComplianceService } from './pld-coaf-compliance.service';
import { PldCoafComplianceController } from './pld-coaf-compliance.controller';
import { PrismaModule } from '../../database/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PldCoafComplianceController],
  providers: [PldCoafComplianceService],
  exports: [PldCoafComplianceService],
})
export class PldCoafComplianceModule {}
