// models/document.js
import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  owner: { type: String, required: true },
  content: String,
  category: String,
  type: String,
  tags: [String],
  fileUrl: String, // Cloudinary URL
  cloudinaryId: String, // Cloudinary public_id for deletion
  fileName: String, // Original filename
  fileSize: Number,
  mimeType: String,
}, { timestamps: true });

export default mongoose.model('Document', documentSchema);