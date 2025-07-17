import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Assignment } from '../entities/assignment.entity';
import { Repository } from 'typeorm';
import { CreateAssignmentDto } from '../dtos/create-assignment.dto';
import { PatientService } from './patient.service';
import { Medication } from '../entities/medication.entity';
import { UpdateAssignmentDto } from '../dtos/update-assignment.dto';
import { addDays, differenceInCalendarDays, isAfter, isBefore } from 'date-fns';

@Injectable()
export class AssignmentService {
  constructor(
    @InjectRepository(Assignment)
    private assignmentRepository: Repository<Assignment>,
    @Inject(forwardRef(() => PatientService))
    private patientService: PatientService,
    @InjectRepository(Medication)
    private medicationRepository: Repository<Medication>,
  ) {}

  async findAll(): Promise<Assignment[]> {
    const data = await this.assignmentRepository.find({
      relations: ['patient', 'medications'],
    });

    return Promise.all(
      data.map(async (assignment) => {
        return {
          ...assignment,
          treatmentDaysLeft: await this.getRemainingTreatmentDays(
            assignment.id,
          ),
        };
      }),
    );
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

  async getRemainingTreatmentDays(id: number): Promise<number> {
    const assignment = await this.findOne(id);
    if (!assignment) {
      throw new NotFoundException(`Assignment with ID ${id} not found`);
    }
    const today = new Date();
    const endDate = addDays(assignment.startDate, assignment.numberOfDays);
    const remainingDays = differenceInCalendarDays(endDate, today);

    if (isAfter(assignment.startDate, today)) {
      return assignment.numberOfDays;
    }
    return remainingDays > 0 ? remainingDays : 0;
  }

  async create(assignmentData: CreateAssignmentDto): Promise<Assignment> {
    const assignment = this.assignmentRepository.create({
      ...assignmentData,
      startDate: new Date(assignmentData.startDate),
    });

    if (isBefore(new Date(assignment.startDate), new Date())) {
      throw new BadRequestException('Start date cannot be in the past');
    }
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
