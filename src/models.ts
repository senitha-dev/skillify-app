import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'admin'], default: 'student' },
  profileImage: { type: String },
  skills: {
    type: Map,
    of: Number, // 0: None, 1: Beg, 2: Inter, 3: Adv, 4: Expert
    default: {}
  },
  createdAt: { type: Date, default: Date.now }
});

export const User = mongoose.model('User', userSchema);

const questionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  category: { type: String, required: true },
  options: [{ text: String, score: Number }],
  createdAt: { type: Date, default: Date.now }
});

export const Question = mongoose.model('Question', questionSchema);

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

const assessmentResultSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  scores: { type: Map, of: Number },
  overallProgress: { type: Number },
  completedAt: { type: Date, default: Date.now }
});

export const AssessmentResult = mongoose.model('AssessmentResult', assessmentResultSchema);

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
