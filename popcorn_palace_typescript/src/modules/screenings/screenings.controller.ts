import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  Res,
  HttpStatus
} from '@nestjs/common';
import { Response } from 'express';
import { ScreeningsService } from './screenings.service';
import { CreateScreeningDto } from './dto/create-screening.dto';
import { UpdateScreeningDto } from './dto/update-screening.dto';

@Controller('screenings')
export class ScreeningsController {
  constructor(private readonly screeningsService: ScreeningsService) {}

  @Post()
  async create(@Body() createDto: CreateScreeningDto, @Res() res: Response) {
    try {
      const screening = await this.screeningsService.create(createDto);
      return res.status(HttpStatus.CREATED).json(screening);
    } catch (error) {
      return res.status(error.getStatus?.() || 500).json({
        statusCode: error.getStatus?.() || 500,
        message: error.message || 'Unexpected error',
      });
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    try {
      const screening = await this.screeningsService.findOne(id);
      return res.status(HttpStatus.OK).json(screening);
    } catch (error) {
      return res.status(error.getStatus?.() || 500).json({
        statusCode: error.getStatus?.() || 500,
        message: error.message || 'Unexpected error',
      });
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateScreeningDto, @Res() res: Response) {
    try {
      const updated = await this.screeningsService.update(id, dto);
      return res.status(HttpStatus.OK).json(updated);
    } catch (error) {
      return res.status(error.getStatus?.() || 500).json({
        statusCode: error.getStatus?.() || 500,
        message: error.message || 'Unexpected error',
      });
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    try {
      await this.screeningsService.remove(id);
      return res.status(HttpStatus.NO_CONTENT).send();
    } catch (error) {
      return res.status(error.getStatus?.() || 500).json({
        statusCode: error.getStatus?.() || 500,
        message: error.message || 'Unexpected error',
      });
    }
  }

  @Get()
  async findAll(@Res() res: Response) {
    try {
      const result = await this.screeningsService.findAll();
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      return res.status(500).json({
        statusCode: 500,
        message: 'Failed to fetch screenings',
      });
    }
  }
}