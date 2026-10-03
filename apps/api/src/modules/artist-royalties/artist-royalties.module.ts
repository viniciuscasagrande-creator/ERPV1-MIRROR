import { Module } from '@nestjs/common';
import { ArtistRoyaltiesService } from './artist-royalties.service';
import { ArtistRoyaltiesController } from './artist-royalties.controller';
import { PrismaModule } from '../../database/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ArtistRoyaltiesController],
  providers: [ArtistRoyaltiesService],
  exports: [ArtistRoyaltiesService],
})
export class ArtistRoyaltiesModule {}
