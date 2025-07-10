// models/Document.js
import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true }, // VA

  content: String,
  category: String,
  fileUrl: String, // for uploads
  type: { type: String, default: 'upload' },
  tags: [String],
  createdAt: { type: Date, default: Date.now }
});

const Document = mongoose.model('Document', documentSchema);
export default Document;
