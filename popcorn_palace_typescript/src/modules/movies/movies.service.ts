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

    const movieExists = await this.moviesRepository.findOneBy({ title: createMovieDto.title });

    if (movieExists) {
      this.logger.warn('Create failed: Movie already exists');
      throw new BadRequestException('Movie already exists');
    }
    const movie = this.moviesRepository.create(createMovieDto);
    this.logger.log(`Movie created: ${JSON.stringify(movie)}`);

    return this.moviesRepository.save(movie);
  }

  async update(title: string, updateMovieDto: UpdateMovieDto): Promise<Movie> {
    const movie = await this.moviesRepository.findOneBy({ title });
  
    if (!movie) {
      this.logger.warn(`Update failed: Movie with title "${title}" not found`);
      throw new NotFoundException('Movie not found');
    }
  
    const updatedMovie = Object.assign(movie, updateMovieDto);
    this.logger.log(`Movie "${title}" updated: ${JSON.stringify(updateMovieDto)}`);
  
    return this.moviesRepository.save(updatedMovie);
  }

  async remove(title: string): Promise<void> {
    const result = await this.moviesRepository.delete({ title });
  
    if (result.affected === 0) {
      this.logger.warn(`Delete failed: Movie with title "${title}" not found`);
      throw new NotFoundException('Movie not found');
    }
  
    this.logger.log(`Movie "${title}" deleted`);
  }

  findAll(): Promise<Movie[]> {
    return this.moviesRepository.find();
  }
}
