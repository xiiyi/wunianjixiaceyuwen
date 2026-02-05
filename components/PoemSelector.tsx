import React from 'react';
import { Poem } from '../types';

interface PoemSelectorProps {
  poems: Poem[];
  onSelect: (poem: Poem) => void;
}

const PoemSelector: React.FC<PoemSelectorProps> = ({ poems, onSelect }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up">
      {poems.map((poem) => (
        <button
          key={poem.id}
          onClick={() => onSelect(poem)}
          className="group relative overflow-hidden bg-paper-50 rounded-sm border-2 border-stone-200 hover:border-ink-800 transition-all duration-500 text-left shadow-sm hover:shadow-md"
        >
          {/* Vertical text background decoration */}
          <div className="absolute top-2 right-4 text-8xl font-calligraphy text-stone-100 select-none group-hover:text-stone-200 transition-colors">
            诗
          </div>
          
          <div className="p-6 relative z-10">
            <div className="flex justify-between items-start mb-6">
              <span className="bg-ink-800 text-paper-50 text-xs font-serif px-2 py-1 tracking-widest border border-ink-800">
                必背
              </span>
            </div>
            
            <h3 className="text-2xl font-calligraphy text-ink-900 mb-2 group-hover:text-cinnabar-700 transition-colors">
              {poem.title}
            </h3>
            <p className="text-ink-500 text-sm font-serif mb-6 tracking-wide border-b border-stone-200 pb-2 inline-block">
              {poem.author}
            </p>
            
            <div className="flex items-center text-ink-800 text-sm font-bold opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-500 font-serif tracking-widest">
              展卷挑战 
              <span className="ml-2 text-lg">→</span>
            </div>
          </div>
          
          {/* Bottom decorative pattern */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-stone-200 via-ink-800 to-stone-200 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </button>
      ))}
      
      {/* Placeholder for others */}
      <div className="border-2 border-dashed border-stone-300 rounded-sm flex items-center justify-center p-6 text-stone-400 font-serif text-sm tracking-widest bg-transparent">
        待续...
      </div>
    </div>
  );
};

export default PoemSelector;