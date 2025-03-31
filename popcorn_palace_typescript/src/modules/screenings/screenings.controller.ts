import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { ScreeningsService } from './screenings.service';
import { CreateScreeningDto } from './dto/create-screening.dto';
import { UpdateScreeningDto } from './dto/update-screening.dto';
import { IsUUID } from 'class-validator';

@Controller('screenings')
export class ScreeningsController {
  constructor(private readonly screeningsService: ScreeningsService) {}

  @Post()
  create(@Body() createDto: CreateScreeningDto) {
    return this.screeningsService.create(createDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.screeningsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdateScreeningDto,
  ) {
    return this.screeningsService.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.screeningsService.remove(id);
  }

  @Get()
  findAll() {
    return this.screeningsService.findAll();
  }
}
