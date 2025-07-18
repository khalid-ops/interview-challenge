import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Medication } from '../entities/medication.entity';
import { Repository } from 'typeorm';
import { CreateMedicationDto } from '../dtos/create-medication.dto';
import { UpdateMedicationDto } from '../dtos/update-medication.dto';

@Injectable()
export class MedicationService {
  constructor(
    @InjectRepository(Medication)
    private medicationRepository: Repository<Medication>,
  ) {}

  async findAll(): Promise<Medication[]> {
    return this.medicationRepository.find({
      relations: ['assignments'],
    });
  }

  async findOne(id: number): Promise<Medication> {
    const medication = await this.medicationRepository.findOne({
      where: { id },
      relations: ['assignments'],
    });
    if (!medication) {
      throw new NotFoundException(`Medication with ID ${id} not found`);
    }
    return medication;
  }

  async create(medicationData: CreateMedicationDto): Promise<Medication> {
    const medication = this.medicationRepository.create(medicationData);
    return this.medicationRepository.save(medication);
  }

  async update(
    id: number,
    medicationData: UpdateMedicationDto,
  ): Promise<Medication> {
    const existingMedication = await this.medicationRepository.findOne({
      where: { id },
      relations: ['assignments'],
    });

    if (!existingMedication) {
      throw new NotFoundException(`Medication with ID ${id} not found`);
    }

    Object.assign(existingMedication, {
      ...medicationData,
    });

    return this.medicationRepository.save(existingMedication);
  }

  async delete(id: number): Promise<void> {
    await this.medicationRepository.delete(id);
  }
}
