import { IsUUID, IsArray, ArrayNotEmpty, IsString } from 'class-validator';

export class CreateBookingDto {
  @IsUUID()
  screeningId: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  seats: string[]; // לדוגמה: ["A1", "B3"]
}
