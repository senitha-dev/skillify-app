import mongoose from 'mongoose';

const careerPathSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  salaryRange: { type: String },
  growthRate: { type: String },
  requiredSkills: [{
    name: String,
    level: Number // 1: Beg, 2: Inter, 3: Adv, 4: Expert
  }],
  createdAt: { type: Date, default: Date.now }
});

export const CareerPath = mongoose.model('CareerPath', careerPathSchema);
