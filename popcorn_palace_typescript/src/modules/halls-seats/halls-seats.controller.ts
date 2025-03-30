import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { HallsSeatsService } from './halls-seats.service';

@Controller('halls')
export class HallsSeatsController {
  constructor(private readonly hallsSeatsService: HallsSeatsService) {}

  @Post()
  createHall(@Body() body: { name: string; rows: string[]; seatsPerRow: number }) {
    return this.hallsSeatsService.createHall(body.name, body.rows, body.seatsPerRow);
  }

  @Get(':id/seats')
  getSeats(@Param('id') hallId: string) {
    return this.hallsSeatsService.getSeatsByHall(hallId);
  }
}
