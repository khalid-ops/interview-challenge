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
import { Medication } from './medication.entity';
import { Patient } from './patient.entity';

@Entity()
export class Assignment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  startDate: Date;

  @Column()
  numberOfDays: number;

  @OneToMany(() => Medication, (medication) => medication.assignment)
  medications: Medication[];

  @ManyToOne(() => Patient, (patient) => patient.assignments, {
    nullable: true,
  })
  @JoinColumn({ name: 'patientId' })
  patient: Patient;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
