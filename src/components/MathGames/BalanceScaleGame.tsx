import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Scale, RotateCcw, Check, ArrowRight, Sparkles, HelpCircle } from 'lucide-react';
import { sound } from '../../utils/audio';

interface EquationLevel {
  id: number;
  equation: string;
  leftX: number;
  leftConstant: number;
  rightX: number;
  rightConstant: number;
  correctX: number;
  hint: string;
}

const levels: EquationLevel[] = [
  {
    id: 1,
    equation: 'x + 4 = 11',
    leftX: 1,
    leftConstant: 4,
    rightX: 0,
    rightConstant: 11,
    correctX: 7,
    hint: "Ikkala tomondan 4 kg toshni olib tashlang: x = 11 - 4",
  },
  {
    id: 2,
    equation: '2x + 3 = 13',
    leftX: 2,
    leftConstant: 3,
    rightX: 0,
    rightConstant: 13,
    correctX: 5,
    hint: "Avval 3 ni ayiring: 2x = 10, so'ng 2 ga bo'ling: x = 5",
  },
  {
    id: 3,
    equation: '3x + 2 = 20',
    leftX: 3,
    leftConstant: 2,
    rightX: 0,
    rightConstant: 20,
    correctX: 6,
    hint: "3x = 18 => x = 18 / 3 => x = 6",
  },
  {
    id: 4,
    equation: '3x + 4 = x + 12',
    leftX: 3,
    leftConstant: 4,
    rightX: 1,
    rightConstant: 12,
    correctX: 4,
    hint: "Har ikkala tomondan 1 ta x va 4 kg ni olib tashlang: 2x = 8 => x = 4",
  },
  {
    id: 5,
    equation: '4x + 5 = 2x + 15',
    leftX: 4,
    leftConstant: 5,
    rightX: 2,
    rightConstant: 15,
    correctX: 5,
    hint: "4x - 2x = 15 - 5 => 2x = 10 => x = 5",
  },
];

