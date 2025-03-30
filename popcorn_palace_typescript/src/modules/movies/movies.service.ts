import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Movie } from './entities/movie.entity';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Movie)
    private moviesRepository: Repository<Movie>,
  ) { }

  async create(createMovieDto: CreateMovieDto): Promise<Movie> {
    if (!createMovieDto.title || !createMovieDto.duration) {
      throw new BadRequestException('Title and duration are required');
    }
    const movie = this.moviesRepository.create(createMovieDto);
    return this.moviesRepository.save(movie);
  }

  async update(id: string, updateMovieDto: UpdateMovieDto): Promise<Movie> {
    const movie = await this.moviesRepository.findOneBy({ id });
    if (!movie) {
      throw new NotFoundException('Movie not found');
    }

    const updated = Object.assign(movie, updateMovieDto);
    return this.moviesRepository.save(updated);
  }

  async remove(id: string): Promise<void> {
    const result = await this.moviesRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Movie not found');
    }
  }

  findAll(): Promise<Movie[]> {
    return this.moviesRepository.find();
  }
}
