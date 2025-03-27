// seat.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Hall } from './hall.entity';

@Entity()
export class Seat {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  row: string;

  @Column()
  number: number;

  @ManyToOne(() => Hall, hall => hall.seats, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'hall_id' })
  hall: Hall;
}
