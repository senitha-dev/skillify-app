import { Request, Response } from 'express';
import { CareerPath } from '../models/CareerPath';

export const getCareerPaths = async (req: Request, res: Response) => {
  try {
    const paths = await CareerPath.find();
    res.json(paths);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
