import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateAssignmentDto {
  @IsString()
  @IsOptional()
  startDate?: string;

  @IsNumber()
  @IsOptional()
  numberOfDays?: number;

  @IsArray({ each: true })
  @IsOptional()
  medicationIds?: number[];

  @IsNumber()
  @IsOptional()
  patientId?: number;
}
