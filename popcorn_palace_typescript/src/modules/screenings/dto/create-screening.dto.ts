import { IsUUID, IsDateString, IsNumber, Min } from 'class-validator';

export class CreateScreeningDto {
  @IsUUID()
  movieId: string;

  @IsUUID()
  hallId: string;

  @IsDateString()
  startTime: string;

  @IsDateString()
  endTime: string;

  @IsNumber()
  @Min(0)
  price: number;
}
