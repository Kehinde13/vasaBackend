// models/DailyPlan.js
import mongoose from 'mongoose';

const dailyPlanSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  date: { type: Date, required: true },
  events: [
    {
      title: String,
      timeBlock: { start: String, end: String }, // e.g., "10:00", "12:00"
      type: { type: String, enum: ['Task', 'Meeting', 'Break', 'Focus'], default: 'Task' },
      relatedTask: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' }
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

const DailyPlan = mongoose.model('DailyPlan', dailyPlanSchema);
export default DailyPlan;
