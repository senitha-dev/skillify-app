import mongoose from 'mongoose';

const learningResourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  provider: { type: String, required: true },
  type: { type: String, enum: ['course', 'video', 'certificate'], required: true },
  url: { type: String, required: true },
  category: { type: String, required: true },
  level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'] },
  isPaid: { type: Boolean, default: false },
  isRecommended: { type: Boolean, default: false },
  duration: { type: String },
  rating: { type: Number },
  createdAt: { type: Date, default: Date.now }
});

export const LearningResource = mongoose.model('LearningResource', learningResourceSchema);
