import { IsOptional, IsString } from 'class-validator';

export class UpdateMedicationDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  dosage?: string;

  @IsString()
  @IsOptional()
  frequency?: string;
}
