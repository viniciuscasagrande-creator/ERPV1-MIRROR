import { Module } from '@nestjs/common';
import { AuditComplianceController } from './audit-compliance.controller';
import { AuditComplianceService } from './audit-compliance.service';
import { PrismaService } from '../../database/prisma.service';

@Module({
  controllers: [AuditComplianceController],
  providers: [AuditComplianceService, PrismaService],
  exports: [AuditComplianceService],
})
export class AuditComplianceModule {}
