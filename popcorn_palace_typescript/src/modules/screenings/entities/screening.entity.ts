// screening.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Movie } from '../../movies/entities/movie.entity';
import { Hall } from '../../halls-seats/entities/hall.entity'; // ודא שיש לך קובץ כזה

@Entity()
export class Screening {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Movie, { eager: true })
  @JoinColumn({ name: 'movie_id' })
  movie: Movie;

  @ManyToOne(() => Hall, { eager: true })
  @JoinColumn({ name: 'hall_id' })
  hall: Hall;

  @Column({ type: 'timestamp' })
  startTime: Date;

  @Column({ type: 'timestamp' })
  endTime: Date;

  @Column({ type: 'float' })
  price: number; // price of the screening in dollars
}
