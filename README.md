# Skillify - Skill Gap Analysis & Career Pathing App

Skillify is a full-stack web application designed to help undergraduates identify their skill gaps and find the best career paths in the tech industry.

## 🚀 Features

- **Skill Assessment:** Interactive quizzes to evaluate proficiency in various tech domains.
- **Gap Analysis:** Visual representation of current skills vs. industry requirements.
- **Career Pathing:** Personalized career recommendations based on assessment results.
- **Learning Resources:** Curated courses and materials to bridge identified skill gaps.
- **Progress Tracking:** Real-time dashboard to monitor growth over time.

## 🛠️ Tech Stack

- **Frontend:** React, Vite, Tailwind CSS, Lucide React, Motion.
- **Backend:** Node.js, Express.js.
- **Database:** MongoDB Atlas (via Mongoose).
- **Authentication:** JWT (JSON Web Tokens) with Bcrypt password hashing.
- **Mobile:** Capacitor (for Android/iOS compatibility).

## 📂 Project Structure

```text
Skillify/
├── 📂 server/                # Backend Logic (Modular Structure)
│   ├── 📂 config/            # Database configuration
│   ├── 📂 controllers/       # Route handlers (Business logic)
│   ├── 📂 middleware/        # Auth and logging middleware
│   ├── 📂 models/            # Mongoose schemas
│   └── 📂 routes/            # API endpoint definitions
├── 📂 src/                   # Frontend (React)
│   ├── 📂 components/        # Reusable UI components
│   ├── 📂 pages/             # Application pages
│   ├── 📂 lib/               # API helpers and utilities
│   └── App.tsx               # Main frontend entry
├── server.ts                 # Main server entry point
└── package.json              # Project dependencies and scripts
```

## ⚙️ Setup & Installation

1. **Environment Variables:**
   Create a `.env` file or set the following in your environment:
   - `MONGODB_URI`: Your MongoDB Atlas connection string.
   - `JWT_SECRET`: A secret key for JWT signing.
   - `PORT`: Server port (defaults to 3000).

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Run Development Server:**
   ```bash
   npm run dev
   ```

4. **Build for Production:**
   ```bash
   npm run build
   ```

## 📱 Mobile Support

This project uses **Capacitor**. To run on Android:
1. Build the web project: `npm run build`
2. Sync with Capacitor: `npx cap sync`
3. Open in Android Studio: `npx cap open android`

## 📄 License

This project is licensed under the MIT License.
