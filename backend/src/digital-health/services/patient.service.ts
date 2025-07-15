import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Patient } from '../entities/patient.entity';
import { Repository } from 'typeorm';
import { CreatePatientDto } from '../dtos/create-patient.dto';
import { UpdatePatientDto } from '../dtos/update-patient.dto';
import { AssignmentService } from './assignment.service';

@Injectable()
export class PatientService {
  constructor(
    @InjectRepository(Patient)
    private patientRepository: Repository<Patient>,
    private assignmentService: AssignmentService,
  ) {}

  async findAll(): Promise<Patient[]> {
    return this.patientRepository.find({
      relations: ['assignments', 'assignments.medications'],
    });
  }

  async findPatientsWithTreatmentDetails(): Promise<Patient[]> {
    const patients = await this.patientRepository.find({
      relations: ['assignments', 'assignments.medications'],
    });

    const data = await Promise.all(
      patients.map(async (patient) => {
        return {
          ...patient,
          assignments: await Promise.all(
            patient.assignments.map(async (assignment) => {
              const treatmentDaysLeft =
                await this.assignmentService.getRemainingTreatmentDays(
                  assignment.id,
                );
              return {
                ...assignment,
                treatmentDaysLeft,
              };
            }),
          ),
        };
      }),
    );

    return data;
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
