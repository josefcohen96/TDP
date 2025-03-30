import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hall } from './entities/hall.entity';
import { Seat } from './entities/seat.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Hall, Seat])],
})
export class HallsSeatsModule {}
