import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Movie } from './entities/movie.entity';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { AppLogger } from '../../common/app.logger';

@Injectable()
export class MoviesService {
  private readonly logger = new AppLogger(MoviesService.name);
  constructor(
    @InjectRepository(Movie)
    private moviesRepository: Repository<Movie>,
  ) { }

  async create(createMovieDto: CreateMovieDto): Promise<Movie> {

    this.logger.log(`Creating movie: ${JSON.stringify(createMovieDto)}`);

    if (!createMovieDto.title || !createMovieDto.duration) {
      this.logger.warn('Create failed: Missing title or duration');
      throw new BadRequestException('Title and duration are required');
    }

    const movie = this.moviesRepository.create(createMovieDto);
    this.logger.log(`Movie created: ${JSON.stringify(movie)}`);

    return this.moviesRepository.save(movie);
  }

  async update(id: string, updateMovieDto: UpdateMovieDto): Promise<Movie> {

    const movie = await this.moviesRepository.findOneBy({ id });
    if (!movie) {
      this.logger.warn(`Update failed: Movie not found (ID: ${id})`);
      throw new NotFoundException('Movie not found');
    }

    const updated = Object.assign(movie, updateMovieDto);
    this.logger.log(`Updating movie: ${JSON.stringify(updated)}`);

    return this.moviesRepository.save(updated);
  }

  async remove(id: string): Promise<void> {

    this.logger.log(`Removing movie with ID: ${id}`);
    const result = await this.moviesRepository.delete(id);
    if (result.affected === 0) {
      this.logger.warn(`Remove failed: Movie not found (ID: ${id})`);
      throw new NotFoundException('Movie not found');
    }

    this.logger.log(`Movie removed: ${id}`);
  }

  findAll(): Promise<Movie[]> {
    return this.moviesRepository.find();
  }
}
