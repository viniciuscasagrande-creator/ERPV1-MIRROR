import { Module } from '@nestjs/common';
import { SovereignAuditWarRoomService } from './sovereign-audit-war-room.service';
import { SovereignAuditWarRoomController } from './sovereign-audit-war-room.controller';
import { PrismaModule } from '../../database/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SovereignAuditWarRoomController],
  providers: [SovereignAuditWarRoomService],
  exports: [SovereignAuditWarRoomService],
})
export class SovereignAuditWarRoomModule {}
