import mongoose from 'mongoose';

const assessmentResultSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  scores: { type: Map, of: Number },
  overallProgress: { type: Number },
  completedAt: { type: Date, default: Date.now }
});

export const AssessmentResult = mongoose.model('AssessmentResult', assessmentResultSchema);
