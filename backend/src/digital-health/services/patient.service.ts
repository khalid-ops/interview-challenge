import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Patient } from '../entities/patient.entity';
import { Repository } from 'typeorm';
import { CreatePatientDto } from '../dtos/create-patient.dto';
import { UpdatePatientDto } from '../dtos/update-patient.dto';

@Injectable()
export class PatientService {
  constructor(
    @InjectRepository(Patient)
    private patientRepository: Repository<Patient>,
  ) {}

  async findAll(): Promise<Patient[]> {
    return this.patientRepository.find({
      relations: ['assignments'],
    });
  }

  async findOne(id: number): Promise<Patient> {
    const patient = await this.patientRepository.findOne({
      where: { id },
      relations: ['assignments'],
    });

    if (!patient) {
      throw new NotFoundException(`Patient with ID ${id} not found`);
    }
    return patient;
  }

  async create(patientData: CreatePatientDto): Promise<Patient> {
    const patient = this.patientRepository.create({
      ...patientData,
      dateOfBirth: new Date(patientData.dateOfBirth),
    });
    return this.patientRepository.save(patient);
  }

  async update(id: number, patientData: UpdatePatientDto): Promise<Patient> {
    const existingPatient = await this.patientRepository.findOne({
      where: { id },
    });

    if (!existingPatient) {
      throw new NotFoundException(`Patient with ID ${id} not found`);
    }

    const { name, dateOfBirth } = patientData;

    if (name) {
      existingPatient.name = name;
    }
    if (dateOfBirth) {
      existingPatient.dateOfBirth = new Date(dateOfBirth);
    }
    return this.patientRepository.save(existingPatient);
  }

  async delete(id: number): Promise<void> {
    await this.patientRepository.delete(id);
  }
}
