import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { AssignmentService } from '../services/assignment.service';
import { CreateAssignmentDto } from '../dtos/create-assignment.dto';
import { UpdateAssignmentDto } from '../dtos/update-assignment.dto';

@Controller({ path: 'assignments' })
export class AssignmentController {
  constructor(private readonly assignmentService: AssignmentService) {}

  @Get()
  async findAll() {
    return this.assignmentService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.assignmentService.findOne(id);
  }

  @Get('by-patient/:id')
  async getByPatientId(@Param('id') patientId: number) {
    return this.assignmentService.getByPatientId(patientId);
  }

  @Get('remaining-treatment-days/:id')
  async getRemainingTreatmentDays(@Param('id') id: number) {
    return this.assignmentService.getRemainingTreatmentDays(id);
  }

  @Post('/create')
  async create(@Body() assignmentData: CreateAssignmentDto) {
    return this.assignmentService.create(assignmentData);
  }

  @Put('update/:id')
  async update(
    @Param('id') id: number,
    @Body() assignmentData: UpdateAssignmentDto,
  ) {
    return this.assignmentService.update(id, assignmentData);
  }

  @Delete('delete/:id')
  async delete(@Param('id') id: number) {
    return this.assignmentService.delete(id);
  }
}
