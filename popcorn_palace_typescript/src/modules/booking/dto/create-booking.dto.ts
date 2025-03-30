import { IsUUID, IsArray, ArrayNotEmpty } from 'class-validator';

export class CreateBookingDto {
  @IsUUID()
  screeningId: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('all', { each: true })
  seatIds: string[];
}
