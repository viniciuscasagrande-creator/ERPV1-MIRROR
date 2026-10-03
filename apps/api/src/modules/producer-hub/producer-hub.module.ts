import { Module } from '@nestjs/common';
import { ProducerHubService } from './producer-hub.service';
import { ProducerHubController } from './producer-hub.controller';
import { PrismaModule } from '../../database/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ProducerHubController],
  providers: [ProducerHubService],
  exports: [ProducerHubService],
})
export class ProducerHubModule {}
