import { Patient } from 'src/digital-health/entities/patient.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Assignment } from './assignment.entity';

@Entity()
export class Medication {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  dosage: string;

  @Column()
  frequency: string;

  @ManyToOne(() => Assignment, (assignment) => assignment.medications)
  @JoinColumn({ name: 'assignmentId' })
  assignment: Assignment;

  @OneToMany(() => Patient, (patient) => patient.medications)
  patients: Patient[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
