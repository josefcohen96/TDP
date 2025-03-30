import { Controller, Get, Post, Body } from '@nestjs/common';
import { MoviesService } from './movies.service';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Post()
    create(@Body() body: { title: string; genre:string, duration: number, rating: number, releaseYear: number }) {
      return this.moviesService.create(body.title, body.genre, body.duration, body.rating, body.releaseYear);
    }

    @Get()
    findAll() {
      return this.moviesService.findAll();
    }
  }
