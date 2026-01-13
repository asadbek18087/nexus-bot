import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface QuizQuestion {
  id: number | string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface QuizState {
  questions: QuizQuestion[];
  topic: string;
  mode: 'practice' | 'exam';
  setQuestions: (questions: QuizQuestion[]) => void;
  setTopic: (topic: string) => void;
  setMode: (mode: 'practice' | 'exam') => void;
  clearQuiz: () => void;
}

export const useQuizStore = create<QuizState>()(
  persist(
    (set) => ({
      questions: [],
      topic: '',
      mode: 'practice',
      setQuestions: (questions) => set({ questions }),
      setTopic: (topic) => set({ topic }),
      setMode: (mode) => set({ mode }),
      clearQuiz: () => set({ questions: [], topic: '' }),
    }),
    {
      name: 'nexus-quiz-storage',
    }
  )
);
