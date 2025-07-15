// routes/documents.js
import express from 'express';
import {
  createDocument,
  getDocumentsByOwner,
  deleteDocument
} from '../controllers/documentController.js';

const router = express.Router();

router.post('/', createDocument);
router.get('/', getDocumentsByOwner);
router.delete('/:id', deleteDocument);

export default router;
