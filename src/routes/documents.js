import express from 'express';
import {
  upload,
  createDocument,
  getDocumentsByOwner,
  deleteDocument
} from '../controllers/documentController.js';

const router = express.Router();

router.post('/', upload.single('file'), createDocument);
router.get('/', getDocumentsByOwner);
router.delete('/:id', deleteDocument);

export default router;
