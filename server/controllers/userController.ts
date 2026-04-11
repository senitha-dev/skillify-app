import { Request, Response } from 'express';
import { User } from '../models/User';
import { AssessmentResult } from '../models/AssessmentResult';

export const getStats = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    console.log(`[Stats] Fetching stats for user: ${userId}`);
    
    const history = await AssessmentResult.find({ userId }).sort({ completedAt: -1 });
    console.log(`[Stats] Found ${history.length} assessment results`);
    
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
    // Convert Mongoose Map to plain object if needed
    const scoresObj = latest.scores instanceof Map 
      ? Object.fromEntries(latest.scores) 
      : latest.scores;
    
    const categories = {
      programming: ['JavaScript', 'TypeScript', 'Python', 'Java', 'Kotlin', 'React', 'Angular', 'Vue', 'Node.js'],
      data: ['Data Analyst', 'ML', 'AI', 'SQL', 'Databases', 'Data Visualization'],
      infra: ['Cloud Platforms', 'Docker', 'Kubernetes', 'CI/CD', 'Linux', 'System Admin']
    };

    const getAvg = (skillList: string[]) => {
      let sum = 0;
      let count = 0;
      
      if (!scoresObj) return 0;

      for (const [skill, score] of Object.entries(scoresObj)) {
        if (skillList.some(s => skill.includes(s))) {
          sum += (Number(score) / 4) * 100;
          count++;
        }
      }
      return count > 0 ? Math.round(sum / count) : 0;
    };

    const responseData = {
      overall: Math.round(latest.overallProgress || 0),
      programming: getAvg(categories.programming),
      data: getAvg(categories.data),
      infra: getAvg(categories.infra),
      history: history.map(h => ({
        name: new Date(h.completedAt).toLocaleDateString('en-US', { month: 'short' }),
        progress: Math.round(h.overallProgress || 0)
      })).reverse()
    };

    console.log('[Stats] Sending response:', JSON.stringify(responseData));
    res.json(responseData);
  } catch (error: any) {
    console.error('[Stats] Error:', error);
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
