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
      // Programming & Development
      {
        text: 'How proficient are you with JavaScript / TypeScript?',
        category: 'Programming & Development',
        options: [{ text: 'None', score: 0 }, { text: 'Beg.', score: 1 }, { text: 'Inter.', score: 2 }, { text: 'Adv.', score: 3 }, { text: 'Expert', score: 4 }]
      },
      {
        text: 'How proficient are you with Python?',
        category: 'Programming & Development',
        options: [{ text: 'None', score: 0 }, { text: 'Beg.', score: 1 }, { text: 'Inter.', score: 2 }, { text: 'Adv.', score: 3 }, { text: 'Expert', score: 4 }]
      },
      {
        text: 'How proficient are you with Java / Kotlin?',
        category: 'Programming & Development',
        options: [{ text: 'None', score: 0 }, { text: 'Beg.', score: 1 }, { text: 'Inter.', score: 2 }, { text: 'Adv.', score: 3 }, { text: 'Expert', score: 4 }]
      },
      {
        text: 'How proficient are you with React / Angular / Vue?',
        category: 'Programming & Development',
        options: [{ text: 'None', score: 0 }, { text: 'Beg.', score: 1 }, { text: 'Inter.', score: 2 }, { text: 'Adv.', score: 3 }, { text: 'Expert', score: 4 }]
      },
      {
        text: 'How proficient are you with Node.js / Backend Dev?',
        category: 'Programming & Development',
        options: [{ text: 'None', score: 0 }, { text: 'Beg.', score: 1 }, { text: 'Inter.', score: 2 }, { text: 'Adv.', score: 3 }, { text: 'Expert', score: 4 }]
      },
      {
        text: 'How proficient are you with SQL / Databases?',
        category: 'Programming & Development',
        options: [{ text: 'None', score: 0 }, { text: 'Beg.', score: 1 }, { text: 'Inter.', score: 2 }, { text: 'Adv.', score: 3 }, { text: 'Expert', score: 4 }]
      },
      // Data & Analytics
      {
        text: 'How proficient are you with Data Analysis?',
        category: 'Data & Analytics',
        options: [{ text: 'None', score: 0 }, { text: 'Beg.', score: 1 }, { text: 'Inter.', score: 2 }, { text: 'Adv.', score: 3 }, { text: 'Expert', score: 4 }]
      },
      {
        text: 'How proficient are you with Machine Learning / AI?',
        category: 'Data & Analytics',
        options: [{ text: 'None', score: 0 }, { text: 'Beg.', score: 1 }, { text: 'Inter.', score: 2 }, { text: 'Adv.', score: 3 }, { text: 'Expert', score: 4 }]
      },
      {
        text: 'How proficient are you with Data Visualization?',
        category: 'Data & Analytics',
        options: [{ text: 'None', score: 0 }, { text: 'Beg.', score: 1 }, { text: 'Inter.', score: 2 }, { text: 'Adv.', score: 3 }, { text: 'Expert', score: 4 }]
      },
      {
        text: 'How proficient are you with Statistics & Probability?',
        category: 'Data & Analytics',
        options: [{ text: 'None', score: 0 }, { text: 'Beg.', score: 1 }, { text: 'Inter.', score: 2 }, { text: 'Adv.', score: 3 }, { text: 'Expert', score: 4 }]
      },
      // Infrastructure & DevOps
      {
        text: 'How proficient are you with Cloud Platforms (AWS/Azure/GCP)?',
        category: 'Infrastructure & DevOps',
        options: [{ text: 'None', score: 0 }, { text: 'Beg.', score: 1 }, { text: 'Inter.', score: 2 }, { text: 'Adv.', score: 3 }, { text: 'Expert', score: 4 }]
      },
      {
        text: 'How proficient are you with Docker & Kubernetes?',
        category: 'Infrastructure & DevOps',
        options: [{ text: 'None', score: 0 }, { text: 'Beg.', score: 1 }, { text: 'Inter.', score: 2 }, { text: 'Adv.', score: 3 }, { text: 'Expert', score: 4 }]
      },
      {
        text: 'How proficient are you with CI/CD Pipelines?',
        category: 'Infrastructure & DevOps',
        options: [{ text: 'None', score: 0 }, { text: 'Beg.', score: 1 }, { text: 'Inter.', score: 2 }, { text: 'Adv.', score: 3 }, { text: 'Expert', score: 4 }]
      },
      {
        text: 'How proficient are you with Linux / System Admin?',
        category: 'Infrastructure & DevOps',
        options: [{ text: 'None', score: 0 }, { text: 'Beg.', score: 1 }, { text: 'Inter.', score: 2 }, { text: 'Adv.', score: 3 }, { text: 'Expert', score: 4 }]
      },
      // Soft Skills
      {
        text: 'How proficient are you with Problem Solving?',
        category: 'Soft Skills',
        options: [{ text: 'None', score: 0 }, { text: 'Beg.', score: 1 }, { text: 'Inter.', score: 2 }, { text: 'Adv.', score: 3 }, { text: 'Expert', score: 4 }]
      },
      {
        text: 'How proficient are you with Communication?',
        category: 'Soft Skills',
        options: [{ text: 'None', score: 0 }, { text: 'Beg.', score: 1 }, { text: 'Inter.', score: 2 }, { text: 'Adv.', score: 3 }, { text: 'Expert', score: 4 }]
      },
      {
        text: 'How proficient are you with Teamwork & Collaboration?',
        category: 'Soft Skills',
        options: [{ text: 'None', score: 0 }, { text: 'Beg.', score: 1 }, { text: 'Inter.', score: 2 }, { text: 'Adv.', score: 3 }, { text: 'Expert', score: 4 }]
      },
      {
        text: 'How proficient are you with Time Management?',
        category: 'Soft Skills',
        options: [{ text: 'None', score: 0 }, { text: 'Beg.', score: 1 }, { text: 'Inter.', score: 2 }, { text: 'Adv.', score: 3 }, { text: 'Expert', score: 4 }]
      },
      {
        text: 'How proficient are you with Leadership?',
        category: 'Soft Skills',
        options: [{ text: 'None', score: 0 }, { text: 'Beg.', score: 1 }, { text: 'Inter.', score: 2 }, { text: 'Adv.', score: 3 }, { text: 'Expert', score: 4 }]
      }
    ]);

    await CareerPath.insertMany([
      {
        title: 'Software Engineer',
        description: 'Design and develop software applications and systems.',
        salaryRange: 'LKR 100K-350K/mo',
        growthRate: '+22%',
        requiredSkills: [
          { name: 'JavaScript / TypeScript', level: 3 },
          { name: 'Node.js / Backend Dev', level: 3 },
          { name: 'Problem Solving', level: 4 }
        ]
      },
      {
        title: 'Full Stack Developer',
        description: 'Handle both frontend and backend development tasks.',
        salaryRange: 'LKR 120K-400K/mo',
        growthRate: '+25%',
        requiredSkills: [
          { name: 'JavaScript / TypeScript', level: 4 },
          { name: 'React / Angular / Vue', level: 3 },
          { name: 'Node.js / Backend Dev', level: 3 },
          { name: 'SQL / Databases', level: 3 }
        ]
      },
      {
        title: 'Data Analyst',
        description: 'Interpret data and turn it into information which can offer ways to improve a business.',
        salaryRange: 'LKR 80K-250K/mo',
        growthRate: '+20%',
        requiredSkills: [
          { name: 'Data Analysis', level: 4 },
          { name: 'SQL / Databases', level: 3 },
          { name: 'Data Visualization', level: 3 }
        ]
      },
      {
        title: 'ML/AI Engineer',
        description: 'Create AI algorithms capable of learning and making predictions.',
        salaryRange: 'LKR 150K-500K/mo',
        growthRate: '+35%',
        requiredSkills: [
          { name: 'Python', level: 4 },
          { name: 'Machine Learning / AI', level: 4 },
          { name: 'Statistics & Probability', level: 4 }
        ]
      },
      {
        title: 'DevOps Engineer',
        description: 'Bridge the gap between development and operations teams for faster delivery.',
        salaryRange: 'LKR 130K-450K/mo',
        growthRate: '+30%',
        requiredSkills: [
          { name: 'Cloud Platforms (AWS/Azure/GCP)', level: 4 },
          { name: 'Docker & Kubernetes', level: 3 },
          { name: 'CI/CD Pipelines', level: 4 }
        ]
      }
    ]);

    await LearningResource.insertMany([
      {
        title: 'The Complete JavaScript Course',
        provider: 'Udemy',
        type: 'course',
        url: 'https://www.udemy.com/course/the-complete-javascript-course/',
        category: 'JavaScript',
        level: 'Intermediate',
        isPaid: true,
        duration: '69 hrs',
        rating: 4.7
      },
      {
        title: 'Python for Everybody Specialization',
        provider: 'Coursera',
        type: 'course',
        url: 'https://www.coursera.org/specializations/python',
        category: 'Python',
        level: 'Beginner',
        isPaid: true,
        duration: '8 months',
        rating: 4.8
      },
      {
        title: 'AWS Certified Cloud Practitioner',
        provider: 'Amazon',
        type: 'certificate',
        url: 'https://aws.amazon.com/certification/certified-cloud-practitioner/',
        category: 'Cloud Platforms',
        level: 'Beginner',
        isPaid: true,
        duration: '20 hrs',
        rating: 4.9
      },
      {
        title: 'Google Data Analytics Professional Certificate',
        provider: 'Coursera',
        type: 'certificate',
        url: 'https://www.coursera.org/professional-certificates/google-data-analytics',
        category: 'Data Analysis',
        level: 'Beginner',
        isPaid: true,
        duration: '6 months',
        rating: 4.8
      },
      {
        title: 'Docker and Kubernetes: The Complete Guide',
        provider: 'Udemy',
        type: 'course',
        url: 'https://www.udemy.com/course/docker-and-kubernetes-the-complete-guide/',
        category: 'Docker & Kubernetes',
        level: 'Intermediate',
        isPaid: true,
        duration: '22 hrs',
        rating: 4.7
      }
    ]);

    res.json({ message: 'Database seeded successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
