import React, { useRef, useState, useEffect } from 'react';
import { 
  PenTool, 
  Eraser, 
  RotateCcw, 
  Trash2, 
  Download, 
  Grid, 
  Maximize2, 
  Minimize2, 
  Minus, 
  Square, 
  Circle as CircleIcon, 
  X,
  Palette
} from 'lucide-react';
import { sound } from '../../utils/audio';

interface WhiteboardProps {
  isModal?: boolean;
  onClose?: () => void;
  title?: string;
}

type ToolType = 'pen' | 'line' | 'rect' | 'circle' | 'eraser';

export const Whiteboard: React.FC<WhiteboardProps> = ({
  isModal = false,
  onClose,
  title = "Matematik Qoralama va Chizma Doskasi",
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [tool, setTool] = useState<ToolType>('pen');
  const [color, setColor] = useState<string>('#1e293b');
  const [lineWidth, setLineWidth] = useState<number>(3);
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [history, setHistory] = useState<ImageData[]>([]);
  const startPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const snapshotRef = useRef<ImageData | null>(null);

  const colors = [
    '#1e293b', // slate
    '#dc2626', // red
    '#2563eb', // blue
    '#16a34a', // green
    '#d97706', // amber
    '#7c3aed', // purple
  ];

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    if (parent) {
      canvas.width = parent.clientWidth || 800;
      canvas.height = isModal ? 600 : 550;
    }

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      saveState();
    }

    const handleResize = () => {
      // Keep canvas drawing on resize
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const saveState = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setHistory((prev) => [...prev.slice(-15), data]);
  };

  const handleUndo = () => {
    if (history.length <= 1) return;
    sound.playClick();
    const newHistory = [...history];
    newHistory.pop(); // remove current
    const prev = newHistory[newHistory.length - 1];
    setHistory(newHistory);

    const canvas = canvasRef.current;
    if (!canvas || !prev) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.putImageData(prev, 0, 0);
  };

  const handleClear = () => {
    sound.playClick();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    saveState();
  };

  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    if ('touches' in e) {
      const touch = e.touches[0];
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      };
    }
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const startDraw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const coords = getCoordinates(e);
    startPos.current = coords;
    setIsDrawing(true);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    snapshotRef.current = ctx.getImageData(0, 0, canvas.width, canvas.height);

    if (tool === 'pen' || tool === 'eraser') {
      ctx.beginPath();
      ctx.moveTo(coords.x, coords.y);
      ctx.strokeStyle = tool === 'eraser' ? '#ffffff' : color;
      ctx.lineWidth = tool === 'eraser' ? lineWidth * 4 : lineWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    }
  };

  const drawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const coords = getCoordinates(e);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (tool === 'pen' || tool === 'eraser') {
      ctx.lineTo(coords.x, coords.y);
      ctx.stroke();
    } else if (snapshotRef.current) {
      ctx.putImageData(snapshotRef.current, 0, 0);
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.lineCap = 'round';

      if (tool === 'line') {
        ctx.moveTo(startPos.current.x, startPos.current.y);
        ctx.lineTo(coords.x, coords.y);
        ctx.stroke();
      } else if (tool === 'rect') {
        const w = coords.x - startPos.current.x;
        const h = coords.y - startPos.current.y;
        ctx.strokeRect(startPos.current.x, startPos.current.y, w, h);
      } else if (tool === 'circle') {
        const radius = Math.sqrt(
          Math.pow(coords.x - startPos.current.x, 2) + Math.pow(coords.y - startPos.current.y, 2)
        );
        ctx.arc(startPos.current.x, startPos.current.y, radius, 0, 2 * Math.PI);
        ctx.stroke();
      }
    }
  };

  const stopDraw = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    saveState();
  };

  const handleDownload = () => {
    sound.playCorrect();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `matematika_qoralama_${Date.now()}.png`;
    a.click();
  };

  const content = (
    <div className="flex flex-col h-full bg-white rounded-3xl overflow-hidden shadow-xl border border-slate-200">
      {/* Whiteboard Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-3 bg-slate-50 border-b border-slate-200">
        
        {/* Left: Tools */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-2xl border border-slate-200/80 shadow-2xs">
          <button
            onClick={() => { sound.playClick(); setTool('pen'); }}
            className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              tool === 'pen' ? 'bg-indigo-600 text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
            title="Qalam"
          >
            <PenTool className="w-4 h-4" />
            <span className="hidden sm:inline">Qalam</span>
          </button>

          <button
            onClick={() => { sound.playClick(); setTool('line'); }}
            className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              tool === 'line' ? 'bg-indigo-600 text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
            title="To'g'ri chiziq"
          >
            <Minus className="w-4 h-4" />
            <span className="hidden sm:inline">Chiziq</span>
          </button>

          <button
            onClick={() => { sound.playClick(); setTool('rect'); }}
            className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              tool === 'rect' ? 'bg-indigo-600 text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
            title="To'rtburchak"
          >
            <Square className="w-4 h-4" />
            <span className="hidden sm:inline">To'rtburchak</span>
          </button>

          <button
            onClick={() => { sound.playClick(); setTool('circle'); }}
            className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              tool === 'circle' ? 'bg-indigo-600 text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
            title="Aylana"
          >
            <CircleIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Aylana</span>
          </button>

          <button
            onClick={() => { sound.playClick(); setTool('eraser'); }}
            className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              tool === 'eraser' ? 'bg-indigo-600 text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
            title="O'chirg'ich"
          >
            <Eraser className="w-4 h-4" />
            <span className="hidden sm:inline">O'chirg'ich</span>
          </button>
        </div>

        {/* Center: Color & Thickness */}
        <div className="flex items-center gap-3">
          {/* Colors */}
          <div className="flex items-center gap-1.5">
            {colors.map((c) => (
              <button
                key={c}
                onClick={() => {
                  sound.playClick();
                  setColor(c);
                  if (tool === 'eraser') setTool('pen');
                }}
                className={`w-6 h-6 rounded-full transition-transform ${
                  color === c && tool !== 'eraser' ? 'scale-125 ring-2 ring-indigo-500 ring-offset-2' : 'hover:scale-110'
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>

          {/* Stroke Width */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
            <span>Qalinlik:</span>
            <input
              type="range"
              min={1}
              max={10}
              value={lineWidth}
              onChange={(e) => setLineWidth(Number(e.target.value))}
              className="w-16 accent-indigo-600 cursor-pointer"
            />
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              sound.playClick();
              setShowGrid(!showGrid);
            }}
            className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1 border transition-colors ${
              showGrid
                ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
            title="Katakli fonni yoqish / o'chirish"
          >
            <Grid className="w-4 h-4" />
            <span className="hidden md:inline">Katakcha</span>
          </button>

          <button
            onClick={handleUndo}
            disabled={history.length <= 1}
            className="p-2 rounded-xl text-xs font-semibold bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 transition-colors"
            title="Orqaga qaytarish"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={handleClear}
            className="p-2 rounded-xl text-xs font-semibold bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 transition-colors"
            title="Doskani tozalash"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <button
            onClick={handleDownload}
            className="p-2 rounded-xl text-xs font-semibold bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 transition-colors"
            title="Rasmni yuklab olish"
          >
            <Download className="w-4 h-4" />
          </button>

          {isModal && onClose && (
            <button
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Canvas Area with Grid Pattern */}
      <div 
        className="relative flex-1 w-full overflow-hidden bg-white cursor-crosshair"
        style={{
          backgroundImage: showGrid
            ? 'linear-gradient(to right, #f1f5f9 1px, transparent 1px), linear-gradient(to bottom, #f1f5f9 1px, transparent 1px)'
            : 'none',
          backgroundSize: '24px 24px',
        }}
      >
        <canvas
          ref={canvasRef}
          onMouseDown={startDraw}
          onMouseMove={drawing}
          onMouseUp={stopDraw}
          onMouseLeave={stopDraw}
          onTouchStart={startDraw}
          onTouchMove={drawing}
          onTouchEnd={stopDraw}
          className="touch-none w-full h-full block"
        />

        {/* Small floating tip */}
        <div className="absolute bottom-3 left-4 px-3 py-1 bg-white/90 backdrop-blur-xs rounded-xl border border-slate-200 text-[11px] text-slate-500 font-medium pointer-events-none shadow-2xs">
          💡 Geometriya, hisob-kitoblar va tenglamalarni chizish uchun qulay qoralama
        </div>
      </div>
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="w-full max-w-5xl h-[85vh] flex flex-col">
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-[650px] my-6">
      {content}
    </div>
  );
};
