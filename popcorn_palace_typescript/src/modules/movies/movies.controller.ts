import { Controller, Get, Post, Body } from '@nestjs/common';
import { MoviesService } from './movies.service';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Post()
    create(@Body() body: { title: string; duration: number }) {
      return this.moviesService.create(body.title, body.duration);
    }

    @Get()
    findAll() {
      return this.moviesService.findAll();
    }
  }
