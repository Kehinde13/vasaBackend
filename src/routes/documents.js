import express from 'express';
import {
  createDocument,
  getDocumentsByOwner,
  getDocumentById,
  getDocumentFile,
  getDocumentContent,
  deleteDocument,
  upload
} from '../controllers/documentController.js';

const router = express.Router();

// Create document (with file upload)
router.post('/', upload.single('file'), createDocument);

// Get documents by owner
router.get('/', getDocumentsByOwner);

// Get single document metadata
router.get('/:id', getDocumentById);

// Get document file for preview/download
router.get('/:id/file', getDocumentFile);

// Get document content only (alternative endpoint)
router.get('/:id/content', getDocumentContent);

// Delete document
router.delete('/:id', deleteDocument);

export default router;