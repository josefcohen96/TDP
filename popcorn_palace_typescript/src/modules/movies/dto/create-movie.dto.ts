import { IsString, IsInt, IsOptional, Min, Max, IsNumber, min, MinLength } from 'class-validator';

export class CreateMovieDto {
    @IsString()
    @MinLength(1)
    title: string;

    @IsInt()
    @Min(1) // Darution should be a positive number
    duration: number;

    @IsOptional()
    @IsString()
    genre?: string;

    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(10)
    rating?: number;

    @IsOptional()
    @IsInt()
    @Max(new Date().getFullYear() + 1)  // Release year should not be in the future
    @Min(1888) // The first film was made in 1888
    releaseYear?: number;
}
