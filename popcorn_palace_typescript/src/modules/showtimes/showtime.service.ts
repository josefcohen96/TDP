import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Showtime } from './entities/showtime.entity';
import { CreateShowtimeDto } from './dto/create-showtime.dto';
import { UpdateShowtimeDto } from './dto/update-showtime.dto';
import { AppLogger } from '../../common/app.logger';
import { Movie } from '../movies/entities/movie.entity';
import { ShowtimeSeat } from './entities/showtime-seat.entity';
import { getHallLayout } from '../../config/load-halls';

@Injectable()
export class ShowtimesService {
  private readonly logger = new AppLogger(ShowtimesService.name);

  constructor(
    @InjectRepository(Showtime)
    private readonly showtimesRepository: Repository<Showtime>,

    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,

    @InjectRepository(ShowtimeSeat)
    private readonly seatsRepository: Repository<ShowtimeSeat>,
  ) { }

  async create(dto: CreateShowtimeDto): Promise<Showtime> {
    if (dto.price <= 0) {
      this.logger.warn(`Invalid price: ${dto.price}`);
      throw new BadRequestException('Price must be greater than 0');
    }
    this.logger.log(`Creating showtime: ${JSON.stringify(dto)}`);

    const movie = await this.movieRepository.findOne({ where: { id: dto.movieId } });
    if (!movie) {
      this.logger.warn(`Movie not found: ${dto.movieId}`);
      throw new BadRequestException('Movie not found');
    }

    if (dto.endTime < dto.startTime) {
      this.logger.warn(`Invalid time range: endTime is before startTime`);
      throw new BadRequestException('End time must be after start time');
    }

    const conflict = await this.showtimesRepository.createQueryBuilder('s')
      .where('s.theater = :theater', { theater: dto.theater })
      .andWhere('s.startTime < :endTime AND s.endTime > :startTime', {
        startTime: dto.startTime,
        endTime: dto.endTime,
      })
      .getOne();

    if (conflict) {
      this.logger.warn(`Conflict in theater ${dto.theater} at ${dto.startTime}`);
      throw new BadRequestException('Time conflict: another showtime exists in this theater');
    }

    const hall = getHallLayout(dto.theater);
    if (!hall) {
      throw new NotFoundException(`Hall ${dto.theater} not found`);
    }

    const showtime = this.showtimesRepository.create({ ...dto });
    await this.showtimesRepository.save(showtime);

    const seats = hall.layout.map((seat) =>
      this.seatsRepository.create({
        number: seat.number,
        showtime,
        isAvailable: true,
      })
    );

    await this.seatsRepository.save(seats);
    this.logger.log(`Showtime created: ${JSON.stringify(showtime)} with ${seats.length} seats`);
    return showtime;
  }

  async update(id: string, dto: UpdateShowtimeDto): Promise<Showtime> {

    if (dto.movieId) {
      const movie = await this.movieRepository.findOne({ where: { id: dto.movieId } });
      if (!movie) {
        this.logger.warn(`Movie not found: ${dto.movieId}`);
        throw new BadRequestException('Movie not found');
      }
    }

    if (dto.price <= 0) {
      this.logger.warn(`Invalid price: ${dto.price}`);
      throw new BadRequestException('Price must be greater than 0');
    }

    const existing = await this.showtimesRepository.findOne({ where: { id } });
    if (!existing) {
      throw new NotFoundException('Showtime not found');
    }

    const startTime = dto.startTime ?? existing.startTime;
    const endTime = dto.endTime ?? existing.endTime ?? new Date(new Date(startTime).getTime() + 1000 * 60 * 90);
    const theater = dto.theater ?? existing.theater;

    if (dto.startTime && dto.endTime && dto.endTime < dto.startTime) {
      this.logger.warn(`Invalid time range on update: endTime is before startTime`);
      throw new BadRequestException('End time must be after start time');
    }

    const overlapping = await this.showtimesRepository
      .createQueryBuilder('s')
      .where('s.id != :id', { id })
      .andWhere('s.theater = :theater', { theater })
      .andWhere('s.startTime < :endTime AND s.endTime > :startTime', { startTime, endTime })
      .getOne();

    if (overlapping) {
      this.logger.warn(`Conflict in theater ${theater} at ${startTime}`);
      throw new BadRequestException('Time conflict: another showtime already exists in this theater');
    }

    Object.assign(existing, dto);
    this.logger.log(`Showtime ${id} updated`);
    return this.showtimesRepository.save(existing);
  }

  async findOne(id: string): Promise<Showtime> {
    const showtime = await this.showtimesRepository.findOne({ where: { id } });
    if (!showtime) {
      this.logger.warn(`Showtime ${id} not found`);
      throw new NotFoundException('Showtime not found');
    }
    return showtime;
  }

  async remove(id: string): Promise<void> {
  
    const result = await this.showtimesRepository.delete(id);
    if (result.affected === 0) {
      this.logger.warn(`Delete failed: Showtime ${id} not found`);
      throw new NotFoundException('Showtime not found');
    }
    this.logger.log(`Showtime ${id} deleted`);
  }

  async findAll(): Promise<Showtime[]> {
    return this.showtimesRepository.find();
  }
}
