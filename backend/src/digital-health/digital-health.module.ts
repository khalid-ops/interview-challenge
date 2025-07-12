import { TypeOrmModule } from '@nestjs/typeorm';
import { Assignment } from './entities/assignment.entity';
import { Medication } from './entities/medication.entity';
import { Patient } from './entities/patient.entity';
import { Module } from '@nestjs/common';
import { PatientService } from './services/patient.service';
import { MedicationService } from './services/medication.service';
import { AssignmentService } from './services/assignment.service';

@Module({
  imports: [TypeOrmModule.forFeature([Assignment, Medication, Patient])],
  controllers: [],
  providers: [AssignmentService, MedicationService, PatientService],
})
export class DigitalHealthModule {}
