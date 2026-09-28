import React, { useState, useEffect, useCallback } from 'react';
import { RotateCcw, Trophy, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Grid3X3 } from 'lucide-react';
import { sound } from '../../utils/audio';

type Grid = number[][];

export const Math2048Game: React.FC = () => {
  const [grid, setGrid] = useState<Grid>(() => initGrid());
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(() => {
    return Number(localStorage.getItem('zukko_2048_best') || 0);
  });
  const [gameOver, setGameOver] = useState(false);

  function initGrid(): Grid {
    const newGrid = Array(4).fill(0).map(() => Array(4).fill(0));
    addRandom(newGrid);
    addRandom(newGrid);
    return newGrid;
  }

  function addRandom(board: Grid) {
    const emptyCells: { r: number; c: number }[] = [];
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (board[r][c] === 0) emptyCells.push({ r, c });
      }
    }
    if (emptyCells.length === 0) return;
    const { r, c } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    board[r][c] = Math.random() < 0.9 ? 2 : 4;
  }

  const slide = (row: number[]): { newRow: number[]; scoreGained: number } => {
    let arr = row.filter((val) => val !== 0);
    let scoreGained = 0;
    for (let i = 0; i < arr.length - 1; i++) {
      if (arr[i] === arr[i + 1]) {
        arr[i] *= 2;
        scoreGained += arr[i];
        arr[i + 1] = 0;
      }
    }
    arr = arr.filter((val) => val !== 0);
    while (arr.length < 4) {
      arr.push(0);
    }
    return { newRow: arr, scoreGained };
  };

  const move = useCallback(
    (direction: 'left' | 'right' | 'up' | 'down') => {
      if (gameOver) return;

      let changed = false;
      let totalGained = 0;
      const newGrid = grid.map((r) => [...r]);

      if (direction === 'left' || direction === 'right') {
        for (let r = 0; r < 4; r++) {
          const row = newGrid[r];
          const targetRow = direction === 'left' ? row : [...row].reverse();
          const { newRow, scoreGained } = slide(targetRow);
          const finalRow = direction === 'left' ? newRow : newRow.reverse();

          for (let c = 0; c < 4; c++) {
            if (newGrid[r][c] !== finalRow[c]) changed = true;
            newGrid[r][c] = finalRow[c];
          }
          totalGained += scoreGained;
        }
      } else {
        for (let c = 0; c < 4; c++) {
          const col = [newGrid[0][c], newGrid[1][c], newGrid[2][c], newGrid[3][c]];
          const targetCol = direction === 'up' ? col : [...col].reverse();
          const { newRow, scoreGained } = slide(targetCol);
          const finalCol = direction === 'up' ? newRow : newRow.reverse();

          for (let r = 0; r < 4; r++) {
            if (newGrid[r][c] !== finalCol[r]) changed = true;
            newGrid[r][c] = finalCol[r];
          }
          totalGained += scoreGained;
        }
      }

      if (changed) {
        sound.playClick();
        addRandom(newGrid);
        const newScore = score + totalGained;
        setGrid(newGrid);
        setScore(newScore);

        if (newScore > bestScore) {
          setBestScore(newScore);
          localStorage.setItem('zukko_2048_best', String(newScore));
        }

        // Check game over
        checkGameOver(newGrid);
      }
    },
    [grid, gameOver, score, bestScore]
  );

  const checkGameOver = (board: Grid) => {
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (board[r][c] === 0) return;
        if (c < 3 && board[r][c] === board[r][c + 1]) return;
        if (r < 3 && board[r][c] === board[r + 1][c]) return;
      }
    }
    sound.playWrong();
    setGameOver(true);
  };

  const handleRestart = () => {
    sound.playClick();
    setGrid(initGrid());
    setScore(0);
    setGameOver(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'KeyW'].includes(e.code)) {
        e.preventDefault();
        move('up');
      } else if (['ArrowDown', 'KeyS'].includes(e.code)) {
        e.preventDefault();
        move('down');
      } else if (['ArrowLeft', 'KeyA'].includes(e.code)) {
        e.preventDefault();
        move('left');
      } else if (['ArrowRight', 'KeyD'].includes(e.code)) {
        e.preventDefault();
        move('right');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [move]);

  const getTileColor = (val: number) => {
    switch (val) {
      case 2: return 'bg-slate-100 text-slate-800';
      case 4: return 'bg-amber-100 text-amber-900';
      case 8: return 'bg-orange-200 text-orange-950';
      case 16: return 'bg-orange-400 text-white';
      case 32: return 'bg-rose-400 text-white';
      case 64: return 'bg-rose-600 text-white';
      case 128: return 'bg-amber-400 text-amber-950 font-black';
      case 256: return 'bg-amber-500 text-white font-black';
      case 512: return 'bg-indigo-500 text-white font-black';
      case 1024: return 'bg-indigo-600 text-white font-black';
      case 2048: return 'bg-emerald-500 text-white font-black ring-4 ring-amber-400';
      default: return 'bg-slate-800 text-white font-black';
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200 max-w-lg mx-auto space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Grid3X3 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900">2048 Sonlar Zanjiri</h3>
            <p className="text-xs text-slate-500">Bir xil sonlarni birlashtiring va 2048 ga yeting!</p>
          </div>
        </div>

        <button
          onClick={handleRestart}
          className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors"
          title="Qayta boshlash"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Score Cards */}
      <div className="grid grid-cols-2 gap-3 text-center">
        <div className="p-3 bg-indigo-50 rounded-2xl border border-indigo-100">
          <div className="text-2xl font-black text-indigo-700">{score}</div>
          <div className="text-xs text-indigo-600 font-semibold">Ball</div>
        </div>
        <div className="p-3 bg-amber-50 rounded-2xl border border-amber-100">
          <div className="text-2xl font-black text-amber-700">{bestScore}</div>
          <div className="text-xs text-amber-600 font-semibold">Eng yuqori</div>
        </div>
      </div>

      {/* 4x4 Board */}
      <div className="relative bg-slate-800 p-3 sm:p-4 rounded-3xl shadow-inner max-w-sm mx-auto">
        <div className="grid grid-cols-4 gap-2.5">
          {grid.map((row, r) =>
            row.map((val, c) => (
              <div
                key={`${r}-${c}`}
                className={`h-16 sm:h-20 rounded-2xl flex items-center justify-center font-bold text-lg sm:text-2xl transition-all select-none ${
                  val === 0 ? 'bg-slate-700/60' : getTileColor(val)
                }`}
              >
                {val !== 0 && val}
              </div>
            ))
          )}
        </div>

        {gameOver && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-xs rounded-3xl flex flex-col items-center justify-center p-6 text-white text-center animate-in fade-in">
            <h4 className="text-2xl font-black text-amber-400">O'yin Tugadi!</h4>
            <p className="text-xs text-slate-300 mt-1 mb-4">
              Barcha kataklar to'ldi. Siz to'plagan ball: {score}
            </p>
            <button
              onClick={handleRestart}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md"
            >
              Qayta Boshlash
            </button>
          </div>
        )}
      </div>

      {/* Virtual Arrows Controls (for mobile or touch) */}
      <div className="flex flex-col items-center gap-2 pt-2">
        <button
          onClick={() => move('up')}
          className="p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 shadow-2xs active:scale-95"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-4">
          <button
            onClick={() => move('left')}
            className="p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 shadow-2xs active:scale-95"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => move('down')}
            className="p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 shadow-2xs active:scale-95"
          >
            <ArrowDown className="w-5 h-5" />
          </button>
          <button
            onClick={() => move('right')}
            className="p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 shadow-2xs active:scale-95"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
        <p className="text-[11px] text-slate-400 font-medium">
          Klaviatura o'q tugmalari (Arrow keys) orqali ham boshqarish mumkin
        </p>
      </div>
    </div>
  );
};
