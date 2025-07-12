import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Patient } from '../entities/patient.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PatientService {
  constructor(
    @InjectRepository(Patient)
    private patientRepository: Repository<Patient>,
  ) {}

  async findAll(): Promise<Patient[]> {
    return this.patientRepository.find({
      relations: ['medications', 'assignment'],
    });
  }

  //   async findOne(id: number): Promise<Patient> {
  //     return this.patientRepository.findOne(id, { relations: ['medications', 'assignment'] });
  //   }

  //   async create(patientData: CreatePatientDto): Promise<Patient> {
  //     const patient = this.patientRepository.create(patientData);
  //     return this.patientRepository.save(patient);
  //   }

  //   async update(id: number, patientData: UpdatePatientDto): Promise<Patient> {
  //     await this.patientRepository.update(id, patientData);
  //     return this.findOne(id);
  //   }

  async remove(id: number): Promise<void> {
    await this.patientRepository.delete(id);
  }
}
