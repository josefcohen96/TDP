import { IsOptional, IsUUID, IsString, IsDateString, IsNumber, Min } from 'class-validator';

export class CreateScreeningDto {
  @IsUUID()
  movieId: string;


  @IsString()
  hallName: string;

  @IsDateString()
  startTime: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsOptional()
  endTime: string;
}
