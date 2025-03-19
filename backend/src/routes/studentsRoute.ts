import { Router } from 'express';
import {
  addStudent,
  getStudents,
  getStudent,
  updateStudentById,
  deleteStudentById,
} from '../controllers/studentController';

const router = Router();

router.post('/students', addStudent);

router.get('/students', getStudents);

router.get('/students/:studentId', getStudent);

router.put('/students/:studentId', updateStudentById);

router.delete('/students/:studentId', deleteStudentById);

export default router;
