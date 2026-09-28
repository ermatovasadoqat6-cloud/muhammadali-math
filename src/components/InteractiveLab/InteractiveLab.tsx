import React, { useState, useRef, useEffect } from 'react';
import { Activity, Sliders, Compass, Sparkles, Box, RefreshCw } from 'lucide-react';
import { sound } from '../../utils/audio';

type FunctionType = 'quadratic' | 'linear' | 'sine' | 'hyperbola';
type ShapeType = 'triangle' | 'circle' | 'cylinder' | 'cone';

export const InteractiveLab: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'grapher' | 'geometry'>('grapher');

  // Grapher parameters
  const [funcType, setFuncType] = useState<FunctionType>('quadratic');
  const [paramA, setParamA] = useState<number>(1);
  const [paramB, setParamB] = useState<number>(0);
  const [paramC, setParamC] = useState<number>(-4);

  // Geometry parameters
  const [shape, setShape] = useState<ShapeType>('triangle');
  const [sideA, setSideA] = useState<number>(6);
  const [sideB, setSideB] = useState<number>(8);
  const [radius, setRadius] = useState<number>(5);
  const [height, setHeight] = useState<number>(10);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Render 2D Function Graph on Canvas
  useEffect(() => {
    if (activeTab !== 'grapher') return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = (canvas.width = canvas.parentElement?.clientWidth || 600);
    const height = (canvas.height = 420);

    // Clear
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // Scale & Origin
    const centerX = width / 2;
    const centerY = height / 2;
    const scale = 25; // 25px per unit

    // Draw Grid
    ctx.strokeStyle = '#f1f5f9';
    ctx.lineWidth = 1;

    for (let x = centerX % scale; x < width; x += scale) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = centerY % scale; y < height; y += scale) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Draw Axes
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2;

    // X Axis
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.stroke();

    // Y Axis
    ctx.beginPath();
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, height);
    ctx.stroke();

    // Axis Labels
    ctx.fillStyle = '#64748b';
    ctx.font = '11px JetBrains Mono, monospace';
    ctx.fillText('x', width - 15, centerY - 8);
    ctx.fillText('y', centerX + 8, 15);
    ctx.fillText('0', centerX - 12, centerY + 14);

    // Draw Function Curve
    ctx.strokeStyle = '#4f46e5'; // indigo
    ctx.lineWidth = 3;
    ctx.beginPath();

    let isFirst = true;

    for (let px = 0; px < width; px++) {
      const x = (px - centerX) / scale;
      let y = 0;

      if (funcType === 'quadratic') {
        y = paramA * x * x + paramB * x + paramC;
      } else if (funcType === 'linear') {
        y = paramA * x + paramB;
      } else if (funcType === 'sine') {
        y = paramA * Math.sin(paramB * x);
      } else if (funcType === 'hyperbola') {
        if (Math.abs(x) < 0.05) {
          isFirst = true;
          continue;
        }
        y = paramA / x;
      }

      const py = centerY - y * scale;

      if (py >= -100 && py <= height + 100) {
        if (isFirst) {
          ctx.moveTo(px, py);
          isFirst = false;
        } else {
          ctx.lineTo(px, py);
        }
      } else {
        isFirst = true;
      }
    }
    ctx.stroke();

    // If quadratic, highlight vertex
    if (funcType === 'quadratic' && paramA !== 0) {
      const vx = -paramB / (2 * paramA);
      const vy = paramA * vx * vx + paramB * vx + paramC;
      const pvx = centerX + vx * scale;
      const pvy = centerY - vy * scale;

      if (pvx >= 0 && pvx <= width && pvy >= 0 && pvy <= height) {
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(pvx, pvy, 5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#1e293b';
        ctx.font = 'bold 11px sans-serif';
        ctx.fillText(`Uchi: (${vx.toFixed(1)}; ${vy.toFixed(1)})`, pvx + 8, pvy - 8);
      }
    }
  }, [activeTab, funcType, paramA, paramB, paramC]);

  const resetGraph = () => {
    sound.playClick();
    if (funcType === 'quadratic') {
      setParamA(1);
      setParamB(0);
      setParamC(-4);
    } else if (funcType === 'linear') {
      setParamA(1);
      setParamB(2);
    } else if (funcType === 'sine') {
      setParamA(2);
      setParamB(1);
    } else if (funcType === 'hyperbola') {
      setParamA(4);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Activity className="w-8 h-8 text-indigo-600" />
            <span>Interaktiv Grafik & Geometriya Laboratoriyasi</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Funksiyalar parametrlarini o'zgartirib grafiklar qanday harakatlanishini ko'ring yoki geometrik shakllarni hisoblang
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl">
          <button
            onClick={() => { sound.playClick(); setActiveTab('grapher'); }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              activeTab === 'grapher' ? 'bg-white text-indigo-700 shadow-2xs' : 'text-slate-600'
            }`}
          >
            Funksiya Grafigi
          </button>
          <button
            onClick={() => { sound.playClick(); setActiveTab('geometry'); }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              activeTab === 'geometry' ? 'bg-white text-indigo-700 shadow-2xs' : 'text-slate-600'
            }`}
          >
            Geometrik Shakllar
          </button>
        </div>
      </div>

      {activeTab === 'grapher' ? (
        /* Function Grapher Mode */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Canvas Graph View */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="font-mono font-bold text-sm text-slate-800 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-indigo-600" />
                <span>
                  {funcType === 'quadratic' && `y = ${paramA}x² ${paramB >= 0 ? `+ ${paramB}x` : `${paramB}x`} ${paramC >= 0 ? `+ ${paramC}` : `${paramC}`}`}
                  {funcType === 'linear' && `y = ${paramA}x ${paramB >= 0 ? `+ ${paramB}` : `${paramB}`}`}
                  {funcType === 'sine' && `y = ${paramA} · sin(${paramB}x)`}
                  {funcType === 'hyperbola' && `y = ${paramA} / x`}
                </span>
              </div>

              <button
                onClick={resetGraph}
                className="flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-slate-700"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Asliga qaytarish</span>
              </button>
            </div>

            <div className="w-full rounded-2xl overflow-hidden border border-slate-200">
              <canvas ref={canvasRef} className="w-full block" />
            </div>

            <p className="text-xs text-slate-400 text-center font-medium">
              💡 Har bir katakcha = 1 birlik masofa. Qizil nuqta — parabola uchi.
            </p>
          </div>

          {/* Control Panel */}
          <div className="lg:col-span-4 bg-white rounded-3xl p-6 shadow-xl border border-slate-200 space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Funksiya turi:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'quadratic', label: 'Parabola (ax²+bx+c)' },
                  { id: 'linear', label: 'To\'g\'ri chiziq (kx+b)' },
                  { id: 'sine', label: 'Sinusoid (a·sin bx)' },
                  { id: 'hyperbola', label: 'Giperbola (a/x)' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      sound.playClick();
                      setFuncType(item.id as FunctionType);
                    }}
                    className={`p-2.5 rounded-xl text-xs font-bold text-left border transition-colors ${
                      funcType === item.id
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Parameter Sliders */}
            <div className="space-y-4 pt-2">
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
                  <span>{funcType === 'hyperbola' ? 'Koeffitsiyent a:' : 'Parametr a (Yo\'nalish / Siqilish):'}</span>
                  <span className="font-mono text-indigo-700 px-2 py-0.5 bg-slate-100 rounded-md">{paramA}</span>
                </div>
                <input
                  type="range"
                  min={-5}
                  max={5}
                  step={0.5}
                  value={paramA}
                  onChange={(e) => setParamA(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>

              {funcType !== 'hyperbola' && (
                <div>
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
                    <span>Parametr b (Siljish / To'lqin tezligi):</span>
                    <span className="font-mono text-indigo-700 px-2 py-0.5 bg-slate-100 rounded-md">{paramB}</span>
                  </div>
                  <input
                    type="range"
                    min={-6}
                    max={6}
                    step={0.5}
                    value={paramB}
                    onChange={(e) => setParamB(Number(e.target.value))}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                </div>
              )}

              {funcType === 'quadratic' && (
                <div>
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
                    <span>Parametr c (Oy o'qi bo'yicha siljish):</span>
                    <span className="font-mono text-indigo-700 px-2 py-0.5 bg-slate-100 rounded-md">{paramC}</span>
                  </div>
                  <input
                    type="range"
                    min={-8}
                    max={8}
                    step={1}
                    value={paramC}
                    onChange={(e) => setParamC(Number(e.target.value))}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                </div>
              )}
            </div>

            {/* Quick Math Insight */}
            <div className="p-4 bg-indigo-50/70 rounded-2xl border border-indigo-200/80 text-xs text-indigo-950 space-y-1">
              <strong className="block font-bold text-indigo-900">Ustoz tahlili:</strong>
              {funcType === 'quadratic' && (
                <p>
                  {paramA > 0 ? "Parabola shoxlari yuqoriga qaragan (a > 0)." : "Parabola shoxlari pastga qaragan (a < 0)."} Diskriminant D = b² - 4ac = {(paramB*paramB - 4*paramA*paramC).toFixed(1)}.
                </p>
              )}
              {funcType === 'linear' && (
                <p>
                  {paramA > 0 ? "Funksiya o'suvchi (k > 0)." : paramA < 0 ? "Funksiya kamayuvchi (k < 0)." : "O'zgarmas funksiya (k = 0)."}
                </p>
              )}
              {funcType === 'sine' && (
                <p>
                  Amplituda = |a| = {Math.abs(paramA)}, davri T = 2π / |b| = {(paramB !== 0 ? (2 * Math.PI / Math.abs(paramB)).toFixed(2) : 'Cheksiz')}.
                </p>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Geometry Lab Mode */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Visual Shape & Calculations */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">
                {shape === 'triangle' && 'To\'g\'ri burchakli uchburchak (Pifagor)'}
                {shape === 'circle' && 'Doira va Aylana (Yuz va Uzunlik)'}
                {shape === 'cylinder' && 'Silindr (Hajm va To\'la sirt)'}
                {shape === 'cone' && 'Konus (Hajm va Sirt)'}
              </h3>
            </div>

            {/* Shape Visualizer SVG */}
            <div className="h-64 sm:h-72 w-full bg-slate-50 rounded-3xl border border-slate-200 flex items-center justify-center p-4">
              {shape === 'triangle' && (
                <svg viewBox="0 0 240 180" className="w-56 h-48 drop-shadow-sm">
                  <polygon
                    points="30,150 190,150 30,30"
                    fill="#e0e7ff"
                    stroke="#4338ca"
                    strokeWidth="3"
                  />
                  <rect x="30" y="130" width="20" height="20" fill="none" stroke="#4338ca" strokeWidth="2" />
                  <text x="100" y="168" className="text-xs font-bold fill-slate-700">a = {sideA} sm</text>
                  <text x="5" y="95" className="text-xs font-bold fill-slate-700">b = {sideB} sm</text>
                  <text x="120" y="85" className="text-xs font-bold fill-indigo-700">
                    c = {Math.sqrt(sideA*sideA + sideB*sideB).toFixed(1)} sm
                  </text>
                </svg>
              )}

              {shape === 'circle' && (
                <svg viewBox="0 0 200 200" className="w-52 h-52 drop-shadow-sm">
                  <circle cx="100" cy="100" r={radius * 12} fill="#e0e7ff" stroke="#4338ca" strokeWidth="3" />
                  <circle cx="100" cy="100" r="3" fill="#ef4444" />
                  <line x1="100" y1="100" x2={100 + radius * 12} y2="100" stroke="#ef4444" strokeWidth="2" />
                  <text x={100 + radius * 5} y="95" className="text-xs font-bold fill-red-600">R = {radius}</text>
                </svg>
              )}

              {shape === 'cylinder' && (
                <svg viewBox="0 0 200 240" className="w-48 h-56 drop-shadow-sm">
                  <ellipse cx="100" cy="50" rx={radius * 8} ry="18" fill="#e0e7ff" stroke="#4338ca" strokeWidth="3" />
                  <line x1={100 - radius * 8} y1="50" x2={100 - radius * 8} y2={50 + height * 12} stroke="#4338ca" strokeWidth="3" />
                  <line x1={100 + radius * 8} y1="50" x2={100 + radius * 8} y2={50 + height * 12} stroke="#4338ca" strokeWidth="3" />
                  <ellipse cx="100" cy={50 + height * 12} rx={radius * 8} ry="18" fill="#c7d2fe" stroke="#4338ca" strokeWidth="3" />
                  <text x="10" y={50 + height * 6} className="text-xs font-bold fill-slate-700">H = {height}</text>
                  <text x="100" y="45" className="text-xs font-bold fill-red-600 text-center">R = {radius}</text>
                </svg>
              )}

              {shape === 'cone' && (
                <svg viewBox="0 0 200 240" className="w-48 h-56 drop-shadow-sm">
                  <ellipse cx="100" cy={50 + height * 12} rx={radius * 8} ry="18" fill="#c7d2fe" stroke="#4338ca" strokeWidth="3" />
                  <line x1={100 - radius * 8} y1={50 + height * 12} x2="100" y2="40" stroke="#4338ca" strokeWidth="3" />
                  <line x1={100 + radius * 8} y1={50 + height * 12} x2="100" y2="40" stroke="#4338ca" strokeWidth="3" />
                  <line x1="100" y1="40" x2="100" y2={50 + height * 12} stroke="#ef4444" strokeDasharray="4" strokeWidth="2" />
                  <text x="110" y={40 + height * 6} className="text-xs font-bold fill-red-600">H = {height}</text>
                  <text x="100" y={50 + height * 12 + 15} className="text-xs font-bold fill-slate-700">R = {radius}</text>
                </svg>
              )}
            </div>

            {/* Calculated Values Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {shape === 'triangle' && (
                <>
                  <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                    <span className="text-xs text-indigo-600 font-semibold block">Gipotenuza (c):</span>
                    <span className="text-xl font-bold font-mono text-indigo-900">
                      {Math.sqrt(sideA*sideA + sideB*sideB).toFixed(2)} sm
                    </span>
                  </div>
                  <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                    <span className="text-xs text-emerald-600 font-semibold block">Yuzi (S):</span>
                    <span className="text-xl font-bold font-mono text-emerald-900">
                      {(0.5 * sideA * sideB).toFixed(1)} sm²
                    </span>
                  </div>
                  <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
                    <span className="text-xs text-amber-700 font-semibold block">Perimetri (P):</span>
                    <span className="text-xl font-bold font-mono text-amber-900">
                      {(sideA + sideB + Math.sqrt(sideA*sideA + sideB*sideB)).toFixed(2)} sm
                    </span>
                  </div>
                </>
              )}

              {shape === 'circle' && (
                <>
                  <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                    <span className="text-xs text-indigo-600 font-semibold block">Doira yuzi (S):</span>
                    <span className="text-xl font-bold font-mono text-indigo-900">
                      {(Math.PI * radius * radius).toFixed(2)}
                    </span>
                  </div>
                  <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                    <span className="text-xs text-emerald-600 font-semibold block">Uzunligi (L = 2πR):</span>
                    <span className="text-xl font-bold font-mono text-emerald-900">
                      {(2 * Math.PI * radius).toFixed(2)}
                    </span>
                  </div>
                  <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
                    <span className="text-xs text-amber-700 font-semibold block">Diametri (D = 2R):</span>
                    <span className="text-xl font-bold font-mono text-amber-900">
                      {radius * 2}
                    </span>
                  </div>
                </>
              )}

              {shape === 'cylinder' && (
                <>
                  <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                    <span className="text-xs text-indigo-600 font-semibold block">Hajmi (V = πR²H):</span>
                    <span className="text-xl font-bold font-mono text-indigo-900">
                      {(Math.PI * radius * radius * height).toFixed(1)}
                    </span>
                  </div>
                  <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                    <span className="text-xs text-emerald-600 font-semibold block">Yon sirti (S_yon):</span>
                    <span className="text-xl font-bold font-mono text-emerald-900">
                      {(2 * Math.PI * radius * height).toFixed(1)}
                    </span>
                  </div>
                  <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
                    <span className="text-xs text-amber-700 font-semibold block">To'la sirti (S_to'la):</span>
                    <span className="text-xl font-bold font-mono text-amber-900">
                      {(2 * Math.PI * radius * (radius + height)).toFixed(1)}
                    </span>
                  </div>
                </>
              )}

              {shape === 'cone' && (
                <>
                  <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                    <span className="text-xs text-indigo-600 font-semibold block">Hajmi (V = 1/3 πR²H):</span>
                    <span className="text-xl font-bold font-mono text-indigo-900">
                      {((1/3) * Math.PI * radius * radius * height).toFixed(1)}
                    </span>
                  </div>
                  <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                    <span className="text-xs text-emerald-600 font-semibold block">Yasovchisi (L):</span>
                    <span className="text-xl font-bold font-mono text-emerald-900">
                      {Math.sqrt(radius*radius + height*height).toFixed(2)}
                    </span>
                  </div>
                  <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
                    <span className="text-xs text-amber-700 font-semibold block">Yon sirti (πRL):</span>
                    <span className="text-xl font-bold font-mono text-amber-900">
                      {(Math.PI * radius * Math.sqrt(radius*radius + height*height)).toFixed(1)}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Shape Selector & Controls */}
          <div className="lg:col-span-4 bg-white rounded-3xl p-6 shadow-xl border border-slate-200 space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Shakl turini tanlang:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'triangle', label: 'Uchburchak' },
                  { id: 'circle', label: 'Doira' },
                  { id: 'cylinder', label: 'Silindr' },
                  { id: 'cone', label: 'Konus' },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      sound.playClick();
                      setShape(s.id as ShapeType);
                    }}
                    className={`p-3 rounded-xl text-xs font-bold text-center border transition-colors ${
                      shape === s.id
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Sliders */}
            <div className="space-y-4 pt-2">
              {shape === 'triangle' && (
                <>
                  <div>
                    <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
                      <span>Katet a:</span>
                      <span className="font-mono text-indigo-700">{sideA} sm</span>
                    </div>
                    <input
                      type="range"
                      min={2}
                      max={15}
                      value={sideA}
                      onChange={(e) => setSideA(Number(e.target.value))}
                      className="w-full accent-indigo-600"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
                      <span>Katet b:</span>
                      <span className="font-mono text-indigo-700">{sideB} sm</span>
                    </div>
                    <input
                      type="range"
                      min={2}
                      max={15}
                      value={sideB}
                      onChange={(e) => setSideB(Number(e.target.value))}
                      className="w-full accent-indigo-600"
                    />
                  </div>
                </>
              )}

              {(shape === 'circle' || shape === 'cylinder' || shape === 'cone') && (
                <div>
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
                    <span>Radius (R):</span>
                    <span className="font-mono text-indigo-700">{radius} sm</span>
                  </div>
                  <input
                    type="range"
                    min={2}
                    max={12}
                    value={radius}
                    onChange={(e) => setRadius(Number(e.target.value))}
                    className="w-full accent-indigo-600"
                  />
                </div>
              )}

              {(shape === 'cylinder' || shape === 'cone') && (
                <div>
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
                    <span>Balandlik (H):</span>
                    <span className="font-mono text-indigo-700">{height} sm</span>
                  </div>
                  <input
                    type="range"
                    min={4}
                    max={18}
                    value={height}
                    onChange={(e) => setHeight(Number(e.target.value))}
                    className="w-full accent-indigo-600"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
