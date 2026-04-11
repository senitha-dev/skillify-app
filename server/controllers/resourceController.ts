import { Request, Response } from 'express';
import { LearningResource } from '../models/LearningResource';

export const getResources = async (req: Request, res: Response) => {
  try {
    const resources = await LearningResource.find();
    res.json(resources);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
