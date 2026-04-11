import { Request, Response } from 'express';
import { User } from '../models/User';
import { AssessmentResult } from '../models/AssessmentResult';

export const submitAssessment = async (req: any, res: Response) => {
  try {
    const { scores, gpa, certifications } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (user) {
      user.skills = new Map(Object.entries(scores));
      if (gpa !== undefined) user.gpa = gpa;
      if (certifications !== undefined) user.certifications = certifications;
      await user.save();
    }

    const result = new AssessmentResult({
      userId,
      scores,
      overallProgress: Object.values(scores as Record<string, number>).reduce((a, b) => a + b, 0) / (Object.keys(scores as Record<string, number>).length * 4) * 100
    });
    await result.save();

    res.json(result);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getHistory = async (req: any, res: Response) => {
  try {
    const history = await AssessmentResult.find({ userId: req.user.id }).sort({ completedAt: -1 });
    res.json(history);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
