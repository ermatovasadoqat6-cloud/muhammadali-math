import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { PieChart, Check, RotateCcw, Award, ArrowRight, Sparkles } from 'lucide-react';
import { sound } from '../../utils/audio';

interface FractionChallenge {
  id: number;
  numerator: number;
  denominator: number;
  decimal: string;
  percent: string;
  equivalent: string;
}

const challenges: FractionChallenge[] = [
  { id: 1, numerator: 1, denominator: 2, decimal: '0.5', percent: '50%', equivalent: '2/4' },
  { id: 2, numerator: 3, denominator: 4, decimal: '0.75', percent: '75%', equivalent: '6/8' },
  { id: 3, numerator: 2, denominator: 5, decimal: '0.4', percent: '40%', equivalent: '4/10' },
  { id: 4, numerator: 5, denominator: 8, decimal: '0.625', percent: '62.5%', equivalent: '10/16' },
  { id: 5, numerator: 2, denominator: 3, decimal: '0.667', percent: '66.7%', equivalent: '4/6' },
];

export const FractionMozaikGame: React.FC = () => {
  const [level, setLevel] = useState(0);
  const [selectedSlices, setSelectedSlices] = useState<number[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [score, setScore] = useState(0);

  const current = challenges[level];

  const toggleSlice = (idx: number) => {
    sound.playClick();
    if (selectedSlices.includes(idx)) {
      setSelectedSlices(selectedSlices.filter((i) => i !== idx));
    } else {
      setSelectedSlices([...selectedSlices, idx]);
    }
  };

  const handleCheck = () => {
    if (selectedSlices.length === current.numerator) {
      sound.playCorrect();
      setIsSuccess(true);
      setScore((s) => s + 40);
      confetti({ particleCount: 40, spread: 60 });
    } else {
      sound.playWrong();
      alert(`Siz ${selectedSlices.length} ta bo'lakni tanladingiz. Bizga esa ${current.numerator}/${current.denominator} qismi kerak!`);
    }
  };

  const handleNext = () => {
    sound.playClick();
    if (level < challenges.length - 1) {
      setLevel(level + 1);
      setSelectedSlices([]);
      setSelectedMatch(null);
      setIsSuccess(false);
    } else {
      sound.playFanfare();
      alert("Tabriklaymiz! Kasrlar mozaikasi bo'limini a'lo darajada o'zlashtirdingiz!");
    }
  };

  // Generate SVG Pie Slices
  const renderPie = () => {
    const total = current.denominator;
    const radius = 90;
    const center = 100;
    const slices = [];

    for (let i = 0; i < total; i++) {
      const startAngle = (i * 2 * Math.PI) / total - Math.PI / 2;
      const endAngle = ((i + 1) * 2 * Math.PI) / total - Math.PI / 2;

      const x1 = center + radius * Math.cos(startAngle);
      const y1 = center + radius * Math.sin(startAngle);
      const x2 = center + radius * Math.cos(endAngle);
      const y2 = center + radius * Math.sin(endAngle);

      const isSelected = selectedSlices.includes(i);
      const pathData = `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2} Z`;

      slices.push(
        <path
          key={i}
          d={pathData}
          onClick={() => toggleSlice(i)}
          className={`cursor-pointer transition-all duration-200 stroke-white stroke-2 ${
            isSelected
              ? 'fill-indigo-600 hover:fill-indigo-700'
              : 'fill-slate-200 hover:fill-indigo-200'
          }`}
        />
      );
    }

    return (
      <svg viewBox="0 0 200 200" className="w-52 h-52 sm:w-60 sm:h-60 mx-auto drop-shadow-md">
        {slices}
      </svg>
    );
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200 max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <PieChart className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900">Kasrlar Mozaikasi</h3>
            <p className="text-xs text-slate-500">Doiraning kerakli bo'laklarini bo'yab, kasrni ifodalang</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700">
            {level + 1} / {challenges.length}
          </span>
          <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-amber-50 text-amber-800">
            {score} ball
          </span>
        </div>
      </div>

      {/* Target Fraction Banner */}
      <div className="p-4 rounded-2xl bg-indigo-950 text-white text-center">
        <p className="text-xs uppercase tracking-wider text-indigo-300 font-semibold mb-1">
          Topshiriq: Doiraning quyidagi kasr qismini belgilang:
        </p>
        <div className="text-3xl sm:text-4xl font-black text-amber-300 font-mono">
          {current.numerator} / {current.denominator}
        </div>
      </div>

      {/* Visual Pie */}
      <div className="py-4 text-center">
        {renderPie()}
        <p className="text-xs text-slate-400 mt-3">
          Bo'laklarni tanlash yoki bekor qilish uchun ularni bosing
        </p>
      </div>

      {/* Progress & Check Bar */}
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-xs font-semibold text-slate-700">
          Tanlandi: <strong className="text-indigo-700 text-sm font-bold">{selectedSlices.length}</strong> / {current.denominator} bo'lak
        </div>

        {!isSuccess ? (
          <button
            onClick={handleCheck}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-200 transition-colors"
          >
            Tekshirish
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
              <Check className="w-4 h-4" /> Ajoyib! To'g'ri!
            </span>
            <button
              onClick={handleNext}
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-200"
            >
              <span>Keyingisi</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Equivalent representations box (educational insight) */}
      {isSuccess && (
        <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs sm:text-sm text-emerald-950 space-y-2 animate-in fade-in">
          <div className="font-bold flex items-center gap-1.5 text-emerald-900">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Foydali matematik bilim:</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center pt-1 font-mono font-bold">
            <div className="p-2 bg-white rounded-xl border border-emerald-200">
              <div className="text-[10px] text-slate-400">O'nli kasr</div>
              {current.decimal}
            </div>
            <div className="p-2 bg-white rounded-xl border border-emerald-200">
              <div className="text-[10px] text-slate-400">Foiz</div>
              {current.percent}
            </div>
            <div className="p-2 bg-white rounded-xl border border-emerald-200">
              <div className="text-[10px] text-slate-400">Teng kuchli</div>
              {current.equivalent}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
