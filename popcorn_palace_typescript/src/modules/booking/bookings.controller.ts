import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Res,
  NotFoundException,
} from '@nestjs/common';
import { Response } from 'express';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @HttpCode(HttpStatus.OK) // Default to 200
  async create(
    @Body() createBookingDto: CreateBookingDto,
    @Res() res: Response,
  ) {
    try {
      const result = await this.bookingsService.create(createBookingDto);

      if (result.success) {
        return res.status(HttpStatus.CREATED).json(result); // 201 Created
      } else {
        return res.status(HttpStatus.OK).json(result); // 200 OK with error details
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        return res.status(HttpStatus.NOT_FOUND).json({
          statusCode: 404,
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
