import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateMedicationDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  dosage: string;

  @IsString()
  @IsNotEmpty()
  frequency: string;

  @IsNumber()
  @IsOptional()
  assignmentId?: number;
}
