import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AssignmentService } from './services/assignment.service';
import { Assignment } from './entities/assignment.entity';
import { Repository } from 'typeorm';
import { PatientService } from './services/patient.service';
import { Medication } from './entities/medication.entity';

describe('AssignmentService', () => {
  let service: AssignmentService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let assignmentRepository: Repository<Assignment>;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let patientService: Partial<PatientService>;

  const mockAssignmentRepo = () => ({
    findOne: jest.fn(),
  });

  const mockPatientService = () => ({
    findOne: jest.fn(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AssignmentService,
        {
          provide: getRepositoryToken(Assignment),
          useFactory: mockAssignmentRepo,
        },
        { provide: getRepositoryToken(Medication), useClass: Repository },
        { provide: PatientService, useValue: mockPatientService() },
      ],
    }).compile();

    service = module.get<AssignmentService>(AssignmentService);
    assignmentRepository = module.get<Repository<Assignment>>(
      getRepositoryToken(Assignment),
    );
    patientService = module.get<Partial<PatientService>>(PatientService);
  });

  describe('getRemainingTreatmentDays', () => {
    const assignmentId = 1;

    it('should return total number of days if start date is in the future', async () => {
      const assignment = {
        id: assignmentId,
        startDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        numberOfDays: 10,
      };

      jest.spyOn(service, 'findOne').mockResolvedValue(assignment as any);

      const remainingDays =
        await service.getRemainingTreatmentDays(assignmentId);

      expect(remainingDays).toBe(assignment.numberOfDays);
    });

    it('should return remaining days if start date is in the past and days are remaining', async () => {
      const startDate = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
      const assignment = {
        id: assignmentId,
        startDate,
        numberOfDays: 10,
      };

      jest.spyOn(service, 'findOne').mockResolvedValue(assignment as any);

      const remainingDays =
        await service.getRemainingTreatmentDays(assignmentId);

      expect(remainingDays).toBe(7);
    });

    it('should return 0 if the remaining days are negative', async () => {
      const startDate = new Date(Date.now() - 15 * 24 * 60 * 60 * 1000);
      const assignment = {
        id: assignmentId,
        startDate,
        numberOfDays: 10,
      };

      jest.spyOn(service, 'findOne').mockResolvedValue(assignment as any);

      const remainingDays =
        await service.getRemainingTreatmentDays(assignmentId);

      expect(remainingDays).toBe(0);
    });

    it('should throw NotFoundException if assignment not found', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(null as any);

      await expect(
        service.getRemainingTreatmentDays(assignmentId),
      ).rejects.toThrow('Assignment with ID 1 not found');
    });
  });
});

// controller

import { AssignmentController } from './controllers/assignment.controller';

describe('AssignmentController', () => {
  let controller: AssignmentController;
  let mockAssignmentService: Partial<AssignmentService>;

  beforeEach(async () => {
    mockAssignmentService = {
      getRemainingTreatmentDays: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AssignmentController],
      providers: [
        { provide: AssignmentService, useValue: mockAssignmentService },
      ],
    }).compile();

    controller = module.get<AssignmentController>(AssignmentController);
  });

  describe('getTreatmentDaysLeft', () => {
    it('should return treatment days left', async () => {
      const mockDaysLeft = 5;
      (
        mockAssignmentService.getRemainingTreatmentDays as jest.Mock
      ).mockResolvedValue(mockDaysLeft);

      const result = await controller.getRemainingTreatmentDays(1);

      expect(result).toEqual(Number(mockDaysLeft));
      expect(
        mockAssignmentService.getRemainingTreatmentDays,
      ).toHaveBeenCalledWith(1);
    });
  });
});
