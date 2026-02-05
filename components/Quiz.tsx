import React, { useState, useEffect } from 'react';
import { QuizState, QuestionType, Poem } from '../types';
import { generatePoemIllustration } from '../utils/genai';

interface QuizProps {
  poem: Poem;
  onExit: () => void;
}

const Quiz: React.FC<QuizProps> = ({ poem, onExit }) => {
  const [state, setState] = useState<QuizState>({
    currentQuestionIndex: 0,
    score: 0,
    showFeedback: false,
    selectedOption: null,
    isComplete: false,
    generatedImageUrl: null,
    isGeneratingImage: false,
  });

  const currentQuestion = poem.questions[state.currentQuestionIndex];

  useEffect(() => {
    const fetchImage = async () => {
      if (currentQuestion.type === QuestionType.ImageToVerse) {
        setState(prev => ({ ...prev, isGeneratingImage: true, generatedImageUrl: null }));
        const url = await generatePoemIllustration(currentQuestion.questionText);
        setState(prev => ({ ...prev, isGeneratingImage: false, generatedImageUrl: url }));
      } else {
        setState(prev => ({ ...prev, generatedImageUrl: null }));
      }
    };

    fetchImage();
  }, [currentQuestion]);

  const handleOptionSelect = (option: string) => {
    if (state.showFeedback) return;

    const isCorrect = option === currentQuestion.correctAnswer;
    setState(prev => ({
      ...prev,
      score: isCorrect ? prev.score + 1 : prev.score,
      showFeedback: true,
      selectedOption: option
    }));
  };

  const nextQuestion = () => {
    if (state.currentQuestionIndex + 1 >= poem.questions.length) {
      setState(prev => ({ ...prev, isComplete: true }));
    } else {
      setState(prev => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1,
        showFeedback: false,
        selectedOption: null,
        generatedImageUrl: null
      }));
    }
  };

  const restartQuiz = () => {
    setState({
      currentQuestionIndex: 0,
      score: 0,
      showFeedback: false,
      selectedOption: null,
      isComplete: false,
      generatedImageUrl: null,
      isGeneratingImage: false
    });
  };

  // Completion Screen - Seal Style
  if (state.isComplete) {
    const percentage = Math.round((state.score / poem.questions.length) * 100);
    return (
      <div className="max-w-2xl mx-auto bg-paper-50 border-double border-4 border-ink-800 p-8 text-center shadow-lg relative overflow-hidden">
        {/* Decorative Corners */}
        <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-ink-800"></div>
        <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-ink-800"></div>
        <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-ink-800"></div>
        <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-ink-800"></div>

        <h2 className="text-4xl font-calligraphy text-ink-900 mb-8 mt-4 tracking-widest">{poem.title} · 通关</h2>
        
        <div className="relative inline-block mb-10 group">
          {/* Seal Style Score */}
          <div className="w-40 h-40 border-4 border-cinnabar-700 rounded-xl flex flex-col items-center justify-center transform rotate-3 mx-auto shadow-inner bg-paper-50 text-cinnabar-700">
             <span className="font-calligraphy text-2xl mb-1 writing-vertical">得分</span>
             <span className="font-serif text-5xl font-bold border-t-2 border-b-2 border-cinnabar-700 py-1 px-4">{percentage}</span>
          </div>
          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-ink-500 font-serif text-sm">
             答对 {state.score} / {poem.questions.length} 题
          </div>
        </div>

        <div className="flex justify-center gap-6 mt-8">
          <button
            onClick={onExit}
            className="border-2 border-ink-800 text-ink-800 px-8 py-2 hover:bg-ink-800 hover:text-paper-50 transition-colors duration-300 font-serif tracking-widest"
          >
            返回书阁
          </button>
          <button
            onClick={restartQuiz}
            className="bg-cinnabar-700 text-paper-50 px-8 py-2 hover:bg-cinnabar-800 transition-colors duration-300 font-serif tracking-widest shadow-md"
          >
            重试卷轴
          </button>
        </div>
      </div>
    );
  }

  // Type Badge - Traditional styling
  const getTypeBadge = (type: QuestionType) => {
    let label = '';
    let colorClass = '';
    switch (type) {
      case QuestionType.ImageToVerse: 
        label = '画中诗'; 
        colorClass = 'text-jade-800 border-jade-800 bg-emerald-50';
        break;
      case QuestionType.TypoCorrection: 
        label = '正字音'; 
        colorClass = 'text-amber-800 border-amber-800 bg-amber-50';
        break;
      case QuestionType.KeywordTranslation: 
        label = '解词义'; 
        colorClass = 'text-indigo-900 border-indigo-900 bg-blue-50';
        break;
      case QuestionType.ThemeUnderstanding: 
        label = '悟诗情'; 
        colorClass = 'text-cinnabar-800 border-cinnabar-800 bg-rose-50';
        break;
    }
    return (
      <span className={`inline-block px-3 py-1 text-sm font-bold border-2 font-serif tracking-widest ${colorClass}`}>
        {label}
      </span>
    );
  };

  return (
    <div className="max-w-3xl mx-auto font-serif">
      {/* Navigation */}
      <div className="flex items-center justify-between mb-6 border-b border-ink-800/30 pb-2">
        <button onClick={onExit} className="text-ink-800 hover:text-cinnabar-700 font-bold text-sm flex items-center transition-colors">
            <span className="text-xl mr-1">‹</span> 返回
        </button>
        <div className="text-ink-500 font-serif text-sm tracking-widest">
           {poem.title} · 第 <span className="font-bold text-ink-900 text-lg">{state.currentQuestionIndex + 1}</span> / {poem.questions.length} 题
        </div>
      </div>

      {/* Ink Progress Bar */}
      <div className="w-full bg-stone-200 h-1 mb-8 relative overflow-hidden rounded-sm">
        <div
          className="bg-ink-800 h-full absolute top-0 left-0 transition-all duration-700 ease-out"
          style={{ 
            width: `${((state.currentQuestionIndex + 1) / poem.questions.length) * 100}%`,
            backgroundImage: 'linear-gradient(45deg, #292524 25%, #44403c 25%, #44403c 50%, #292524 50%, #292524 75%, #44403c 75%, #44403c 100%)',
            backgroundSize: '10px 10px'
          }}
        ></div>
      </div>

      {/* Main Card - Scroll Style */}
      <div className="bg-paper-50 shadow-[0_4px_20px_-5px_rgba(0,0,0,0.1)] border border-stone-300 relative">
        {/* Double border effect for framing */}
        <div className="border-4 border-double border-stone-200 p-1 m-1">
          
          {/* Image Generation Section */}
          {currentQuestion.type === QuestionType.ImageToVerse && (
            <div className="w-full h-72 bg-stone-100 border-b-2 border-stone-200 flex items-center justify-center overflow-hidden relative mb-4">
              {state.isGeneratingImage ? (
                <div className="text-center">
                  <div className="inline-block animate-spin text-4xl mb-2">☯</div>
                  <p className="text-ink-500 text-sm font-serif">墨韵生成中...</p>
                </div>
              ) : state.generatedImageUrl ? (
                <div className="relative w-full h-full group">
                  <img src={state.generatedImageUrl} alt="AI Scene" className="w-full h-full object-cover sepia-[.3] contrast-125" />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-900/30 to-transparent pointer-events-none"></div>
                </div>
              ) : (
                <div className="text-stone-400 text-sm italic">画卷未展</div>
              )}
              <div className="absolute top-4 right-4 bg-paper-50/90 text-ink-900 text-xs px-2 py-1 border border-ink-800 shadow-sm font-serif writing-vertical-lr">
                  AI 绘意
              </div>
            </div>
          )}

          <div className="p-6 md:p-10">
            <div className="mb-8 text-center md:text-left">
              <div className="mb-4 flex justify-center md:justify-start">
                {getTypeBadge(currentQuestion.type)}
              </div>
              <p className="text-xl md:text-2xl text-ink-900 leading-relaxed font-serif font-medium">
                  {currentQuestion.questionText}
              </p>
            </div>

            <div className="space-y-4">
              {currentQuestion.options.map((option, idx) => {
                let buttonStyle = "bg-paper-50 border-stone-300 text-ink-800 hover:border-ink-500 hover:bg-stone-50";
                
                if (state.showFeedback) {
                  if (option === currentQuestion.correctAnswer) {
                    buttonStyle = "bg-emerald-50 border-jade-800 text-jade-800 shadow-[inset_0_0_0_1px_#166534]";
                  } else if (option === state.selectedOption) {
                    buttonStyle = "bg-rose-50 border-cinnabar-700 text-cinnabar-800 shadow-[inset_0_0_0_1px_#b91c1c]";
                  } else {
                    buttonStyle = "opacity-40 bg-stone-50 border-stone-200";
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleOptionSelect(option)}
                    disabled={state.showFeedback}
                    className={`w-full text-left p-5 border-2 transition-all duration-300 group relative ${buttonStyle}`}
                  >
                    <span className="absolute left-0 top-0 bottom-0 w-10 flex items-center justify-center border-r border-stone-200/50 text-stone-400 font-serif italic text-lg group-hover:text-ink-500">
                      {['甲', '乙', '丙', '丁'][idx]}
                    </span>
                    <span className="pl-12 block font-serif text-lg tracking-wide">{option}</span>
                  </button>
                );
              })}
            </div>

            {state.showFeedback && (
              <div className="mt-8 p-6 bg-stone-50 border-t-2 border-stone-200 animate-fade-in relative">
                 <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-paper-50 px-4 border border-stone-200 text-stone-500 text-sm tracking-widest">
                    解析
                 </div>
                <div className="flex items-start gap-4">
                  <div className={`text-3xl ${state.selectedOption === currentQuestion.correctAnswer ? 'text-jade-700' : 'text-cinnabar-700'}`}>
                    {state.selectedOption === currentQuestion.correctAnswer ? '✓' : '✗'}
                  </div>
                  <div>
                    <p className={`font-bold mb-2 text-lg ${state.selectedOption === currentQuestion.correctAnswer ? 'text-jade-800' : 'text-cinnabar-800'}`}>
                      {state.selectedOption === currentQuestion.correctAnswer ? '甚善！' : '惜哉！'}
                    </p>
                    <p className="text-ink-800 leading-relaxed text-base">{currentQuestion.explanation}</p>
                  </div>
                </div>
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={nextQuestion}
                    className="group flex items-center gap-2 text-ink-900 font-bold hover:text-cinnabar-700 transition-colors"
                  >
                    <span className="font-serif tracking-widest text-lg">
                       {state.currentQuestionIndex + 1 >= poem.questions.length ? '查看榜单' : '下一题'}
                    </span>
                    <span className="text-2xl group-hover:translate-x-1 transition-transform">→</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quiz;