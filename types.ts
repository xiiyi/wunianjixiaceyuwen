export enum QuestionType {
  ImageToVerse = '看图选诗',
  TypoCorrection = '火眼金睛',
  KeywordTranslation = '字词解密',
  ThemeUnderstanding = '诗情画意'
}

export interface Question {
  id: string;
  type: QuestionType;
  questionText: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
  // For ImageToVerse, we might generate this on the fly, but we need the prompt.
  imagePrompt?: string; 
}

export interface Poem {
  id: string;
  title: string;
  author: string;
  questions: Question[];
}

export interface QuizState {
  currentQuestionIndex: number;
  score: number;
  showFeedback: boolean;
  selectedOption: string | null;
  isComplete: boolean;
  generatedImageUrl: string | null;
  isGeneratingImage: boolean;
}

export interface VisualizerProps {
  isPlaying: boolean;
  analyser?: AnalyserNode;
}