// models/VaClient.js
import mongoose from 'mongoose';

const vaClientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String },
  status: {
    type: String,
    enum: ['active', 'paused', 'prospect', 'ex-client'],
    default: 'prospect'
  },
  projects: { type: String },
  preferences: { type: String },
  billing: { type: String },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'Client' }, // who owns this client
  createdAt: { type: Date, default: Date.now }
});

const VaClient = mongoose.model('VaClient', vaClientSchema);

export default VaClient;
