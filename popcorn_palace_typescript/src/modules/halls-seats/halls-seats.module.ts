import { Module } from '@nestjs/common';
import { HallsSeatsService } from './halls-seats.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hall } from './entities/hall.entity';
import { Seat } from './entities/seat.entity';
import { HallsSeatsController } from './halls-seats.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Hall, Seat])],
  providers: [HallsSeatsService],
  exports: [HallsSeatsService],
  controllers: [HallsSeatsController],
})
export class HallsSeatsModule {}
