// routes/vaClients.js
import express from 'express';
import {
  createVaClient,
  getVaClients,
  updateVaClient,
  deleteVaClient
} from '../controllers/vaClients.js';

const router = express.Router();

router.post('/', createVaClient);
router.get('/', getVaClients);
router.put('/:id', updateVaClient);
router.delete('/:id', deleteVaClient);

export default router;
