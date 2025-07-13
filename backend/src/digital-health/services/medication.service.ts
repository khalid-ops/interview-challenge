import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Medication } from '../entities/medication.entity';
import { Repository } from 'typeorm';
import { CreateMedicationDto } from '../dtos/create-medication.dto';
import { UpdateMedicationDto } from '../dtos/update-medication.dto';
import { AssignmentService } from './assignment.service';

@Injectable()
export class MedicationService {
  constructor(
    @InjectRepository(Medication)
    private medicationRepository: Repository<Medication>,
    private assignmentService: AssignmentService, // Assuming you have an AssignmentService to handle assignments
  ) {}

  async findAll(): Promise<Medication[]> {
    return this.medicationRepository.find({
      relations: ['assignment'],
    });
  }

  async findOne(id: number): Promise<Medication> {
    const medication = await this.medicationRepository.findOne({
      where: { id },
      relations: ['assignment'],
    });
    if (!medication) {
      throw new NotFoundException(`Medication with ID ${id} not found`);
    }
    return medication;
  }

  async create(medicationData: CreateMedicationDto): Promise<Medication> {
    const medication = this.medicationRepository.create(medicationData);

    if (medicationData.assignmentId) {
      medication.assignment = await this.assignmentService.findOne(
        medicationData.assignmentId,
      );
    }
    return this.medicationRepository.save(medication);
  }

  async update(
    id: number,
    medicationData: UpdateMedicationDto,
  ): Promise<Medication> {
    const existingMedication = await this.medicationRepository.findOne({
      where: { id },
      relations: ['assignment'],
    });

    if (!existingMedication) {
      throw new NotFoundException(`Medication with ID ${id} not found`);
    }

    Object.assign(existingMedication, {
      ...medicationData,
      assignment: medicationData.assignmentId
        ? await this.assignmentService.findOne(medicationData.assignmentId)
        : existingMedication.assignment,
    });

    return this.medicationRepository.save(existingMedication);
  }

  async delete(id: number): Promise<void> {
    await this.medicationRepository.delete(id);
  }
}
