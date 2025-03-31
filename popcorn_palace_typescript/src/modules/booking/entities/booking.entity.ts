import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
  } from 'typeorm';
  import { Screening } from '../../screenings/entities/screening.entity';
  
  @Entity()
  export class Booking {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @ManyToOne(() => Screening, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'screening_id' })
    screening: Screening;
  
    @Column("simple-array")
    seatNames: string[]; // ["A1", "A2"]
  
    @CreateDateColumn()
    createdAt: Date;
  }
  