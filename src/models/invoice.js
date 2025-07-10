// models/Invoice.js
import mongoose from 'mongoose';

const invoiceSchema = new mongoose.Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true }, // VA who issued this

  amount: { type: Number, required: true },
  currency: { type: String, default: 'USD' },
  description: String,

  status: {
    type: String,
    enum: ['Sent', 'Paid', 'Overdue'],
    default: 'Sent'
  },
  issueDate: { type: Date, default: Date.now },
  dueDate: { type: Date },
  recurring: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const Invoice = mongoose.model('Invoice', invoiceSchema);
export default Invoice;
