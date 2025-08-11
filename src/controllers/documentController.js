import Document from '../models/document.js';
import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Use memory storage (files stored in memory temporarily)
const storage = multer.memoryStorage();
export const upload = multer({ 
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  }
});

// Helper function to upload to Cloudinary
const uploadToCloudinary = (fileBuffer, fileName) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'auto', // Automatically detect file type
        folder: 'documents', // Organize files in a folder
        public_id: `doc_${Date.now()}_${fileName.split('.')[0]}`,
        use_filename: true,
        unique_filename: true,
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
    uploadStream.end(fileBuffer);
  });
};

// Create document with Cloudinary upload
export const createDocument = async (req, res) => {
  const { title, content, category, type, tags, owner } = req.body;
  const file = req.file;

  console.log('=== CREATE DOCUMENT WITH CLOUDINARY ===');
  console.log('Request body:', { title, category, type, owner });
  console.log('File info:', file ? {
    originalname: file.originalname,
    mimetype: file.mimetype,
    size: file.size,
  } : 'No file');

  if (!title || !owner) {
    return res.status(400).json({ message: 'Title and owner are required.' });
  }

  let fileUrl = undefined;
  let cloudinaryId = undefined;
  let fileName = undefined;
  let fileSize = undefined;
  let mimeType = undefined;

  // Upload file to Cloudinary if present
  if (file) {
    try {
      console.log('Uploading to Cloudinary...');
      const uploadResult = await uploadToCloudinary(file.buffer, file.originalname);
      
      fileUrl = uploadResult.secure_url;
      cloudinaryId = uploadResult.public_id;
      fileName = file.originalname;
      fileSize = file.size;
      mimeType = file.mimetype;
      
      console.log('Cloudinary upload successful:', {
        url: fileUrl,
        publicId: cloudinaryId,
        size: uploadResult.bytes
      });
    } catch (uploadError) {
      console.error('Cloudinary upload failed:', uploadError);
      return res.status(500).json({ 
        message: 'File upload failed.',
        error: uploadError.message 
      });
    }
  }

  try {
    const newDoc = await Document.create({
      title,
      owner,
      content,
      category,
      fileUrl,
      cloudinaryId,
      fileName,
      fileSize,
      mimeType,
      type: type || 'upload',
      tags: tags ? JSON.parse(tags) : []
    });
    
    console.log('Document created successfully:', {
      id: newDoc._id,
      title: newDoc.title,
      hasCloudinaryUrl: !!newDoc.fileUrl
    });
    
    res.status(201).json(newDoc);
  } catch (err) {
    // If document creation fails but file was uploaded, clean up Cloudinary
    if (cloudinaryId) {
      try {
        await cloudinary.uploader.destroy(cloudinaryId);
        console.log('Cleaned up Cloudinary file after DB error');
      } catch (cleanupError) {
        console.error('Failed to cleanup Cloudinary file:', cleanupError);
      }
    }
    
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

// Get single document by ID
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

// Get document file from Cloudinary
export const getDocumentFile = async (req, res) => {
  try {
    console.log('=== GET DOCUMENT FILE ===');
    console.log('Document ID:', req.params.id);
    
    const document = await Document.findById(req.params.id);
    
    if (!document) {
      return res.status(404).json({ message: 'Document not found.' });
    }

    console.log('Document found:', {
      title: document.title,
      hasFileUrl: !!document.fileUrl,
      hasContent: !!document.content
    });

    // If no file URL, return just the content
    if (!document.fileUrl) {
      return res.json({
        type: 'content',
        content: document.content || '',
        title: document.title
      });
    }

    // For Cloudinary, we can either redirect or proxy the file
    console.log('Redirecting to Cloudinary URL:', document.fileUrl);
    
    // Option 1: Simple redirect (recommended)
    res.redirect(document.fileUrl);
    
    // Option 2: Proxy the file (uncomment if you need custom headers)
    /*
    try {
      const response = await fetch(document.fileUrl);
      const buffer = await response.arrayBuffer();
      
      res.setHeader('Content-Type', document.mimeType || 'application/octet-stream');
      res.setHeader('Content-Disposition', `inline; filename="${document.fileName}"`);
      res.send(Buffer.from(buffer));
    } catch (fetchError) {
      console.error('Error fetching from Cloudinary:', fetchError);
      res.status(500).json({ message: 'Error fetching file from storage.' });
    }
    */
    
  } catch (err) {
    console.error('Error fetching document file:', err);
    res.status(500).json({ message: 'Failed to fetch document file.' });
  }
};

// Get document content only
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
      fileUrl: document.fileUrl,
      fileName: document.fileName
    });
  } catch (err) {
    console.error('Error fetching document content:', err);
    res.status(500).json({ message: 'Failed to fetch document content.' });
  }
};

// Delete document and Cloudinary file
export const deleteDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    
    if (!document) {
      return res.status(404).json({ message: 'Document not found.' });
    }

    // Delete from Cloudinary if it exists
    if (document.cloudinaryId) {
      try {
        console.log('Deleting from Cloudinary:', document.cloudinaryId);
        await cloudinary.uploader.destroy(document.cloudinaryId);
        console.log(`File deleted from Cloudinary: ${document.cloudinaryId}`);
      } catch (cloudinaryError) {
        console.error('Error deleting from Cloudinary:', cloudinaryError);
        // Continue with document deletion even if Cloudinary deletion fails
      }
    }

    // Delete the document from database
    await Document.findByIdAndDelete(req.params.id);
    
    console.log('Document deleted successfully:', req.params.id);
    res.json({ message: 'Document and associated file deleted successfully.' });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ message: 'Delete failed.' });
  }
};