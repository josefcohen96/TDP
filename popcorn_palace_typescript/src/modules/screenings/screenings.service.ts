import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Screening } from './entities/screening.entity';
import { Movie } from '../movies/entities/movie.entity';
import { CreateScreeningDto } from './dto/create-screening.dto';
import { getHallLayout } from '../../config/load-halls';
import { ScreeningSeat } from './entities/screening-seat.entity';
import { UpdateScreeningDto } from './dto/update-screening.dto';
import { AppLogger } from '../../common/app.logger';
import e from 'express';

@Injectable()
export class ScreeningsService {
  private readonly logger = new AppLogger(ScreeningsService.name);
  constructor(
    @InjectRepository(Screening)
    private screeningsRepository: Repository<Screening>,
    @InjectRepository(Movie)
    private moviesRepository: Repository<Movie>,
    @InjectRepository(ScreeningSeat)
    private screeningSeatsRepository: Repository<ScreeningSeat>,
  ) { }

  async create(dto: CreateScreeningDto): Promise<Screening> {
    const { movieId, hallName, startTime, price, endTime } = dto;
    this.logger.log(`Creating screening: ${JSON.stringify(dto)}`);
    const movie = await this.moviesRepository.findOneBy({ id: movieId });
    if (!movie) throw new BadRequestException('Movie not found');

    const layout = getHallLayout(hallName);
    if (!layout) {
      this.logger.warn(`Hall not found: ${hallName}`);
      throw new NotFoundException('Hall not found');
    }
    const start = new Date(startTime);
    let end: Date;

    if (endTime) {
      end = new Date(endTime); // Use the provided endTime
      if (end <= start) {
        this.logger.warn(`End time must be after start time: ${startTime} - ${endTime}`);
        throw new BadRequestException('End time must be after start time');
      }
    } else {
      const durationInMs = movie.duration * 60 * 1000; // Convert minutes to milliseconds
      end = new Date(start.getTime() + durationInMs); // Calculate endTime based on movie duration
    }

    const conflict = await this.screeningsRepository.findOne({
      where: { hallName, startTime: start },
    });
    if (conflict) {
      this.logger.warn(`Screening conflict: ${JSON.stringify(conflict)}`);
      throw new BadRequestException('Screening already exists at this time in this hall');
    }

    const screening = this.screeningsRepository.create({
      movie,
      hallName,
      startTime: start,
      endTime: end,
      price,
    });

    const savedScreening = await this.screeningsRepository.save(screening);
    this.logger.log(`Screening created: ${JSON.stringify(savedScreening)}`);
    const screeningSeats: ScreeningSeat[] = [];
    for (const row of layout.layout) {
      for (let i = 1; i <= row.length; i++) {
        const seatName = `${row.row}${i}`;
        screeningSeats.push(this.screeningSeatsRepository.create({
          screening: savedScreening,
          seatName,
          isAvailable: true,
        }));
      }
    }

    await this.screeningSeatsRepository.save(screeningSeats);
    this.logger.log(`Screening seats created: ${JSON.stringify(screeningSeats)}`);
    return savedScreening;
  }

  async update(id: string, dto: UpdateScreeningDto): Promise<Screening> {
    const screening = await this.screeningsRepository.findOne({ where: { id } });
    if (!screening) {
      this.logger.warn(`Update failed: Screening not found (ID: ${id})`);
      throw new NotFoundException('Screening not found');
    }
    if (dto.startTime) {
      const movie = screening.movie;
      const start = new Date(dto.startTime);
      screening.startTime = start;
      screening.endTime = new Date(start.getTime() + movie.duration * 60000);
    }

    if (dto.hallName) {
      const layout = getHallLayout(dto.hallName);
      if (!layout) {
        this.logger.warn(`Hall not found: ${dto.hallName}`);
        throw new NotFoundException('Hall not found');
      }
      screening.hallName = dto.hallName;
    }

    if (dto.price !== undefined) {
      if (dto.price < 0) {
        this.logger.warn(`Price must be a positive number: ${dto.price}`);
        throw new BadRequestException('Price must be a positive number');
      }
      screening.price = dto.price;
    }
    this.logger.log(`Updating screening: ${JSON.stringify(screening)}`);
    return this.screeningsRepository.save(screening);
  }

  async remove(id: string): Promise<void> {
    const result = await this.screeningsRepository.delete(id);
    this.logger.log(`Removing screening with ID: ${id}`);
    if (result.affected === 0) {
      this.logger.warn(`Remove failed: Screening not found (ID: ${id})`);
      throw new NotFoundException('Screening not found');
    }
  }

  async findOne(id: string): Promise<Screening> {
    const screening = await this.screeningsRepository.findOne({ where: { id } });
    if (!screening) {
      this.logger.warn(`Screening not found: ${id}`);
      throw new NotFoundException('Screening not found');
    }
    this.logger.log(`Found screening: ${JSON.stringify(screening)}`);
    return screening;
  }

  findAll(): Promise<Screening[]> {
    return this.screeningsRepository.find();
  }

}
