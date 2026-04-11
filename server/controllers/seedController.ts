import { Request, Response } from 'express';
import { Question } from '../models/Question';
import { CareerPath } from '../models/CareerPath';
import { LearningResource } from '../models/LearningResource';

export const seedData = async (req: Request, res: Response) => {
  try {
    await Question.deleteMany({});
    await CareerPath.deleteMany({});
    await LearningResource.deleteMany({});

    await Question.insertMany([
      {
        text: 'How proficient are you with Cloud Platforms (AWS/Azure/GCP)?',
        category: 'Cloud Platforms',
        options: [{ text: 'None', score: 0 }, { text: 'Beg.', score: 1 }, { text: 'Inter.', score: 2 }, { text: 'Adv.', score: 3 }, { text: 'Expert', score: 4 }]
      },
      {
        text: 'How proficient are you with Docker & Kubernetes?',
        category: 'Docker & Kubernetes',
        options: [{ text: 'None', score: 0 }, { text: 'Beg.', score: 1 }, { text: 'Inter.', score: 2 }, { text: 'Adv.', score: 3 }, { text: 'Expert', score: 4 }]
      },
      {
        text: 'How proficient are you with CI/CD Pipelines?',
        category: 'CI/CD Pipelines',
        options: [{ text: 'None', score: 0 }, { text: 'Beg.', score: 1 }, { text: 'Inter.', score: 2 }, { text: 'Adv.', score: 3 }, { text: 'Expert', score: 4 }]
      },
      {
        text: 'How proficient are you with Linux / System Admin?',
        category: 'Linux / System Admin',
        options: [{ text: 'None', score: 0 }, { text: 'Beg.', score: 1 }, { text: 'Inter.', score: 2 }, { text: 'Adv.', score: 3 }, { text: 'Expert', score: 4 }]
      }
    ]);

    await CareerPath.insertMany([
      {
        title: 'Software Engineer',
        description: 'Design and develop software applications and systems.',
        salaryRange: 'LKR 80K-220K/mo',
        growthRate: '+22%',
        requiredSkills: [
          { name: 'JavaScript / TypeScript', level: 3 },
          { name: 'React / Angular / Vue', level: 3 },
          { name: 'Node.js / Backend Dev', level: 3 }
        ]
      },
      {
        title: 'Cybersecurity Analyst',
        description: 'Protect systems and networks from cyber threats.',
        salaryRange: 'LKR 75K-180K/mo',
        growthRate: '+18%',
        requiredSkills: [
          { name: 'Linux / System Admin', level: 3 },
          { name: 'Cloud Platforms', level: 2 },
          { name: 'Problem Solving', level: 4 }
        ]
      }
    ]);

    await LearningResource.insertMany([
      {
        title: 'The Complete JavaScript Course',
        provider: 'Udemy',
        type: 'course',
        url: '#',
        category: 'JavaScript',
        level: 'Intermediate',
        isPaid: true,
        duration: '69 hrs',
        rating: 4.7
      },
      {
        title: 'TypeScript Full Course',
        provider: 'freeCodeCamp',
        type: 'video',
        url: '#',
        category: 'TypeScript',
        level: 'Intermediate',
        isPaid: false,
        duration: '4 hrs',
        rating: 4.8
      }
    ]);

    res.json({ message: 'Database seeded successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
