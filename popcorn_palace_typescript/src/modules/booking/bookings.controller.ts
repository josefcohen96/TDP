import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Res,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async create(@Body() dto: CreateBookingDto, @Res() res: Response) {
    try {
      const result = await this.bookingsService.create(dto);
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      if (error instanceof NotFoundException) {
        return res.status(HttpStatus.NOT_FOUND).json({
          statusCode: 404,
          message: error.message,
        });
      }

      if (error instanceof BadRequestException) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          statusCode: 400,
          message: error.message,
        });
      }

      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: 500,
        message: 'Something went wrong',
      });
    }
  }
}
