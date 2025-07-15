import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { PatientService } from '../services/patient.service';
import { CreatePatientDto } from '../dtos/create-patient.dto';
import { UpdatePatientDto } from '../dtos/update-patient.dto';

@Controller({ path: 'patients' })
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @Get()
  async findAll() {
    return this.patientService.findAll();
  }

  @Get('/with-treatment-details')
  async findPatientsWithTreatmentDetails() {
    return this.patientService.findPatientsWithTreatmentDetails();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.patientService.findOne(id);
  }

  @Post('/create')
  async create(@Body() patientData: CreatePatientDto) {
    return this.patientService.create(patientData);
  }

  @Put('update/:id')
  async update(@Param('id') id: number, @Body() patientData: UpdatePatientDto) {
    return this.patientService.update(id, patientData);
  }

  @Delete('delete/:id')
  async delete(@Param('id') id: number) {
    return this.patientService.delete(id);
  }
}
