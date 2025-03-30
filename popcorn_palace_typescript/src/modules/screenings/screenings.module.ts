import { Module } from '@nestjs/common';
import { ScreeningsController } from './screenings.controller';
import { ScreeningsService } from './screenings.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Screening } from './entities/screening.entity';
import { Movie } from '../movies/entities/movie.entity';
import { Hall } from '../halls-seats/entities/hall.entity'; 
@Module({
  imports: [TypeOrmModule.forFeature([Screening, Movie, Hall])],
  controllers: [ScreeningsController],
  providers: [ScreeningsService],
})
export class ScreeningsModule {}
