import { Controller, Get, Post, Body, Patch, Delete, Param } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { HttpCode, HttpStatus } from '@nestjs/common';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) { }

  @Post()
  create(@Body() CreateMovieDto: CreateMovieDto) {
    return this.moviesService.create(CreateMovieDto);
  }

  @Get('all')
  findAll() {
    return this.moviesService.findAll();
  }

  @Post('update/:title')
  @HttpCode(HttpStatus.OK)
  update(@Param('title') id: string, @Body() updateMovieDto: UpdateMovieDto) {
    return this.moviesService.update(id, updateMovieDto);
  }

  @Delete(':title')
  remove(@Param('title') title: string) {
    return this.moviesService.remove(title);
  }
}
