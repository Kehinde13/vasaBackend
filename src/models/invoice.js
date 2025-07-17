import mongoose from 'mongoose';

const invoiceSchema = new mongoose.Schema({
  client: { type: String, required: true },
  amount: { type: Number, required: true },
  dueDate: { type: Date, required: true },
  isPaid: { type: Boolean, default: false },
  recurrence: {
    type: String,
    enum: ['none', 'weekly', 'monthly', 'quarterly'],
    default: 'none',
  },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true }, // from context
}, {
  timestamps: true,
});

export default mongoose.model('Invoice', invoiceSchema);
