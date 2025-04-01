import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Min, Max } from 'class-validator';

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
  @Min(1)
  @Max(10)
  @Column({ type: 'float', nullable: true })
  rating: number;

  @Column({ type: 'int', nullable: true })
  releaseYear: number;
}
