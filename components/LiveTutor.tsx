import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { createPcmBlob, decode, decodeAudioData } from '../utils/audioUtils';
import Visualizer from './Visualizer';

// 检查是否配置了有效的 API Key
const apiKey = process.env.API_KEY || '';
const isApiKeyValid = apiKey && apiKey !== 'PLACEHOLDER_API_KEY' && apiKey.length > 10;

interface LiveTutorProps {
  isOpen: boolean;
}

const LiveTutor: React.FC<LiveTutorProps> = ({ isOpen }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false); // Model is speaking
  const [isApiReady, setIsApiReady] = useState(isApiKeyValid);

  // Audio Context Refs
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const inputAnalyserRef = useRef<AnalyserNode | null>(null);

  // State Refs for Logic
  const sessionRef = useRef<any>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const activeSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  // Cleanup function
  const stopSession = () => {
    if (sessionRef.current) {
      sessionRef.current.close();
      sessionRef.current = null;
    }

    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    if (sourceRef.current) {
      sourceRef.current.disconnect();
      sourceRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    // Stop all currently playing audio
    activeSourcesRef.current.forEach(source => {
      try { source.stop(); } catch (e) { }
    });
    activeSourcesRef.current.clear();

    if (inputAudioContextRef.current) {
      inputAudioContextRef.current.close();
      inputAudioContextRef.current = null;
    }
    if (outputAudioContextRef.current) {
      outputAudioContextRef.current.close();
      outputAudioContextRef.current = null;
    }

    setIsConnected(false);
    setIsSpeaking(false);
  };

  const startSession = async () => {
    try {
      setError(null);

      // Initialize Audio Contexts
      inputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });

      // Setup Analyser for visualizer
      inputAnalyserRef.current = inputAudioContextRef.current.createAnalyser();
      inputAnalyserRef.current.fftSize = 256;

      // Microphone Access
      streamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });

      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

      // Connect to Live API
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            console.log('Gemini Live Connection Opened');
            setIsConnected(true);

            // Setup Input Processing
            if (!inputAudioContextRef.current || !streamRef.current) return;

            sourceRef.current = inputAudioContextRef.current.createMediaStreamSource(streamRef.current);
            sourceRef.current.connect(inputAnalyserRef.current!); // Connect to analyser

            // ScriptProcessor for PCM extraction
            processorRef.current = inputAudioContextRef.current.createScriptProcessor(4096, 1, 1);

            processorRef.current.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const pcmBlob = createPcmBlob(inputData);

              sessionPromise.then(session => {
                session.sendRealtimeInput({ media: pcmBlob });
              });
            };

            sourceRef.current.connect(processorRef.current);
            processorRef.current.connect(inputAudioContextRef.current.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            // Handle Audio Output
            const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;

            if (base64Audio && outputAudioContextRef.current) {
              setIsSpeaking(true);
              const ctx = outputAudioContextRef.current;

              // Ensure time sync
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);

              const audioBuffer = await decodeAudioData(
                decode(base64Audio),
                ctx,
                24000
              );

              const source = ctx.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(ctx.destination);

              source.addEventListener('ended', () => {
                activeSourcesRef.current.delete(source);
                if (activeSourcesRef.current.size === 0) {
                  setIsSpeaking(false);
                }
              });

              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              activeSourcesRef.current.add(source);
            }

            // Handle Interruptions
            if (message.serverContent?.interrupted) {
              activeSourcesRef.current.forEach(s => s.stop());
              activeSourcesRef.current.clear();
              nextStartTimeRef.current = 0;
              setIsSpeaking(false);
            }
          },
          onclose: () => {
            console.log('Gemini Live Connection Closed');
            setIsConnected(false);
          },
          onerror: (err) => {
            console.error("Gemini Live Error:", err);
            setError("Connection error. Please try again.");
            stopSession();
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          systemInstruction: `You are a friendly and knowledgeable ancient Chinese poetry tutor for a 5th-grade student. 
          The student is reviewing specific poems like "Four Seasons", "Child Playing with Ice", "Village Evening", "Song of the Parting Son", etc.
          Your goal is to help them understand the meaning, correct typos, and appreciate the emotions.
          Speak in a warm, encouraging, and clear Chinese voice suitable for children.
          Keep answers concise and interactive. Ask them if they want to try a line from the poems.`,
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } }
          }
        }
      });

      sessionRef.current = await sessionPromise;

    } catch (e: any) {
      console.error(e);
      setError(e.message || "Failed to start session");
      setIsConnected(false);
    }
  };

  useEffect(() => {
    // Clean up on unmount
    return () => stopSession();
  }, []);

  if (!isOpen) return null;

  // 如果 API Key 未配置，显示提示
  if (!isApiReady) {
    return (
      <div className="bg-paper-50 border-2 border-stone-200 p-6 shadow-sm max-w-md w-full mx-auto mt-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-2 opacity-10 font-calligraphy text-6xl select-none">私</div>
        <div className="text-center mb-6">
          <h2 className="text-xl font-calligraphy font-bold text-ink-900 mb-2 tracking-wide">AI 诗词私教</h2>
          <div className="w-16 h-px bg-stone-300 mx-auto mb-4"></div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded p-4 mb-4">
          <div className="flex items-start gap-3">
            <span className="text-amber-600 text-xl">⚠️</span>
            <div>
              <p className="text-amber-800 font-bold text-sm mb-2">需要配置 API Key</p>
              <p className="text-amber-700 text-sm leading-relaxed">
                AI 私教功能需要配置 Gemini API Key 才能使用。请在项目根目录的 <code className="bg-amber-100 px-1 rounded">.env.local</code> 文件中设置：
              </p>
              <pre className="mt-2 bg-amber-100 p-2 rounded text-xs font-mono text-amber-800 overflow-x-auto">
                GEMINI_API_KEY=your_api_key_here
              </pre>
            </div>
          </div>
        </div>

        <div className="text-center text-sm text-ink-500">
          <p>获取 API Key：<a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer" className="text-cinnabar-700 hover:underline">Google AI Studio</a></p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-paper-50 border-2 border-stone-200 p-6 shadow-sm max-w-md w-full mx-auto mt-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-2 opacity-10 font-calligraphy text-6xl select-none">私</div>
      <div className="text-center mb-6">
        <h2 className="text-xl font-calligraphy font-bold text-ink-900 mb-2 tracking-wide">AI 诗词私教</h2>
        <p className="text-sm text-ink-500 font-serif">点击"开始"进行语音对话，练习古诗背诵与理解。</p>
      </div>

      <div className="flex flex-col items-center justify-center space-y-6">
        {/* Visualizer Area */}
        <div className="w-full h-32 bg-stone-50 border border-stone-200 flex items-center justify-center overflow-hidden relative">
          {isConnected ? (
            <Visualizer analyser={inputAnalyserRef.current} isActive={isConnected} />
          ) : (
            <div className="text-stone-400 text-sm font-serif italic">等待连接...</div>
          )}

          {isSpeaking && (
            <div className="absolute top-2 right-2 bg-cinnabar-700 text-paper-50 px-2 py-0.5 text-xs font-bold animate-pulse font-serif">
              AI 说...
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex gap-4">
          {!isConnected ? (
            <button
              onClick={startSession}
              className="px-8 py-3 bg-ink-800 hover:bg-ink-900 text-paper-50 font-bold shadow-md transition-all active:scale-95 flex items-center gap-2 font-serif tracking-widest"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" /></svg>
              开始对话
            </button>
          ) : (
            <button
              onClick={stopSession}
              className="px-8 py-3 bg-cinnabar-700 hover:bg-cinnabar-800 text-paper-50 font-bold shadow-md transition-all active:scale-95 flex items-center gap-2 font-serif tracking-widest"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" /></svg>
              结束通话
            </button>
          )}
        </div>

        {error && (
          <div className="text-cinnabar-700 text-sm bg-rose-50 px-3 py-2 border border-cinnabar-200 font-serif">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveTutor;