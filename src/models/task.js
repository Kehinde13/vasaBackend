// models/Task.js
import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client' },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'Client' }, // VA who owns this task

  status: {
    type: String,
    enum: ['To Do', 'In Progress', 'On Hold', 'Done'],
    default: 'To Do'
  },
  priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  dueDate: Date,
  subtasks: [
    {
      title: String,
      done: { type: Boolean, default: false }
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

const Task = mongoose.model('Task', taskSchema);
export default Task;
