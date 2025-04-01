import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from './entities/booking.entity';
import { Showtime } from '../showtimes/entities/showtime.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { AppLogger } from '../../common/app.logger';

@Injectable()
export class BookingsService {
  private readonly logger = new AppLogger(BookingsService.name);

  constructor(
    @InjectRepository(Booking)
    private readonly bookingsRepository: Repository<Booking>,

    @InjectRepository(Showtime)
    private readonly showtimeRepository: Repository<Showtime>,
  ) {}

  async create(dto: CreateBookingDto) {
    this.logger.log(`Booking request: ${JSON.stringify(dto)}`);

    const showtime = await this.showtimeRepository.findOne({
      where: { id: dto.showtimeId },
      relations: ['seats'],
    });

    if (!showtime) {
      this.logger.warn(`Showtime not found: ${dto.showtimeId}`);
      throw new NotFoundException('Showtime not found');
    }

    const seat = showtime.seats.find((s) => s.number === dto.seatNumber);

    if (!seat) {
      this.logger.warn(`Seat ${dto.seatNumber} not found in showtime ${dto.showtimeId}`);
      throw new BadRequestException(`Seat ${dto.seatNumber} not found in this showtime`);
    }

    if (!seat.isAvailable) {
      this.logger.warn(`Seat ${dto.seatNumber} is already taken`);
      throw new BadRequestException(`Seat ${dto.seatNumber} is already taken`);
    }

    seat.isAvailable = false;

    const booking = this.bookingsRepository.create({
      showtime,
      seatNumber: dto.seatNumber,
      userId: dto.userId,
    });

    await this.bookingsRepository.save(booking);
    await this.showtimeRepository.save(showtime);

    this.logger.log(`Booking success for seat ${dto.seatNumber}`);

    return {
      success: true,
      bookedSeat: dto.seatNumber,
    };
  }
}
