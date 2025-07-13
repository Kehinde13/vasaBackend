// routes/vaClients.js
import express from 'express';
import {
  createVaClient,
  getVaClients,
  updateVaClient,
  deleteVaClient
} from '../controllers/vaClientController.js';
import  protect  from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // ✅ all routes below this will require auth

router.post('/', createVaClient);
router.get('/', getVaClients);
router.put('/:id', updateVaClient);
router.delete('/:id', deleteVaClient);

export default router;
