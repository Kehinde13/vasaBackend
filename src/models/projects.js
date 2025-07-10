// models/Project.js
import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true }, // VA owner
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client' }, // optional link to a client
  status: {
    type: String,
    enum: ['To Do', 'In Progress', 'On Hold', 'Done'],
    default: 'To Do'
  },
  priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  dueDate: Date,
  tags: [String],
  createdAt: { type: Date, default: Date.now }
});

const Project = mongoose.model('Project', projectSchema);
export default Project;