export const BalanceScaleGame: React.FC = () => {
  const [levelIndex, setLevelIndex] = useState(0);
  const [guessX, setGuessX] = useState<number>(1);
  const [isBalanced, setIsBalanced] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);

  const level = levels[levelIndex];

  const leftWeight = level.leftX * guessX + level.leftConstant;
  const rightWeight = level.rightX * guessX + level.rightConstant;
  const difference = leftWeight - rightWeight;

  // Max tilt angle is ~15 degrees
  const tiltAngle = Math.max(-14, Math.min(14, difference * 2));

  const handleGuessChange = (val: number) => {
    sound.playClick();
    setGuessX(val);
    if (val === level.correctX) {
      if (!isBalanced) {
        sound.playCorrect();
        setIsBalanced(true);
        setScore((s) => s + 50);
        confetti({ particleCount: 50, spread: 60 });
      }
    } else {
      setIsBalanced(false);
    }
  };

  const handleNextLevel = () => {
    sound.playClick();
    if (levelIndex < levels.length - 1) {
      setLevelIndex(levelIndex + 1);
      setGuessX(1);
      setIsBalanced(false);
      setShowHint(false);
    } else {
      sound.playFanfare();
      alert("Tabriklaymiz! Tenglama tarozisining barcha bosqichlarini muvaffaqiyatli yakunladingiz!");
    }
  };

  const handleReset = () => {
    sound.playClick();
    setGuessX(1);
    setIsBalanced(false);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200 max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Scale className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900">Tenglama Tarozisi</h3>
            <p className="text-xs text-slate-500">
              Noma'lum x ning qiymatini topib, tarozini muvozanatga keltiring!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700">
            Bosqich {levelIndex + 1} / {levels.length}
          </span>
          <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-amber-50 text-amber-800">
            Ball: {score}
          </span>
        </div>
      </div>

      {/* Equation Banner */}
      <div className="p-4 rounded-2xl bg-indigo-900 text-white text-center shadow-inner">
        <span className="text-xs uppercase tracking-widest text-indigo-300 font-semibold">
          Yechilishi kerak bo'lgan tenglama:
        </span>
        <div className="text-2xl sm:text-3xl font-black font-mono tracking-wider mt-1 text-amber-300">
          {level.equation}
        </div>
      </div>

      {/* Visual Animated Balance Scale */}
      <div className="relative h-64 sm:h-72 w-full bg-gradient-to-b from-slate-50 to-indigo-50/40 rounded-3xl border border-slate-200 p-4 flex flex-col justify-end items-center overflow-hidden">
        {/* Balance Status indicator */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 text-xs font-bold px-4 py-1.5 rounded-full shadow-2xs backdrop-blur-xs transition-all z-10 flex items-center gap-1.5">
          {isBalanced ? (
            <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full border border-emerald-300 flex items-center gap-1">
              <Check className="w-3.5 h-3.5" />
              Tarozi muvozanatda! x = {guessX}
            </span>
          ) : difference > 0 ? (
            <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full border border-amber-300">
              Chap palla og'irroq ({leftWeight} &gt; {rightWeight})
            </span>
          ) : (
            <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full border border-amber-300">
              O'ng palla og'irroq ({leftWeight} &lt; {rightWeight})
            </span>
          )}
        </div>

        {/* Central Stand / Fulcrum */}
        <div className="relative w-full flex justify-center items-end">
          {/* Fulcrum base */}
          <div className="w-12 h-28 bg-gradient-to-t from-slate-400 to-slate-500 rounded-t-lg shadow-md z-0" />
          <div className="absolute bottom-28 w-6 h-6 bg-slate-700 rounded-full border-2 border-white shadow-sm z-20" />

          {/* Tilting Beam */}
          <div
            className="absolute bottom-28 w-[80%] sm:w-[70%] h-3 bg-slate-700 rounded-full shadow-md transition-transform duration-300 origin-center flex justify-between items-center"
            style={{ transform: `rotate(${tiltAngle}deg)` }}
          >
            {/* Left Pan Attachment */}
            <div
              className="absolute -left-6 sm:-left-8 top-1 flex flex-col items-center origin-top transition-transform duration-300"
              style={{ transform: `rotate(${-tiltAngle}deg)` }}
            >
              {/* Chains */}
              <div className="w-12 sm:w-16 h-14 border-l-2 border-r-2 border-slate-400/80 -mt-1" />
              {/* Left Pan Plate */}
              <div className="w-24 sm:w-32 h-6 bg-amber-400 rounded-b-2xl border-t-2 border-amber-500 shadow-md flex items-center justify-center text-xs font-black text-amber-950">
                Chap: {leftWeight} kg
              </div>
              {/* Left Blocks */}
              <div className="absolute -top-12 flex items-end gap-1">
                {Array.from({ length: level.leftX }).map((_, i) => (
                  <div
                    key={i}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-indigo-600 text-white font-black text-xs flex items-center justify-center shadow-xs border border-indigo-700"
                  >
                    x
                  </div>
                ))}
                {level.leftConstant > 0 && (
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-amber-500 text-white font-bold text-xs flex items-center justify-center shadow-xs border border-amber-600">
                    +{level.leftConstant}
                  </div>
                )}
              </div>
            </div>

            {/* Right Pan Attachment */}
            <div
              className="absolute -right-6 sm:-right-8 top-1 flex flex-col items-center origin-top transition-transform duration-300"
              style={{ transform: `rotate(${-tiltAngle}deg)` }}
            >
              {/* Chains */}
              <div className="w-12 sm:w-16 h-14 border-l-2 border-r-2 border-slate-400/80 -mt-1" />
              {/* Right Pan Plate */}
              <div className="w-24 sm:w-32 h-6 bg-sky-400 rounded-b-2xl border-t-2 border-sky-500 shadow-md flex items-center justify-center text-xs font-black text-sky-950">
                O'ng: {rightWeight} kg
              </div>
              {/* Right Blocks */}
              <div className="absolute -top-12 flex items-end gap-1">
                {Array.from({ length: level.rightX }).map((_, i) => (
                  <div
                    key={i}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-indigo-600 text-white font-black text-xs flex items-center justify-center shadow-xs border border-indigo-700"
                  >
                    x
                  </div>
                ))}
                {level.rightConstant > 0 && (
                  <div className="w-8 h-8 rounded-lg bg-sky-500 text-white font-bold text-xs flex items-center justify-center shadow-xs border border-sky-600">
                    +{level.rightConstant}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls & Guess Slider */}
      <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-xs sm:text-sm font-bold text-slate-800">
            Noma'lum x ning og'irligi (kg):
          </label>
          <span className="text-2xl font-black text-indigo-700 font-mono px-3 py-1 bg-white rounded-xl border border-slate-200">
            x = {guessX}
          </span>
        </div>

        {/* Slider */}
        <input
          type="range"
          min={1}
          max={15}
          value={guessX}
          onChange={(e) => handleGuessChange(Number(e.target.value))}
          className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
        />

        {/* Quick buttons */}
        <div className="flex items-center justify-between gap-1 overflow-x-auto py-1">
          {Array.from({ length: 12 }, (_, i) => i + 1).map((val) => (
            <button
              key={val}
              onClick={() => handleGuessChange(val)}
              className={`w-9 h-9 rounded-xl text-xs font-bold shrink-0 transition-colors ${
                guessX === val
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {val}
            </button>
          ))}
        </div>
      </div>

      {/* Hint & Next Level Footer */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <button
          onClick={() => {
            sound.playClick();
            setShowHint(!showHint);
          }}
          className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 hover:text-amber-800"
        >
          <HelpCircle className="w-4 h-4" />
          <span>{showHint ? "Maslahatni yopish" : "Ustoz maslahati"}</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-semibold transition-colors"
            title="Qayta urinish"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {isBalanced && (
            <button
              onClick={handleNextLevel}
              className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-200 transition-colors animate-bounce"
            >
              <span>Keyingi Bosqich</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {showHint && (
        <div className="p-3.5 bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl text-xs sm:text-sm animate-in fade-in">
          💡 <strong>Yechish yo'li:</strong> {level.hint}
        </div>
      )}
    </div>
  );
};
