import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
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

  @ManyToMany(() => Assignment, (assignment) => assignment.medications, {
    onDelete: 'CASCADE',
  })
  assignments: Assignment[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
