import Document from '../models/document.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

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

// Get single document by ID (for preview metadata)
export const getDocumentById = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ message: 'Document not found.' });
    }
    res.json(document);
  } catch (err) {
    console.error('Error fetching document:', err);
    res.status(500).json({ message: 'Failed to fetch document.' });
  }
};

// Get document file for preview/download
export const getDocumentFile = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    
    if (!document) {
      return res.status(404).json({ message: 'Document not found.' });
    }

    // If no file URL, return just the content
    if (!document.fileUrl) {
      return res.json({
        type: 'content',
        content: document.content || '',
        title: document.title
      });
    }

    // Construct the full file path
    // Remove leading slash from fileUrl if present to avoid path issues
    const cleanFileUrl = document.fileUrl.startsWith('/') 
      ? document.fileUrl.substring(1) 
      : document.fileUrl;
    const filePath = path.join(process.cwd(), cleanFileUrl);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'File not found on server.' });
    }

    // Get file stats
    const stats = fs.statSync(filePath);
    const fileExtension = path.extname(filePath).toLowerCase();
    
    // Set appropriate content type based on file extension
    let contentType = 'application/octet-stream'; // default
    switch (fileExtension) {
      case '.pdf':
        contentType = 'application/pdf';
        break;
      case '.doc':
        contentType = 'application/msword';
        break;
      case '.docx':
        contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        break;
      case '.xls':
        contentType = 'application/vnd.ms-excel';
        break;
      case '.xlsx':
        contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        break;
      case '.txt':
        contentType = 'text/plain';
        break;
      case '.png':
        contentType = 'image/png';
        break;
      case '.jpg':
      case '.jpeg':
        contentType = 'image/jpeg';
        break;
    }

    // Set headers
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Length', stats.size);
    res.setHeader('Content-Disposition', `inline; filename="${document.title}${fileExtension}"`);
    
    // Stream the file
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
    
    fileStream.on('error', (err) => {
      console.error('File stream error:', err);
      if (!res.headersSent) {
        res.status(500).json({ message: 'Error reading file.' });
      }
    });

  } catch (err) {
    console.error('Error fetching document file:', err);
    res.status(500).json({ message: 'Failed to fetch document file.' });
  }
};

// Optional: Get document content only (for text preview)
export const getDocumentContent = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    
    if (!document) {
      return res.status(404).json({ message: 'Document not found.' });
    }

    res.json({
      id: document._id,
      title: document.title,
      content: document.content,
      category: document.category,
      type: document.type,
      hasFile: !!document.fileUrl,
      fileUrl: document.fileUrl
    });
  } catch (err) {
    console.error('Error fetching document content:', err);
    res.status(500).json({ message: 'Failed to fetch document content.' });
  }
};

// Delete a document
export const deleteDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    
    if (!document) {
      return res.status(404).json({ message: 'Document not found.' });
    }

    // Delete the physical file if it exists
    if (document.fileUrl) {
      const filePath = path.join(process.cwd(), document.fileUrl);
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
          console.log(`File deleted: ${filePath}`);
        } catch (fileErr) {
          console.error('Error deleting file:', fileErr);
          // Continue with document deletion even if file deletion fails
        }
      }
    }

    // Delete the document from database
    await Document.findByIdAndDelete(req.params.id);
    res.json({ message: 'Document and associated file deleted successfully.' });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ message: 'Delete failed.' });
  }
};