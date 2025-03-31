import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Screening } from '../../screenings/entities/screening.entity';

@Entity()
export class Movie {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })  
  genre: string;

  @Column()
  duration: number;

  @Column({ type: 'float', nullable: true }) 
  rating: number;

  @Column({ type: 'int', nullable: true }) 
  releaseYear: number;

  @OneToMany(() => Screening, (screening) => screening.movie)
  screenings: Screening[];
}
