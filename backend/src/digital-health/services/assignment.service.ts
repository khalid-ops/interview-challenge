import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Assignment } from '../entities/assignment.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AssignmentService {
  constructor(
    @InjectRepository(Assignment)
    private assignmentRepository: Repository<Assignment>,
  ) {}

  async findAll(): Promise<Assignment[]> {
    return this.assignmentRepository.find({
      relations: ['patient', 'medications'],
    });
  }

  //   async findOne(id: number): Promise<Assignment> {
  //     return this.assignmentRepository.findOne(id, {
  //       relations: ['patient', 'medications'],
  //     });
  //   }

  //   async create(assignmentData: CreateAssignmentDto): Promise<Assignment> {
  //     const assignment = this.assignmentRepository.create(assignmentData);
  //     return this.assignmentRepository.save(assignment);
  //   }

  //   async update(
  //     id: number,
  //     assignmentData: UpdateAssignmentDto,
  //   ): Promise<Assignment> {
  //     await this.assignmentRepository.update(id, assignmentData);
  //     return this.findOne(id);
  //   }

  async remove(id: number): Promise<void> {
    await this.assignmentRepository.delete(id);
  }
}
