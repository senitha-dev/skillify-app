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
