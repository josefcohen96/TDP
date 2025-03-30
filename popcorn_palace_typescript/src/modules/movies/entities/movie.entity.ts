import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Screening } from '../../screenings/entities/screening.entity';

@Entity()
export class Movie {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })  // הוסף את זה
  genre: string; // movie genre

  @Column()
  duration: number; // movie duration in minutes

  @Column({ type: 'float', nullable: true }) 
  rating: number; // movie rating (1-10)

  @Column({ type: 'int', nullable: true }) // שנה לדוגמה: 2020
  releaseYear: number;

  @OneToMany(() => Screening, (screening) => screening.movie)
  screenings: Screening[];
}
