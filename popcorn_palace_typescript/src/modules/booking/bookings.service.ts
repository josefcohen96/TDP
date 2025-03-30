import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Booking } from './entities/booking.entity';
import { Screening } from '../screenings/entities/screening.entity';
import { Seat } from '../halls-seats/entities/seat.entity';
import { CreateBookingDto } from './dto/create-booking.dto';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private bookingsRepo: Repository<Booking>,

    @InjectRepository(Screening)
    private screeningsRepo: Repository<Screening>,

    @InjectRepository(Seat)
    private seatsRepo: Repository<Seat>,
  ) {}

  async create(dto: CreateBookingDto): Promise<Booking[]> {
    const screening = await this.screeningsRepo.findOne({ where: { id: dto.screeningId } });
    if (!screening) throw new BadRequestException('Screening not found');

    const seats = await this.seatsRepo.findBy({ id: In(dto.seatIds) });
    if (seats.length !== dto.seatIds.length) {
      throw new BadRequestException('One or more seats not found');
    }

    const existingBookings = await this.bookingsRepo.find({
      where: {
        screening: { id: dto.screeningId },
        seat: In(dto.seatIds),
      },
    });

    if (existingBookings.length > 0) {
      throw new BadRequestException('Some seats are already booked');
    }

    const newBookings = seats.map((seat) =>
      this.bookingsRepo.create({ screening, seat })
    );

    return this.bookingsRepo.save(newBookings);
  }

  findAll(): Promise<Booking[]> {
    return this.bookingsRepo.find();
  }
}
