import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Movie } from '../../movies/entities/movie.entity';
import { ShowtimeSeat } from './Showtime-seat.entity';
import { Min } from 'class-validator';

@Entity()
export class Showtime {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Movie, { eager: true })
  movie: Movie;

  @Column()
  theater: string;

  @Column()
  startTime: Date;

  @Column()
  endTime: Date;

  @Column('decimal')
  @Min(1)
  price: number;

  @OneToMany(() => ShowtimeSeat, (seat) => seat.showtime, { cascade: true })
  seats: ShowtimeSeat[];
}

