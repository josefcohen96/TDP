import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from './entities/booking.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { Screening } from '../screenings/entities/screening.entity';
import { ScreeningSeat } from '../screenings/entities/screening-seat.entity';
import { AppLogger } from '../../common/app.logger';

@Injectable()
export class BookingsService {
  private readonly logger = new AppLogger(BookingsService.name);

  constructor(
    @InjectRepository(Booking)
    private readonly bookingsRepository: Repository<Booking>,

    @InjectRepository(Screening)
    private readonly screeningsRepository: Repository<Screening>,

    @InjectRepository(ScreeningSeat)
    private readonly screeningSeatsRepository: Repository<ScreeningSeat>
  ) { }

  async create(dto: CreateBookingDto): Promise<{
    success: boolean;
    bookedSeats?: string[];
    unavailableSeats?: string[];
    notInRange?: string[];
  }> {

    const { screeningId, seats } = dto;
    this.logger.log(`Creating booking for screeningId=${screeningId} and seats=${seats.join(',')}`);

    const screening = await this.screeningsRepository.findOne({ where: { id: screeningId } });
    if (!screening) {
      this.logger.warn(`Screening not found: ${screeningId}`);
      throw new NotFoundException('Screening not found');
    }


    const seatRecords = await this.screeningSeatsRepository.find({
      where: seats.map(seatName => ({ screening: { id: screeningId }, seatName }))
    });

    const foundSeatNames = seatRecords.map(seat => seat.seatName);
    const notInRange = seats.filter(seat => !foundSeatNames.includes(seat));
    if (notInRange.length > 0) {
      this.logger.warn(`Seats not in range: ${notInRange.join(',')}`);
      return { success: false, notInRange };
    }

    const unavailable = seatRecords.filter(seat => !seat.isAvailable).map(seat => seat.seatName);
    if (unavailable.length > 0) {
      this.logger.warn(`Seats unavailable: ${unavailable.join(',')}`);
      return { success: false, unavailableSeats: unavailable };
    }

    for (const seat of seatRecords) {
      seat.isAvailable = false;
    }
    await this.screeningSeatsRepository.save(seatRecords);

    const booking = this.bookingsRepository.create({ screening, seatNames: seats });
    await this.bookingsRepository.save(booking);

    this.logger.log(`Booking successful for seats: ${seats.join(',')}`);

    return { success: true, bookedSeats: seats };
  }
}
