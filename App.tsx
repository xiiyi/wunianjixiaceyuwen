import React, { useState } from 'react';
import Quiz from './components/Quiz';
import PoemSelector from './components/PoemSelector';
import { poems } from './data';
import { Poem, QuestionType } from './types';

const App: React.FC = () => {
  const [selectedPoem, setSelectedPoem] = useState<Poem | null>(null);
  const [selectedQuestionType, setSelectedQuestionType] = useState<QuestionType | null>(null);

  const handlePoemSelect = (poem: Poem) => {
    setSelectedPoem(poem);
    setSelectedQuestionType(null); // Reset question type selection
  };

  const handleQuestionTypeSelect = (type: QuestionType) => {
    setSelectedQuestionType(type);
  };

  const handleExitQuiz = () => {
    setSelectedQuestionType(null); // Go back to question type selection
  };

  const handleExitPoem = () => {
    setSelectedPoem(null);
    setSelectedQuestionType(null);
  };

  return (
    <div className="min-h-screen pb-12 font-serif text-ink-900">
      {/* Header / Nav */}
      <header className="bg-paper-50 border-b-2 border-stone-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <div
            className="flex items-center gap-4 cursor-pointer group"
            onClick={handleExitPoem}
          >
            <div className="w-12 h-12 bg-ink-900 flex items-center justify-center text-paper-50 font-calligraphy text-2xl shadow-md border-2 border-stone-400 group-hover:bg-cinnabar-700 transition-colors">
              诗
            </div>
            <div>
              <h1 className="text-2xl font-calligraphy text-ink-900 tracking-widest group-hover:text-cinnabar-700 transition-colors">五年级古诗词</h1>
              <p className="text-xs text-ink-500 font-serif tracking-widest uppercase">Grade 5 Poetry Master</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-fade-in-up">
          {!selectedPoem ? (
            <>
              <div className="mb-10 text-center relative">
                <div className="absolute top-1/2 left-0 w-full h-px bg-stone-300 -z-10"></div>
                <span className="bg-paper-100 px-6 text-xl font-calligraphy text-ink-800 tracking-widest">
                  选择诗卷 · 开启挑战
                </span>
                <p className="mt-4 text-ink-500 font-serif text-sm max-w-xl mx-auto bg-paper-100 inline-block px-4">
                  包含看图选诗（AI绘意）、火眼金睛（正字）、字词解密、诗情画意四重关卡
                </p>
              </div>
              <PoemSelector poems={poems} onSelect={handlePoemSelect} />
            </>
          ) : !selectedQuestionType ? (
            <QuestionTypeSelector
              poem={selectedPoem}
              onSelectType={handleQuestionTypeSelect}
              onBack={handleExitPoem}
            />
          ) : (
            <Quiz
              poem={selectedPoem}
              questionType={selectedQuestionType}
              onExit={handleExitQuiz}
            />
          )}
        </div>
      </main>
    </div>
  );
};

// Question Type Selector Component
interface QuestionTypeSelectorProps {
  poem: Poem;
  onSelectType: (type: QuestionType) => void;
  onBack: () => void;
}

const QuestionTypeSelector: React.FC<QuestionTypeSelectorProps> = ({ poem, onSelectType, onBack }) => {
  const questionTypes = [
    {
      type: QuestionType.ImageToVerse,
      label: '画中诗',
      description: '看图选诗，品味意境',
      icon: '🎨',
      colorClass: 'border-jade-800 bg-emerald-50 hover:bg-emerald-100 text-jade-800'
    },
    {
      type: QuestionType.TypoCorrection,
      label: '火眼金睛',
      description: '正字辨音，明察秋毫',
      icon: '👁️',
      colorClass: 'border-amber-800 bg-amber-50 hover:bg-amber-100 text-amber-800'
    },
    {
      type: QuestionType.KeywordTranslation,
      label: '字词解密',
      description: '解读古今，词义探究',
      icon: '📖',
      colorClass: 'border-indigo-900 bg-blue-50 hover:bg-blue-100 text-indigo-900'
    },
    {
      type: QuestionType.ThemeUnderstanding,
      label: '诗情画意',
      description: '悟诗情，感真义',
      icon: '🌸',
      colorClass: 'border-cinnabar-800 bg-rose-50 hover:bg-rose-100 text-cinnabar-800'
    }
  ];

  // Count available questions for each type
  const getQuestionCount = (type: QuestionType) => {
    return poem.questions.filter(q => q.type === type).length;
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Navigation */}
      <div className="flex items-center justify-between mb-6 border-b border-ink-800/30 pb-2">
        <button onClick={onBack} className="text-ink-800 hover:text-cinnabar-700 font-bold text-sm flex items-center transition-colors">
          <span className="text-xl mr-1">‹</span> 返回书阁
        </button>
      </div>

      {/* Poem Title Header */}
      <div className="bg-paper-50 border-double border-4 border-ink-800 p-6 mb-8 text-center relative overflow-hidden">
        <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-ink-800"></div>
        <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-ink-800"></div>
        <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-ink-800"></div>
        <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-ink-800"></div>

        <h2 className="text-3xl font-calligraphy text-ink-900 tracking-widest mb-2">{poem.title}</h2>
        <p className="text-ink-500 font-serif text-sm">{poem.author}</p>
      </div>

      {/* Question Type Selection */}
      <div className="mb-6 text-center">
        <span className="bg-paper-100 px-4 text-lg font-calligraphy text-ink-800 tracking-widest">
          选择题型 · 自由挑战
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {questionTypes.map(({ type, label, description, icon, colorClass }) => {
          const count = getQuestionCount(type);
          const isAvailable = count > 0;

          return (
            <button
              key={type}
              onClick={() => isAvailable && onSelectType(type)}
              disabled={!isAvailable}
              className={`p-6 border-2 transition-all duration-300 text-left relative overflow-hidden group ${isAvailable
                  ? `${colorClass} cursor-pointer transform hover:scale-[1.02] hover:shadow-lg`
                  : 'border-stone-300 bg-stone-100 text-stone-400 cursor-not-allowed'
                }`}
            >
              <div className="absolute top-2 right-2 text-3xl opacity-20 group-hover:opacity-40 transition-opacity">
                {icon}
              </div>

              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{icon}</span>
                <h3 className="text-xl font-calligraphy tracking-wide">{label}</h3>
              </div>

              <p className="text-sm opacity-80 font-serif mb-3">{description}</p>

              <div className={`text-xs font-serif ${isAvailable ? '' : 'text-stone-400'}`}>
                {isAvailable ? `共 ${count} 题` : '暂无题目'}
              </div>
            </button>
          );
        })}
      </div>

      {/* Total Questions Info */}
      <div className="mt-8 text-center text-ink-500 font-serif text-sm">
        本诗共有 <span className="font-bold text-ink-900">{poem.questions.length}</span> 道题目
      </div>
    </div>
  );
};

export default App;