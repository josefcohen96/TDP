import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm';
import { Showtime } from '../../showtimes/entities/showtime.entity';

@Entity()
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Showtime, { eager: true })
  @JoinColumn({ name: 'showtimeId' })
  showtime: Showtime;

  @Column()
  showtimeId: string;

  @Column()
  seatNumber: number;

  @Column()
  userId: string;

  @CreateDateColumn()
  createdAt: Date;
}
