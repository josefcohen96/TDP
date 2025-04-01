import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ScreeningsService } from './screenings.service';
import { CreateScreeningDto } from './dto/create-screening.dto';
import { UpdateScreeningDto } from './dto/update-screening.dto';

@Controller('screenings')
export class ScreeningsController {
  constructor(private readonly screeningsService: ScreeningsService) {}

  @Post()
  async create(@Body() createDto: CreateScreeningDto) {
    return await this.screeningsService.create(createDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.screeningsService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateScreeningDto) {
    return await this.screeningsService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    await this.screeningsService.remove(id);
  }

  @Get()
  async findAll() {
    return await this.screeningsService.findAll();
  }
}
