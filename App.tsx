import React, { useState } from 'react';
import Quiz from './components/Quiz';
import LiveTutor from './components/LiveTutor';
import PoemSelector from './components/PoemSelector';
import { poems } from './data';
import { Poem } from './types';

enum AppMode {
  QUIZ = 'quiz',
  TUTOR = 'tutor'
}

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.QUIZ);
  const [selectedPoem, setSelectedPoem] = useState<Poem | null>(null);

  return (
    <div className="min-h-screen pb-12 font-serif text-ink-900">
      {/* Header / Nav */}
      <header className="bg-paper-50 border-b-2 border-stone-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div 
            className="flex items-center gap-4 cursor-pointer group" 
            onClick={() => {
              setMode(AppMode.QUIZ);
              setSelectedPoem(null);
            }}
          >
             <div className="w-12 h-12 bg-ink-900 flex items-center justify-center text-paper-50 font-calligraphy text-2xl shadow-md border-2 border-stone-400 group-hover:bg-cinnabar-700 transition-colors">
               诗
             </div>
             <div>
               <h1 className="text-2xl font-calligraphy text-ink-900 tracking-widest group-hover:text-cinnabar-700 transition-colors">五年级古诗词</h1>
               <p className="text-xs text-ink-500 font-serif tracking-widest uppercase">Grade 5 Poetry Master</p>
             </div>
          </div>
          
          <div className="bg-stone-100 p-1 rounded-sm flex shadow-inner border border-stone-200">
            <button 
              onClick={() => {
                setMode(AppMode.QUIZ);
                setSelectedPoem(null);
              }}
              className={`px-6 py-2 rounded-sm text-sm font-bold font-serif tracking-wide transition-all ${
                mode === AppMode.QUIZ 
                  ? 'bg-paper-50 text-ink-900 shadow-sm border border-stone-300' 
                  : 'text-stone-500 hover:text-ink-700'
              }`}
            >
              闯关答题
            </button>
            <button 
              onClick={() => {
                setMode(AppMode.TUTOR);
                setSelectedPoem(null);
              }}
              className={`px-6 py-2 rounded-sm text-sm font-bold font-serif tracking-wide transition-all flex items-center gap-2 ${
                mode === AppMode.TUTOR 
                  ? 'bg-paper-50 text-ink-900 shadow-sm border border-stone-300' 
                  : 'text-stone-500 hover:text-ink-700'
              }`}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cinnabar-600 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cinnabar-700"></span>
              </span>
              AI 私教
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {mode === AppMode.QUIZ ? (
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
                <PoemSelector poems={poems} onSelect={setSelectedPoem} />
              </>
            ) : (
              <Quiz poem={selectedPoem} onExit={() => setSelectedPoem(null)} />
            )}
          </div>
        ) : (
          <div className="animate-fade-in-up">
            <LiveTutor isOpen={mode === AppMode.TUTOR} />
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-paper-50 p-6 border-2 border-stone-200 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-2 opacity-10 font-calligraphy text-6xl select-none">问</div>
                <h3 className="font-bold text-ink-900 mb-4 font-calligraphy text-xl tracking-wide border-b border-stone-200 pb-2">试问 AI</h3>
                <ul className="space-y-3 text-sm text-ink-800 font-serif">
                  <li className="flex gap-2 items-start">
                    <span className="text-cinnabar-700 mt-1">❖</span>
                    "请帮我背诵一下《村晚》。"
                  </li>
                  <li className="flex gap-2 items-start">
                    <span className="text-cinnabar-700 mt-1">❖</span>
                    "《稚子弄冰》里的‘磬’字怎么读？是什么意思？"
                  </li>
                  <li className="flex gap-2 items-start">
                    <span className="text-cinnabar-700 mt-1">❖</span>
                    "《闻官军收河南河北》表达了作者什么心情？"
                  </li>
                </ul>
              </div>
              <div className="bg-paper-50 p-6 border-2 border-stone-200 shadow-sm relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-2 opacity-10 font-calligraphy text-6xl select-none">注</div>
                 <h3 className="font-bold text-ink-900 mb-4 font-calligraphy text-xl tracking-wide border-b border-stone-200 pb-2">须知</h3>
                 <p className="text-sm text-ink-600 leading-relaxed font-serif">
                   AI 私教使用 Gemini Live API 进行实时语音交互。请确保麦克风权限已开启。在安静的书房环境下使用效果更佳。
                 </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;