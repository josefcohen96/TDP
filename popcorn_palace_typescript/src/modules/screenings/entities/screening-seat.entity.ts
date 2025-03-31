import { Entity, Unique, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Screening } from './screening.entity';

@Entity()
@Unique(['screening', 'seatName'])
export class ScreeningSeat {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Screening, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'screening_id' })
  screening: Screening;

  @Column()
  seatName: string;

  @Column({ default: true })
  isAvailable: boolean;
}
