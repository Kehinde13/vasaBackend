import Document from '../models/document.js';
import multer from 'multer';
import path from 'path';

// Configure multer
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) =>
    cb(null, `${Date.now()}-${file.originalname}`)
});
export const upload = multer({ storage });

// Create document with file upload
export const createDocument = async (req, res) => {
  const { title, content, category, type, tags, owner } = req.body;
  const file = req.file;

  if (!title || !owner) {
    return res.status(400).json({ message: 'Title and owner are required.' });
  }

  const fileUrl = file ? `/uploads/${file.filename}` : undefined;

  try {
    const newDoc = await Document.create({
      title,
      owner,
      content,
      category,
      fileUrl,
      type: type || 'upload',
      tags: tags ? JSON.parse(tags) : []
    });
    res.status(201).json(newDoc);
  } catch (err) {
    console.error('Error creating document:', err);
    res.status(500).json({ message: 'Failed to create document.' });
  }
};

// Get documents by owner
export const getDocumentsByOwner = async (req, res) => {
  const { owner } = req.query;
  if (!owner) return res.status(400).json({ message: 'Missing owner ID.' });
  try {
    const docs = await Document.find({ owner }).sort({ createdAt: -1 });
    res.json(docs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch documents.' });
  }
};

// Delete a document
export const deleteDocument = async (req, res) => {
  try {
    const deleted = await Document.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Document not found.' });
    res.json({ message: 'Document deleted.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Delete failed.' });
  }
};
