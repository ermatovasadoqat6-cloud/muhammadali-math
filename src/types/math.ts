export type GradeLevel = '5-6' | '7-8' | '9' | '10-11' | 'dtm' | 'olympiad';

export interface Question {
  id: string;
  grade: GradeLevel;
  topic: string;
  question: string;
  formula?: string;
  image?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  hint?: string;
  difficulty: 'oson' | 'orta' | 'qiyin';
}

export interface QuizCategory {
  id: string;
  grade: GradeLevel;
  title: string;
  description: string;
  icon: string;
  color: string;
  questionsCount: number;
  durationMinutes: number;
}

export interface QuizResult {
  quizTitle: string;
  grade: GradeLevel;
  studentName: string;
  totalQuestions: number;
  correctAnswers: number;
  scorePercentage: number;
  timeSpentSeconds: number;
  completedAt: string;
  answers: {
    questionId: string;
    questionText: string;
    selectedOption: number;
    correctOption: number;
    isCorrect: boolean;
    explanation: string;
  }[];
}

export interface FormulaItem {
  id: string;
  category: 'algebra' | 'geometriya' | 'trigonometriya' | 'stereometriya' | 'analiz';
  title: string;
  formula: string;
  latex?: string;
  description: string;
  grade: string;
  example?: string;
  tags: string[];
}

export interface StudyArticle {
  id: string;
  title: string;
  category: string;
  readTime: string;
  author: string;
  summary: string;
  content: string[];
  tips: string[];
}

export interface TeacherProfile {
  name: string;
  title: string;
  school: string;
  experienceYears: number;
  motto: string;
  telegram: string;
  phone: string;
  announcement: string;
  avatarUrl?: string;
}

export interface GameRecord {
  gameName: string;
  score: number;
  date: string;
  details?: string;
}
