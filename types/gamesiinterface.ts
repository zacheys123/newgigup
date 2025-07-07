// types.ts
export interface Question {
  question: string;
  correctAnswer: string;
  otherGuesses: string[];
  timeLimit?: number; // in seconds
}

export interface Topic {
  name: string;
  description?: string;
  icon?: string;
  questions: Question[];
}
