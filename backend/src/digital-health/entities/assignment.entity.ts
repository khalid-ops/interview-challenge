import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Medication } from './medication.entity';

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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
