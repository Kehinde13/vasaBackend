import express from 'express';
import { getDailyPlans, upsertDailyBlock, deleteDailyBlock } from '../controllers/dailyPlanController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getDailyPlans);
router.post('/upsert-block', protect, upsertDailyBlock);
router.delete('/delete-block', protect, deleteDailyBlock);

export default router;
