// models/clients.js
import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  businessName: { type: String, required: true },
  role: { type: String, required: true },
  phone: { type: String, required: true },
  timeZone: { type: String, required: true },
  businessType: { type: String },
  services: [{ type: String }],
  profileImage: { type: String }, // URL or file path
  createdAt: { type: Date, default: Date.now }
});

const Client = mongoose.model('Client', clientSchema);

export default Client;
