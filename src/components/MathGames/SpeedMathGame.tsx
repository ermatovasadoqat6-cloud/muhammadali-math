import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { 
  Zap, 
  RotateCcw, 
  Trophy, 
  Clock, 
  Flame, 
  Check, 
  X as XIcon, 
  Play,
  Volume2
} from 'lucide-react';
import { sound } from '../../utils/audio';

type OperationType = '+' | '-' | '×' | '÷';

interface MathProblem {
  num1: number;
  num2: number;
  operation: OperationType;
  answer: number;
  options: number[];
}

export const SpeedMathGame: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [highestStreak, setHighestStreak] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return Number(localStorage.getItem('zukko_speed_high_score') || 0);
  });
  const [currentProblem, setCurrentProblem] = useState<MathProblem | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  // Generate random problem
  const generateProblem = (): MathProblem => {
    const ops: OperationType[] = ['+', '-', '×', '÷'];
    const op = ops[Math.floor(Math.random() * ops.length)];
    let n1 = 0;
    let n2 = 0;
    let ans = 0;

    if (op === '+') {
      n1 = Math.floor(Math.random() * 50) + 10;
      n2 = Math.floor(Math.random() * 50) + 5;
      ans = n1 + n2;
    } else if (op === '-') {
      n1 = Math.floor(Math.random() * 70) + 20;
      n2 = Math.floor(Math.random() * n1) + 5;
      ans = n1 - n2;
    } else if (op === '×') {
      n1 = Math.floor(Math.random() * 12) + 2;
      n2 = Math.floor(Math.random() * 12) + 2;
      ans = n1 * n2;
    } else {
      n2 = Math.floor(Math.random() * 9) + 2;
      ans = Math.floor(Math.random() * 12) + 2;
      n1 = n2 * ans;
    }

    // Generate 4 options
    const optionsSet = new Set<number>([ans]);
    while (optionsSet.size < 4) {
      const delta = (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 5) + 1);
      const fake = ans + delta;
      if (fake >= 0) optionsSet.add(fake);
    }

    const options = Array.from(optionsSet).sort(() => Math.random() - 0.5);

    return {
      num1: n1,
      num2: n2,
      operation: op,
      answer: ans,
      options,
    };
  };

  const startGame = () => {
    sound.playClick();
    setIsPlaying(true);
    setTimeLeft(60);
    setScore(0);
    setStreak(0);
    setHighestStreak(0);
    setFeedback(null);
    setCurrentProblem(generateProblem());
  };

  // Timer
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          finishGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlaying, score]);

  const finishGame = () => {
    setIsPlaying(false);
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('zukko_speed_high_score', String(score));
      sound.playFanfare();
      confetti({ particleCount: 100, spread: 80 });
    } else {
      sound.playCorrect();
    }
  };

  const handleSelectOption = (selectedAns: number) => {
    if (!isPlaying || !currentProblem) return;

    if (selectedAns === currentProblem.answer) {
      sound.playCorrect();
      setFeedback('correct');
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > highestStreak) setHighestStreak(newStreak);
      const multiplier = Math.min(4, Math.floor(newStreak / 3) + 1);
      setScore((prev) => prev + 10 * multiplier);
    } else {
      sound.playWrong();
      setFeedback('wrong');
      setStreak(0);
    }

    setTimeout(() => {
      setFeedback(null);
      setCurrentProblem(generateProblem());
    }, 300);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200 max-w-2xl mx-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-6 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
            <Zap className="w-6 h-6 fill-current" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900">Tezkor Hisob (Aqliy Sprint)</h3>
            <p className="text-xs text-slate-500">60 soniya ichida eng ko'p to'g'ri misollarni yeching!</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200">
          <Trophy className="w-4 h-4 text-amber-600" />
          <span className="text-xs font-bold text-amber-800">Rekord: {highScore} ball</span>
        </div>
      </div>

      {!isPlaying ? (
        <div className="py-12 text-center space-y-6">
          <div className="w-20 h-20 rounded-3xl bg-amber-50 text-amber-500 flex items-center justify-center mx-auto shadow-inner text-4xl">
            ⚡
          </div>

          <div>
            <h4 className="text-2xl font-black text-slate-800">Tayyormisiz?</h4>
            <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto mt-2">
              Ketma-ket to'g'ri topsangiz, ko'paytirgich (Streak multiplier) oshib boradi: 2x, 3x, 4x ball!
            </p>
          </div>

          <button
            onClick={startGame}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/30 transition-all transform hover:scale-105 active:scale-100"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>O'yinni Boshlash</span>
          </button>
        </div>
      ) : (
        <div className="py-4 space-y-6">
          {/* Game Stats Bar */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="text-2xl font-black text-indigo-700">{score}</div>
              <div className="text-[11px] text-slate-500 font-semibold">Ball</div>
            </div>

            <div
              className={`p-3 rounded-2xl border transition-colors ${
                timeLeft <= 10
                  ? 'bg-rose-50 border-rose-200 text-rose-600 animate-pulse'
                  : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}
            >
              <div className="text-2xl font-mono font-black">{timeLeft}s</div>
              <div className="text-[11px] font-semibold">Vaqt</div>
            </div>

            <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200">
              <div className="text-2xl font-black text-amber-600 flex items-center justify-center gap-1">
                <Flame className="w-5 h-5 fill-current" />
                <span>{streak}x</span>
              </div>
              <div className="text-[11px] text-amber-700 font-semibold">Ketma-ket</div>
            </div>
          </div>

          {/* Math Problem Card */}
          {currentProblem && (
            <div
              className={`p-8 rounded-3xl border-2 text-center transition-all ${
                feedback === 'correct'
                  ? 'border-emerald-500 bg-emerald-50/50'
                  : feedback === 'wrong'
                  ? 'border-rose-500 bg-rose-50/50'
                  : 'border-slate-200 bg-slate-50/60'
              }`}
            >
              <div className="text-4xl sm:text-5xl font-black text-slate-900 tracking-wider font-mono">
                {currentProblem.num1} {currentProblem.operation} {currentProblem.num2} = ?
              </div>

              {/* Multiplier bonus indicator */}
              {streak >= 3 && (
                <div className="mt-2 text-xs font-bold text-amber-600 flex items-center justify-center gap-1">
                  <Flame className="w-4 h-4 fill-current text-amber-500 animate-bounce" />
                  <span>Ajoyib! {Math.min(4, Math.floor(streak / 3) + 1)}x ko'paytirgich faol!</span>
                </div>
              )}
            </div>
          )}

          {/* Options Grid */}
          {currentProblem && (
            <div className="grid grid-cols-2 gap-3">
              {currentProblem.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleSelectOption(opt)}
                  className="py-4 rounded-2xl bg-white hover:bg-indigo-50/80 active:bg-indigo-100 border-2 border-slate-200 hover:border-indigo-400 text-slate-900 hover:text-indigo-700 font-black text-xl sm:text-2xl shadow-xs transition-all transform active:scale-95"
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
