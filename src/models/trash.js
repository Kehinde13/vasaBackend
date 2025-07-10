// models/TrashItem.js
import mongoose from 'mongoose';

const trashItemSchema = new mongoose.Schema({
  itemType: {
    type: String,
    enum: ['Project', 'Task', 'Client', 'Document', 'Invoice'],
    required: true
  },
  itemId: { type: mongoose.Schema.Types.ObjectId, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'Client' },
  deletedAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) } // 30 days
});

const TrashItem = mongoose.model('TrashItem', trashItemSchema);
export default TrashItem;
