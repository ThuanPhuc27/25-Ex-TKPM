import { Request, Response } from 'express';
import {
  createStudentStatus,
  getAllStudentStatuses,
  updateStudentStatus,
  deleteStudentStatus,
} from '../repositories/studentStatusRepository';

export const create = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    if (!name) {
      res.status(400).json({ message: 'Name is required' });
    }

    const newStudentStatus = await createStudentStatus(name);
    res.status(201).json(newStudentStatus);
  } catch (error) {
    res.status(500).json({ message: 'Error creating student status' });
  }
};

export const getAll = async (req: Request, res: Response) => {
  try {
    const studentStatuses = await getAllStudentStatuses();
    res.status(200).json(studentStatuses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching student statuses' });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    if (!name) {
      res.status(400).json({ message: 'Name is required' });
    }

    const updatedStudentStatus = await updateStudentStatus(id, name);
    if (!updatedStudentStatus) {
      res.status(404).json({ message: 'Student status not found' });
    }
    res.status(200).json(updatedStudentStatus);
  } catch (error) {
    res.status(500).json({ message: 'Error updating student status' });
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deletedStudentStatus = await deleteStudentStatus(id);
    if (!deletedStudentStatus) {
      res.status(404).json({ message: 'Student status not found' });
    }
    res.status(200).json({ message: 'Student status deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting student status' });
  }
};
