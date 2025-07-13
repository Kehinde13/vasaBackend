// routes/vaClients.js
import express from 'express';
import {
  createVaClient,
  getVaClients,
  updateVaClient,
  deleteVaClient
} from '../controllers/vaClients.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect); // ✅ all routes below this will require auth

router.post('/', createVaClient);
router.get('/', getVaClients);
router.put('/:id', updateVaClient);
router.delete('/:id', deleteVaClient);

export default router;
