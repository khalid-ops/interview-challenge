import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateAssignmentDto {
  @IsString()
  @IsNotEmpty()
  startDate: string;

  @IsNumber()
  @IsNotEmpty()
  numberOfDays: number;

  @IsNumber({}, { each: true })
  @IsNotEmpty()
  medicationIds: number[];

  @IsNumber()
  @IsNotEmpty()
  patientId: number;
}
