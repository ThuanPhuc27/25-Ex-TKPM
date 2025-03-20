import { Request, Response } from 'express';
import { getAllStudentStatuses } from '../repositories/studentStatusRepository';
import { getAllFaculties } from '../repositories/facultyRepository';
import { getAllPrograms } from '../repositories/programRepository';

export const getAllConfigs = async (req: Request, res: Response) => {
  try {
    const [studentStatuses, faculties, programs] = await Promise.all([
      getAllStudentStatuses(),
      getAllFaculties(),
      getAllPrograms(),
    ]);

    res.status(200).json({
      studentStatuses,
      faculties,
      programs,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching configurations' });
  }
};
