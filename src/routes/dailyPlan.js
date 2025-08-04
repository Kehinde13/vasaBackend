import express from 'express';
import { getDailyPlan, upsertBlock, deleteBlock } from '../controllers/dailyPlanController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getDailyPlan);
router.post('/upsert-block', protect, upsertBlock);
router.delete('/delete-block', protect, deleteBlock);

export default router;
