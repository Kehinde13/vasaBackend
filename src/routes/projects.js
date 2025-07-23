import express from 'express';
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  updateTaskStatus
} from '../controllers/projectController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', getProjects);
router.post('/', createProject);
router.put('/:id', updateProject);
router.patch('/:id/status', updateTaskStatus);
router.delete('/:id', deleteProject);

export default router;
