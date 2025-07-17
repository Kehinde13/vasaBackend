import express from 'express';
import {
  createInvoice,
  getInvoices,
  updateInvoice,
  deleteInvoice,
} from '../controllers/invoiceController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // all routes require auth

router.post('/', createInvoice);
router.get('/', getInvoices);
router.put('/:id', updateInvoice);
router.delete('/:id', deleteInvoice);

export default router;
