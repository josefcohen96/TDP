import { IsUUID, IsNumber, } from 'class-validator';

export class CreateBookingDto {
  @IsUUID()
  userId: string;

  @IsUUID()
  showtimeId: string;

  @IsNumber()
  seatNumber: number;
}
