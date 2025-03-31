import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from './entities/booking.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { Screening } from '../screenings/entities/screening.entity';
import { ScreeningSeat } from '../screenings/entities/screening-seat.entity';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingsRepository: Repository<Booking>,

    @InjectRepository(Screening)
    private readonly screeningsRepository: Repository<Screening>,

    @InjectRepository(ScreeningSeat)
    private readonly screeningSeatsRepository: Repository<ScreeningSeat>
  ) {}

  async create(dto: CreateBookingDto): Promise<{ success: boolean; bookedSeats?: string[]; unavailableSeats?: string[] }> {
    const { screeningId, seats } = dto;

    const screening = await this.screeningsRepository.findOne({ where: { id: screeningId } });
    if (!screening) throw new NotFoundException('Screening not found');

    // שלוף את הכיסאות הנבחרים מההקרנה
    const seatRecords = await this.screeningSeatsRepository.find({
      where: seats.map(seatName => ({ screening: { id: screeningId }, seatName }))
    });

    // מצא כיסאות תפוסים
    const unavailable = seatRecords.filter(seat => !seat.isAvailable).map(seat => seat.seatName);
    if (unavailable.length > 0) {
      return { success: false, unavailableSeats: unavailable };
    }

    // עדכן כיסאות ל-isAvailable = false
    for (const seat of seatRecords) {
      seat.isAvailable = false;
    }
    await this.screeningSeatsRepository.save(seatRecords);

    // צור את ההזמנה
    const booking = this.bookingsRepository.create({ screening, seatNames: seats });
    await this.bookingsRepository.save(booking);

    return { success: true, bookedSeats: seats };
  }
}
