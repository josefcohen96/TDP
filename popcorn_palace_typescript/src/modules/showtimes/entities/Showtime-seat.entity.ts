import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Showtime } from './showtime.entity';

@Entity()
export class ShowtimeSeat {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  number: number;

  @Column({ default: true })
  isAvailable: boolean;

  @ManyToOne(() => Showtime, (showtime) => showtime.seats, { onDelete: 'CASCADE' })
  showtime: Showtime;
}
