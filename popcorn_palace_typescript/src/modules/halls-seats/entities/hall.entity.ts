import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Seat } from './seat.entity';
import { Screening } from '../../screenings/entities/screening.entity';

@Entity()
export class Hall {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  capacity: number;

  @OneToMany(() => Seat, seat => seat.hall, { cascade: true })
  seats: Seat[];

  @OneToMany(() => Screening, screening => screening.hall)
  screenings: Screening[];
}
