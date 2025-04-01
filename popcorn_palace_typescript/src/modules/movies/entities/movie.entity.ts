import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Showtime } from '../../showtimes/entities/showtime.entity';

@Entity()
export class Movie {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  title: string;

  @Column({ nullable: true })  
  genre: string;

  @Column()
  duration: number;

  @Column({ type: 'float', nullable: true }) 
  rating: number;

  @Column({ type: 'int', nullable: true }) 
  releaseYear: number;
}
