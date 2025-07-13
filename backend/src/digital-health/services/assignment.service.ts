import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Assignment } from '../entities/assignment.entity';
import { Repository } from 'typeorm';
import { CreateAssignmentDto } from '../dtos/create-assignment.dto';
import { PatientService } from './patient.service';
import { Medication } from '../entities/medication.entity';
import { UpdateAssignmentDto } from '../dtos/update-assignment.dto';
import { addDays, differenceInCalendarDays } from 'date-fns';

@Injectable()
export class AssignmentService {
  constructor(
    @InjectRepository(Assignment)
    private assignmentRepository: Repository<Assignment>,
    private patientService: PatientService,
    @InjectRepository(Medication)
    private medicationRepository: Repository<Medication>,
  ) {}

  async findAll(): Promise<Assignment[]> {
    return this.assignmentRepository.find({
      relations: ['patient', 'medications'],
    });
  }

  async findOne(id: number): Promise<Assignment> {
    const assignment = await this.assignmentRepository.findOne({
      where: { id },
      relations: ['patient', 'medications'],
    });
    if (!assignment) {
      throw new NotFoundException(`Assignment with ID ${id} not found`);
    }
    return assignment;
  }

  async getByPatientId(patientId: number): Promise<Assignment[]> {
    const assignments = await this.assignmentRepository.find({
      where: { patient: { id: patientId } },
      relations: ['patient', 'medications'],
    });
    return Promise.all(
      assignments.map(async (assignment) => {
        return {
          ...assignment,
          treatmentDaysLeft: await this.getRemainingTreatmentDays(
            assignment.id,
          ),
        };
      }),
    );
  }

  async getRemainingTreatmentDays(id: number): Promise<number> {
    const assignment = await this.findOne(id);
    if (!assignment) {
      throw new NotFoundException(`Assignment with ID ${id} not found`);
    }
    const today = new Date();
    const endDate = addDays(assignment.startDate, assignment.numberOfDays);
    const remainingDays = differenceInCalendarDays(endDate, today);
    return remainingDays;
  }

  async create(assignmentData: CreateAssignmentDto): Promise<Assignment> {
    const assignment = this.assignmentRepository.create({
      ...assignmentData,
      startDate: new Date(assignmentData.startDate),
    });
    if (assignmentData.patientId) {
      assignment.patient = await this.patientService.findOne(
        assignmentData.patientId,
      );
    }
    if (assignmentData.medicationIds.length > 0) {
      const medications = await Promise.all(
        assignmentData.medicationIds.map((medicationId) =>
          this.medicationRepository.findOne({
            where: { id: medicationId },
          }),
        ),
      );
      assignment.medications = medications.filter(
        (medication): medication is Medication => medication !== null,
      );
    }
    return this.assignmentRepository.save(assignment);
  }

  async update(
    id: number,
    assignmentData: UpdateAssignmentDto,
  ): Promise<Assignment> {
    const existingAssignment = await this.assignmentRepository.findOne({
      where: { id },
      relations: ['patient', 'medications'],
    });

    if (!existingAssignment) {
      throw new NotFoundException(`Assignment with ID ${id} not found`);
    }

    Object.assign(existingAssignment, {
      ...assignmentData,
      startDate: assignmentData.startDate
        ? new Date(assignmentData.startDate)
        : existingAssignment.startDate,
    });

    if (assignmentData.patientId) {
      existingAssignment.patient = await this.patientService.findOne(
        assignmentData.patientId,
      );
    }

    if (assignmentData.medicationIds) {
      const medications = await Promise.all(
        assignmentData.medicationIds.map((medicationId) =>
          this.medicationRepository.findOne({
            where: { id: medicationId },
          }),
        ),
      );
      existingAssignment.medications = medications.filter(
        (medication): medication is Medication => medication !== null,
      );
    }

    return this.assignmentRepository.save(existingAssignment);
  }

  async delete(id: number): Promise<void> {
    await this.assignmentRepository.delete(id);
  }
}
