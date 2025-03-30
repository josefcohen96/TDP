import { Controller, Get, Post, Body } from '@nestjs/common';
import { ScreeningsService } from './screenings.service';

@Controller('screenings')
export class ScreeningsController {
  constructor(private readonly screeningsService: ScreeningsService) {}

  @Post()
  create(@Body() body: { movieId: string; hall: string; startTime: Date }) {
    return this.screeningsService.create(body.movieId, body.hall, new Date(body.startTime));
  }

  @Get()
  findAll() {
    return this.screeningsService.findAll();
  }
}
