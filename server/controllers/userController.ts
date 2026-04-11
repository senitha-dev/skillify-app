import { Request, Response } from 'express';
import { User } from '../models/User';
import { AssessmentResult } from '../models/AssessmentResult';

export const getStats = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    const history = await AssessmentResult.find({ userId }).sort({ completedAt: -1 });
    
    if (history.length === 0) {
      return res.json({
        overall: 0,
        programming: 0,
        data: 0,
        infra: 0,
        history: []
      });
    }

    const latest = history[0];
    const scores = latest.scores as Map<string, number>;
    
    const categories = {
      programming: ['JavaScript', 'TypeScript', 'Python', 'Java', 'Kotlin', 'React', 'Angular', 'Vue', 'Node.js'],
      data: ['Data Analyst', 'ML', 'AI', 'SQL', 'Databases', 'Data Visualization'],
      infra: ['Cloud Platforms', 'Docker', 'Kubernetes', 'CI/CD', 'Linux', 'System Admin']
    };

    const getAvg = (skillList: string[]) => {
      let sum = 0;
      let count = 0;
      for (const [skill, score] of Object.entries(Object.fromEntries(scores))) {
        if (skillList.some(s => skill.includes(s))) {
          sum += (score / 4) * 100;
          count++;
        }
      }
      return count > 0 ? Math.round(sum / count) : 0;
    };

    res.json({
      overall: Math.round(latest.overallProgress),
      programming: getAvg(categories.programming),
      data: getAvg(categories.data),
      infra: getAvg(categories.infra),
      history: history.map(h => ({
        name: new Date(h.completedAt).toLocaleDateString('en-US', { month: 'short' }),
        progress: Math.round(h.overallProgress)
      })).reverse()
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getProfile = async (req: any, res: Response) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
