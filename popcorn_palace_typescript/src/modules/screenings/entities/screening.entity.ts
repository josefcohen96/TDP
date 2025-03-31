import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Movie } from '../../movies/entities/movie.entity';
import { ScreeningSeat } from './screening-seat.entity';

@Entity()
export class Screening {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Movie, { eager: true })
  @JoinColumn({ name: 'movie_id' })
  movie: Movie;

  @Column()
  hallName: string;

  @Column({ type: 'timestamp' })
  startTime: Date;

  @Column({ type: 'timestamp' })
  endTime: Date;

  @Column({ type: 'float' })
  price: number;

  @OneToMany(() => ScreeningSeat, (seat) => seat.screening)
  seats: ScreeningSeat[];
}
