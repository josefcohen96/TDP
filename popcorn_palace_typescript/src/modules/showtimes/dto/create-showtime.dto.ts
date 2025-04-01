// create-showtime.dto.ts
import { IsNotEmpty, IsUUID, IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateShowtimeDto {
  @IsUUID()
  movieId: string;

  @IsString()
  @IsNotEmpty()
  theater: string;

  @IsDateString()
  startTime: string;

  @IsNumber()
  price: number;

  @IsDateString()
  endTime?: string;
}



