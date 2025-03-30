import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Screening } from './entities/screening.entity';
import { Movie } from '../movies/entities/movie.entity';

@Injectable()
export class ScreeningsService {
  constructor(
    @InjectRepository(Screening)
    private screeningsRepository: Repository<Screening>,
    @InjectRepository(Movie)
    private moviesRepository: Repository<Movie>,
  ) {}

  async create(movieId: string, hall: string, startTime: Date, price: number): Promise<Screening> {
    console.log(`Creating a screening for movieId: ${movieId}, hall: ${hall}, startTime: ${startTime}`);

    const movie = await this.moviesRepository.findOneBy({ id: movieId });
    console.log(`Movie fetched: ${movie ? JSON.stringify(movie) : 'Movie not found'}`);

    if (!movie) {
      console.error('Movie not found');
      throw new BadRequestException('Movie not found');
    }

    const endTime = new Date(startTime.getTime() + movie.duration * 60000);
    console.log(`Calculated endTime: ${endTime}`);

    // בדיקת כפילות
    const conflictingScreening = await this.screeningsRepository.findOne({
      where: {
        hall,
        startTime,
      },
    });
    console.log(`Conflicting screening: ${conflictingScreening ? JSON.stringify(conflictingScreening) : 'None'}`);

    if (conflictingScreening) {
      console.error('Screening conflict at the same time.');
      throw new BadRequestException('Screening conflict at the same time.');
    }

    const screening = this.screeningsRepository.create({ movie, hall, startTime, endTime, price });
    console.log(`Screening created: ${JSON.stringify(screening)}`);

    const savedScreening = await this.screeningsRepository.save(screening);
    console.log(`Screening saved: ${JSON.stringify(savedScreening)}`);

    return savedScreening;
  }

  findAll(): Promise<Screening[]> {
    return this.screeningsRepository.find();
  }
}