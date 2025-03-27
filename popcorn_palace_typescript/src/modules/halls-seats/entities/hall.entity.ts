// hall.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Seat } from './seat.entity';

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
}
