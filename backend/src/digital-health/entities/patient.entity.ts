import { Assignment } from 'src/digital-health/entities/assignment.entity';
import { Medication } from 'src/digital-health/entities/medication.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Patient {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'date' })
  dateOfBirth: Date;

  @OneToOne(() => Assignment)
  @JoinColumn({ name: 'assignmentId' })
  assignment: Assignment;

  @ManyToOne(() => Medication, (medication) => medication.patients)
  @JoinColumn({ name: 'medicationId' })
  medications: Medication[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
