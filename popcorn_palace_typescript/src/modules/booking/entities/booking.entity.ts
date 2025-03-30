import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Screening } from '../../screenings/entities/Screening.entity';
import { Seat } from '../../halls-seats/entities/seat.entity';

@Entity()
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Screening, { eager: true })
  @JoinColumn({ name: 'screening_id' })
  screening: Screening;

  @ManyToOne(() => Seat, { eager: true })
  @JoinColumn({ name: 'seat_id' })
  seat: Seat;

  @CreateDateColumn()
  createdAt: Date;
}
