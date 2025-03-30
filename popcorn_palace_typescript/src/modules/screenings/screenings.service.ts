import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Screening } from './entities/screening.entity';
import { Movie } from '../movies/entities/movie.entity';
import { Hall } from '../halls-seats/entities/hall.entity';
import { CreateScreeningDto } from './dto/create-screening.dto';

@Injectable()
export class ScreeningsService {
  constructor(
    @InjectRepository(Screening)
    private screeningsRepository: Repository<Screening>,
    @InjectRepository(Movie)
    private moviesRepository: Repository<Movie>,
    @InjectRepository(Hall)
    private hallsRepository: Repository<Hall>,
  ) { }

  async create(
    createDto: CreateScreeningDto,
  ): Promise<Screening> {
    const { movieId, hallId, startTime, price } = createDto;

    const movie = await this.moviesRepository.findOneBy({ id: movieId });
    if (!movie) {
      throw new NotFoundException('Movie not found');
    }

    const hall = await this.hallsRepository.findOne({where: { id: hallId },});
    if (!hall) {
      throw new NotFoundException('Hall not found');
    }

    const start = new Date(startTime);
    const end = new Date(start.getTime() + movie.duration * 60000);

    const overlapping = await this.screeningsRepository
      .createQueryBuilder('screening')
      .leftJoin('screening.hall', 'hall')
      .where('hall.id = :hallId', { hallId })
      .andWhere(
        '(screening.startTime < :endTime AND screening.endTime > :startTime)',
        { startTime: start, endTime: end },
      )
      .getOne();

    if (overlapping) {
      throw new BadRequestException(
        'There is already a screening in this hall at this time.',
      );
    }

    const screening = this.screeningsRepository.create({
      movie,
      hall,
      startTime: start,
      endTime: end,
      price,
    });

    return this.screeningsRepository.save(screening);
  }
}
