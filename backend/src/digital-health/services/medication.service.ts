import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Medication } from '../entities/medication.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MedicationService {
  constructor(
    @InjectRepository(Medication)
    private medicationRepository: Repository<Medication>,
  ) {}

  async findAll(): Promise<Medication[]> {
    return this.medicationRepository.find({
      relations: ['patient'],
    });
  }

  //   async findOne(id: number): Promise<Medication> {
  //     return this.medicationRepository.findOne(id, { relations: ['patient'] });
  //   }

  //   async create(medicationData: CreateMedicationDto): Promise<Medication> {
  //     const medication = this.medicationRepository.create(medicationData);
  //     return this.medicationRepository.save(medication);
  //   }

  //   async update(
  //     id: number,
  //     medicationData: UpdateMedicationDto,
  //   ): Promise<Medication> {
  //     await this.medicationRepository.update(id, medicationData);
  //     return this.findOne(id);
  //   }

  async remove(id: number): Promise<void> {
    await this.medicationRepository.delete(id);
  }
}
