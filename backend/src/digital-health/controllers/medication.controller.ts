import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { MedicationService } from '../services/medication.service';
import { CreateMedicationDto } from '../dtos/create-medication.dto';
import { UpdateMedicationDto } from '../dtos/update-medication.dto';

@Controller({ path: 'medications' })
export class MedicationController {
  constructor(private readonly medicationService: MedicationService) {}

  @Get()
  async findAll() {
    return this.medicationService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.medicationService.findOne(id);
  }

  @Post('/create')
  async create(@Body() medicationData: CreateMedicationDto) {
    return this.medicationService.create(medicationData);
  }

  @Put('update/:id')
  async update(
    @Param('id') id: number,
    @Body() medicationData: UpdateMedicationDto,
  ) {
    return this.medicationService.update(id, medicationData);
  }

  @Delete('delete/:id')
  async delete(@Param('id') id: number) {
    return this.medicationService.delete(id);
  }
}
