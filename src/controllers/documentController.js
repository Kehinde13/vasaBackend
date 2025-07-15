// controllers/documentController.js
import Document from '../models/document.js';

// Create new document
export const createDocument = async (req, res) => {
  const { title, content, category, fileUrl, type, tags, owner } = req.body;

  if (!title || !owner) {
    return res.status(400).json({ message: 'Title and owner are required.' });
  }

  try {
    const newDoc = await Document.create({
      title,
      owner,
      content,
      category,
      fileUrl,
      type: type || 'upload',
      tags,
    });

    res.status(201).json(newDoc);
  } catch (err) {
    console.error('Error creating document:', err);
    res.status(500).json({ message: 'Failed to create document.' });
  }
};

// Get all documents by owner
export const getDocumentsByOwner = async (req, res) => {
  const { owner } = req.query;

  if (!owner) {
    return res.status(400).json({ message: 'Missing owner ID.' });
  }

  try {
    const docs = await Document.find({ owner }).sort({ createdAt: -1 });
    res.json(docs);
  } catch (err) {
    console.error('Error fetching documents:', err);
    res.status(500).json({ message: 'Failed to fetch documents.' });
  }
};

// Delete a document by ID
export const deleteDocument = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await Document.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: 'Document not found.' });
    }

    res.json({ message: 'Document deleted successfully.' });
  } catch (err) {
    console.error('Error deleting document:', err);
    res.status(500).json({ message: 'Failed to delete document.' });
  }
};
