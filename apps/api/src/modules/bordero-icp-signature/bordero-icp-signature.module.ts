import { Module } from '@nestjs/common';
import { BorderoIcpSignatureService } from './bordero-icp-signature.service';
import { BorderoIcpSignatureController } from './bordero-icp-signature.controller';
import { PrismaModule } from '../../database/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [BorderoIcpSignatureController],
  providers: [BorderoIcpSignatureService],
  exports: [BorderoIcpSignatureService],
})
export class BorderoIcpSignatureModule {}
