import express from 'express';
import {
  createInvoice,
  getUserInvoices,
  updateInvoice,
  deleteInvoice,
} from '../controllers/invoiceController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // all routes require auth

router.post('/', createInvoice);
router.get('/:id', getUserInvoices);
router.put('/:id', updateInvoice);
router.delete('/:id', deleteInvoice);

export default router;
