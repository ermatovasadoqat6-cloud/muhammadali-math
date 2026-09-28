import React, { useState } from 'react';
import { Zap, Scale, PieChart, Grid3X3, Swords, Gamepad2 } from 'lucide-react';
import { SpeedMathGame } from './SpeedMathGame';
import { BalanceScaleGame } from './BalanceScaleGame';
import { FractionMozaikGame } from './FractionMozaikGame';
import { Math2048Game } from './Math2048Game';
import { MathDuelGame } from './MathDuelGame';
import { sound } from '../../utils/audio';

export const MathGamesHub: React.FC = () => {
  const [activeGame, setActiveGame] = useState<'speed' | 'scale' | 'fraction' | '2048' | 'duel'>('speed');

  const games = [
    {
      id: 'speed',
      title: 'Tezkor Hisob',
      subtitle: 'Aqliy sprint & combo',
      icon: Zap,
      color: 'from-amber-500 to-amber-600',
      badge: '60 soniya',
    },
    {
      id: 'scale',
      title: 'Tenglama Tarozisi',
      subtitle: 'Algebraik muvozanat',
      icon: Scale,
      color: 'from-indigo-500 to-indigo-600',
      badge: 'Ko\'rgazmali',
    },
    {
      id: 'fraction',
      title: 'Kasrlar Mozaikasi',
      subtitle: 'Doira va ulushlar',
      icon: PieChart,
      color: 'from-emerald-500 to-teal-600',
      badge: 'Geometrik',
    },
    {
      id: '2048',
      title: '2048 Sonlar Zanjiri',
      subtitle: 'Darajalar mantiqiy o\'yini',
      icon: Grid3X3,
      color: 'from-violet-500 to-purple-600',
      badge: 'Mantiq',
    },
    {
      id: 'duel',
      title: 'Matematik Duel',
      subtitle: '2 O\'quvchi musobaqasi',
      icon: Swords,
      color: 'from-rose-500 to-red-600',
      badge: 'Sinfdoshlar bahsi',
    },
  ] as const;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
          <Gamepad2 className="w-8 h-8 text-indigo-600" />
          <span>Qiziqarli Matematik O'yinlar</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Matematikani o'ynab o'rganing: tezkor hisoblash, tenglamalarni vizual yechish va sinfdoshlar bilan bellashuv
        </p>
      </div>

      {/* Game Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {games.map((g) => {
          const Icon = g.icon;
          const isActive = activeGame === g.id;
          return (
            <button
              key={g.id}
              onClick={() => {
                sound.playClick();
                setActiveGame(g.id);
              }}
              className={`p-4 rounded-3xl text-left border-2 transition-all flex flex-col justify-between ${
                isActive
                  ? 'border-indigo-600 bg-white shadow-lg shadow-indigo-100 scale-[1.02]'
                  : 'border-slate-200/90 bg-white hover:border-indigo-300 hover:bg-slate-50/50'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`w-10 h-10 rounded-2xl bg-gradient-to-tr ${g.color} text-white flex items-center justify-center shadow-xs`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                  {g.badge}
                </span>
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-900">{g.title}</h4>
                <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{g.subtitle}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Game Stage */}
      <div className="pt-2">
        {activeGame === 'speed' && <SpeedMathGame />}
        {activeGame === 'scale' && <BalanceScaleGame />}
        {activeGame === 'fraction' && <FractionMozaikGame />}
        {activeGame === '2048' && <Math2048Game />}
        {activeGame === 'duel' && <MathDuelGame />}
      </div>
    </div>
  );
};
