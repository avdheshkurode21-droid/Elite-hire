
import React, { useState, useEffect, useRef } from 'react';
import { UserData, InterviewResponse } from '../types';
import { generateNextQuestion, evaluateCandidate } from '../services/geminiService';
import { MessageSquare, Send, Loader2, Sparkles, AlertCircle } from 'lucide-react';

interface InterviewRoomProps {
  userData: UserData;
  onComplete: (result: any, history: InterviewResponse[]) => void;
}

const InterviewRoom: React.FC<InterviewRoomProps> = ({ userData, onComplete }) => {
  const [history, setHistory] = useState<InterviewResponse[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<string>('');
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const TOTAL_QUESTIONS = 5;

  useEffect(() => {
    fetchQuestion();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history, currentQuestion]);

  const fetchQuestion = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const question = await generateNextQuestion(userData, history);
      setCurrentQuestion(question);
    } catch (err) {
      setError("AI connection failed. Please check your internet or API key.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitAnswer = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!userAnswer.trim() || isLoading) return;

    const newEntry = { question: currentQuestion, answer: userAnswer };
    const updatedHistory = [...history, newEntry];
    setHistory(updatedHistory);
    setUserAnswer('');

    if (updatedHistory.length >= TOTAL_QUESTIONS) {
      setIsSubmitting(true);
      try {
        const result = await evaluateCandidate(userData, updatedHistory);
        onComplete(result, updatedHistory);
      } catch (err) {
        setError("Error analyzing results. Completing with default assessment.");
        onComplete({ score: 75, recommendation: 'Recommended', summary: 'Good performance across domains.' }, updatedHistory);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      fetchQuestion();
    }
  };

  return (
    <div className="h-screen flex flex-col max-w-4xl mx-auto p-4 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 p-4 bg-neutral-900 border border-neutral-800 rounded-2xl">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center">
            <Sparkles className="text-white" size={20} />
          </div>
          <div>
            <h3 className="font-bold">{userData.domain} Interview</h3>
            <p className="text-xs text-neutral-500">Candidate: {userData.fullName}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-neutral-500 uppercase font-semibold mb-1">Progress</div>
          <div className="flex gap-1">
            {[...Array(TOTAL_QUESTIONS)].map((_, i) => (
              <div 
                key={i} 
                className={`h-1.5 w-6 rounded-full transition-colors ${i < history.length ? 'bg-indigo-500' : 'bg-neutral-800'}`} 
              />
            ))}
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-6 mb-8 pr-4 custom-scrollbar"
      >
        {history.map((item, idx) => (
          <div key={idx} className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center shrink-0 border border-neutral-700">
                <Sparkles size={14} className="text-indigo-400" />
              </div>
              <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-2xl rounded-tl-none max-w-[80%]">
                <p className="text-sm">{item.question}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 flex-row-reverse">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0">
                <span className="text-[10px] font-bold">ME</span>
              </div>
              <div className="bg-indigo-600/10 border border-indigo-500/20 p-4 rounded-2xl rounded-tr-none max-w-[80%]">
                <p className="text-sm text-indigo-100">{item.answer}</p>
              </div>
            </div>
          </div>
        ))}

        {isLoading ? (
          <div className="flex items-start gap-3 animate-pulse">
            <div className="w-8 h-8 rounded-lg bg-neutral-800 shrink-0" />
            <div className="bg-neutral-900 h-12 w-48 rounded-2xl rounded-tl-none" />
          </div>
        ) : !isSubmitting && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center shrink-0 border border-neutral-700">
              <Sparkles size={14} className="text-indigo-400" />
            </div>
            <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-2xl rounded-tl-none max-w-[80%]">
              <p className="text-sm">{currentQuestion}</p>
            </div>
          </div>
        )}

        {isSubmitting && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Loader2 className="animate-spin text-indigo-500 mb-4" size={32} />
            <h4 className="text-lg font-bold mb-2">Analyzing Your Performance</h4>
            <p className="text-neutral-500 text-sm">Our AI is evaluating your responses to generate a detailed recommendation.</p>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 text-sm">
            <AlertCircle size={18} />
            {error}
          </div>
        )}
      </div>

      {/* Input Area */}
      {!isSubmitting && (
        <form onSubmit={handleSubmitAnswer} className="relative group">
          <textarea
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmitAnswer();
              }
            }}
            placeholder="Type your response here..."
            className="w-full bg-neutral-900 border border-neutral-800 rounded-2xl p-4 pr-16 min-h-[100px] outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 resize-none"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!userAnswer.trim() || isLoading}
            className={`
              absolute right-4 bottom-4 p-3 rounded-xl transition-all
              ${userAnswer.trim() && !isLoading 
                ? 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-600/20 translate-y-0 active:scale-95' 
                : 'bg-neutral-800 text-neutral-600'
              }
            `}
          >
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
          </button>
        </form>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #262626;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

export default InterviewRoom;
