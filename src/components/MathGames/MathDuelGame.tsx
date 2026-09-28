import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Swords, RotateCcw, Trophy, Play, Users } from 'lucide-react';
import { sound } from '../../utils/audio';

interface DuelProblem {
  question: string;
  answer: number;
  options: number[];
}

export const MathDuelGame: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [player1Name, setPlayer1Name] = useState("1-O'quvchi");
  const [player2Name, setPlayer2Name] = useState("2-O'quvchi");
  const [score1, setScore1] = useState(0);
  const [score2, setScore2] = useState(0);
  const [winner, setWinner] = useState<string | null>(null);
  const [currentProblem, setCurrentProblem] = useState<DuelProblem | null>(null);

  const WIN_SCORE = 50;

  const generateProblem = (): DuelProblem => {
    const isMult = Math.random() > 0.4;
    let n1: number, n2: number, ans: number;

    if (isMult) {
      n1 = Math.floor(Math.random() * 10) + 2;
      n2 = Math.floor(Math.random() * 10) + 2;
      ans = n1 * n2;
      return {
        question: `${n1} × ${n2}`,
        answer: ans,
        options: generateOptions(ans),
      };
    } else {
      n1 = Math.floor(Math.random() * 50) + 15;
      n2 = Math.floor(Math.random() * 40) + 10;
      const isAdd = Math.random() > 0.5;
      ans = isAdd ? n1 + n2 : n1 - n2;
      return {
        question: `${n1} ${isAdd ? '+' : '-'} ${n2}`,
        answer: ans,
        options: generateOptions(ans),
      };
    }
  };

  const generateOptions = (ans: number): number[] => {
    const set = new Set<number>([ans]);
    while (set.size < 4) {
      const delta = (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 6) + 1);
      const fake = ans + delta;
      if (fake >= 0) set.add(fake);
    }
    return Array.from(set).sort(() => Math.random() - 0.5);
  };

  const startDuel = () => {
    sound.playClick();
    setIsPlaying(true);
    setScore1(0);
    setScore2(0);
    setWinner(null);
    setCurrentProblem(generateProblem());
  };

  const handlePlayerAnswer = (player: 1 | 2, selected: number) => {
    if (!isPlaying || !currentProblem || winner) return;

    if (selected === currentProblem.answer) {
      sound.playCorrect();
      if (player === 1) {
        const nextScore = score1 + 10;
        setScore1(nextScore);
        if (nextScore >= WIN_SCORE) {
          endDuel(player1Name);
          return;
        }
      } else {
        const nextScore = score2 + 10;
        setScore2(nextScore);
        if (nextScore >= WIN_SCORE) {
          endDuel(player2Name);
          return;
        }
      }
      setCurrentProblem(generateProblem());
    } else {
      sound.playWrong();
      // Penalty for wrong guess
      if (player === 1) setScore1((s) => Math.max(0, s - 5));
      if (player === 2) setScore2((s) => Math.max(0, s - 5));
    }
  };

  const endDuel = (winnerName: string) => {
    sound.playFanfare();
    setWinner(winnerName);
    setIsPlaying(false);
    confetti({ particleCount: 100, spread: 80 });
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <Swords className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900">Matematik Duel (2 O'quvchi Bahsi)</h3>
            <p className="text-xs text-slate-500">
              Sinf doskasida yoki kompyuterda ikkita o'quvchi kim tezroq hisoblash bo'yicha bellashadi!
            </p>
          </div>
        </div>

        <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700">
          G'alaba: {WIN_SCORE} ball
        </span>
      </div>

      {!isPlaying && !winner ? (
        <div className="py-8 text-center space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto text-left">
            <div className="p-4 bg-blue-50/80 rounded-2xl border border-blue-200">
              <label className="block text-xs font-bold text-blue-900 uppercase mb-1">
                1-O'quvchi (Moviy taraf)
              </label>
              <input
                type="text"
                value={player1Name}
                onChange={(e) => setPlayer1Name(e.target.value)}
                className="w-full px-3 py-2 bg-white rounded-xl border border-blue-200 text-xs sm:text-sm font-bold"
              />
            </div>

            <div className="p-4 bg-rose-50/80 rounded-2xl border border-rose-200">
              <label className="block text-xs font-bold text-rose-900 uppercase mb-1">
                2-O'quvchi (Qizil taraf)
              </label>
              <input
                type="text"
                value={player2Name}
                onChange={(e) => setPlayer2Name(e.target.value)}
                className="w-full px-3 py-2 bg-white rounded-xl border border-rose-200 text-xs sm:text-sm font-bold"
              />
            </div>
          </div>

          <button
            onClick={startDuel}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-rose-500 to-indigo-600 hover:from-rose-600 hover:to-indigo-700 text-white font-black text-sm shadow-xl transition-all transform hover:scale-105"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Duelni Boshlash ⚔️</span>
          </button>
        </div>
      ) : winner ? (
        <div className="py-12 text-center space-y-4 animate-in fade-in">
          <div className="w-20 h-20 rounded-3xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto text-4xl shadow-inner">
            🏆
          </div>
          <h4 className="text-3xl font-black text-slate-900">
            {winner} G'alaba Qozondi!
          </h4>
          <p className="text-sm text-slate-500">
            Hisob: {score1} : {score2}
          </p>
          <button
            onClick={startDuel}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md"
          >
            Yana bir bor o'ynash
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Central Question Display */}
          {currentProblem && (
            <div className="p-6 bg-slate-900 text-white rounded-3xl text-center shadow-lg">
              <span className="text-xs uppercase tracking-widest text-slate-400 font-bold">
                Kim birinchi topar ekan?
              </span>
              <div className="text-4xl sm:text-5xl font-black font-mono mt-1 text-amber-300">
                {currentProblem.question} = ?
              </div>
            </div>
          )}

          {/* Split Screen Battle Area */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Player 1 Side */}
            <div className="p-5 rounded-3xl bg-blue-50/70 border-2 border-blue-300 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-black text-blue-900">{player1Name}</span>
                <span className="text-lg font-black text-blue-700 font-mono">
                  {score1} / {WIN_SCORE}
                </span>
              </div>
              <div className="w-full bg-blue-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-blue-600 h-full transition-all duration-300"
                  style={{ width: `${Math.min(100, (score1 / WIN_SCORE) * 100)}%` }}
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5 pt-2">
                {currentProblem?.options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handlePlayerAnswer(1, opt)}
                    className="py-4 bg-white hover:bg-blue-600 hover:text-white text-blue-950 font-black text-xl rounded-2xl border border-blue-200 shadow-2xs transition-all active:scale-95"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Player 2 Side */}
            <div className="p-5 rounded-3xl bg-rose-50/70 border-2 border-rose-300 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-black text-rose-900">{player2Name}</span>
                <span className="text-lg font-black text-rose-700 font-mono">
                  {score2} / {WIN_SCORE}
                </span>
              </div>
              <div className="w-full bg-rose-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-rose-600 h-full transition-all duration-300"
                  style={{ width: `${Math.min(100, (score2 / WIN_SCORE) * 100)}%` }}
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5 pt-2">
                {currentProblem?.options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handlePlayerAnswer(2, opt)}
                    className="py-4 bg-white hover:bg-rose-600 hover:text-white text-rose-950 font-black text-xl rounded-2xl border border-rose-200 shadow-2xs transition-all active:scale-95"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
