import { Request, Response } from 'express';
import { Question } from '../models/Question';

export const getQuestions = async (req: Request, res: Response) => {
  try {
    const questions = await Question.find();
    res.json(questions);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
