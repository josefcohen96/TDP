import { Module } from '@nestjs/common';
import { ShowtimesController } from './showtime.controller';
import { ShowtimesService } from './showtime.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Showtime } from './entities/showtime.entity';
import { Movie } from '../movies/entities/movie.entity';
import { ShowtimeSeat } from './entities/Showtime-seat.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Showtime, Movie, ShowtimeSeat])],
  controllers: [ShowtimesController],
  providers: [ShowtimesService],
})
export class ShowtimeModule { }
