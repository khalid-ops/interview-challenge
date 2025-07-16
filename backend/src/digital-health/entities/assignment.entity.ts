import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
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

  @ManyToMany(() => Medication, (medication) => medication.assignments, {
    cascade: true,
  })
  @JoinTable({
    name: 'assignment_medications',
    joinColumn: { name: 'assignment_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'medication_id', referencedColumnName: 'id' },
  })
  medications: Medication[];

  @ManyToOne(() => Patient, (patient) => patient.assignments, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'patientId' })
  patient: Patient;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
