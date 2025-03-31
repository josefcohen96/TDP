import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { Booking } from './entities/booking.entity';
import { Screening } from '../screenings/entities/screening.entity';
import { ScreeningSeat } from '../screenings/entities/screening-seat.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([Booking, Screening, ScreeningSeat])
  ],
  providers: [BookingsService],
  controllers: [BookingsController],
})
export class BookingsModule {}