import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Hall } from './entities/hall.entity';
import { Seat } from './entities/seat.entity';

@Injectable()
export class HallsSeatsService {
  constructor(
    @InjectRepository(Hall)
    private hallRepository: Repository<Hall>,
    @InjectRepository(Seat)
    private seatRepository: Repository<Seat>,
  ) {}

  createHall(name: string, rows: string[], seatsPerRow: number): Promise<Hall> {
    const seats: Seat[] = [];

    rows.forEach(row => {
      for (let i = 1; i <= seatsPerRow; i++) {
        seats.push(this.seatRepository.create({ row, number: i }));
      }
    });

    const hall = this.hallRepository.create({
      name,
      capacity: seats.length,
      seats,
    });

    return this.hallRepository.save(hall);
  }

  getSeatsByHall(hallId: string): Promise<Seat[]> {
    return this.seatRepository.find({
      where: { hall: { id: hallId } },
      relations: ['hall'],
    });
  }
}
