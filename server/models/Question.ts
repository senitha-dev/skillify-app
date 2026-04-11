import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  category: { type: String, required: true },
  options: [{ text: String, score: Number }],
  createdAt: { type: Date, default: Date.now }
});

export const Question = mongoose.model('Question', questionSchema);
