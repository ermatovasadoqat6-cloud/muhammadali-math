import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  BookOpen, 
  Lightbulb, 
  CheckCircle2, 
  RotateCcw, 
  Camera, 
  Image as ImageIcon, 
  X, 
  Volume2, 
  VolumeX, 
  Clock, 
  Copy, 
  Check, 
  Layers, 
  HelpCircle,
  HelpCircle as QuestionIcon
} from 'lucide-react';
import { sound } from '../../utils/audio';

type Aimode = 'solve' | 'generate_practice' | 'check';

interface HistoryItem {
  id: string;
  timestamp: string;
  prompt: string;
  response: string;
  grade: string;
  mode: Aimode;
  hasImage?: boolean;
}

export const AiMathTutor: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [grade, setGrade] = useState('9-sinf');
  const [mode, setMode] = useState<Aimode>('solve');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Image Upload state
  const [imageFile, setImageFile] = useState<string | null>(null);
  const [imageMime, setImageMime] = useState<string>('image/jpeg');
  const imageInputRef = useRef<HTMLInputElement | null>(null);

  // History state
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('zukko_ai_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const samplePrompts = [
    { label: "Kvadrat tenglama", text: "2x² - 9x + 10 = 0 tenglamani Viyet va diskriminant bilan yechish" },
    { label: "Pifagor & Geometriya", text: "Katetlari 6 sm va 8 sm bo'lgan to'g'ri burchakli uchburchak gipotenuzasiga tushirilgan balandlikni topish" },
    { label: "Progressiya yig'indisi", text: "Arifmetik progressiyada a₁ = 3, d = 4 bo'lsa, dastlabki 15 ta hadi yig'indisini hisoblash" },
    { label: "Trigonometriya", text: "sin²(α) + cos²(α) = 1 ayniyati asosida agar cos(α) = 0.6 bo'lsa sin(α) va tg(α) ni topish" },
    { label: "Olimpiada masalasi", text: "1 dan 100 gacha bo'lgan sonlar ichida 3 ga ham 5 ga ham bo'linmaydigan nechta son bor?" },
  ];

  // Handle Image Upload
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      alert("Rasm hajmi 8MB dan kichik bo'lishi kerak!");
      return;
    }

    setImageMime(file.type || 'image/jpeg');
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        sound.playCorrect();
        setImageFile(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAsk = async (textToAsk?: string) => {
    const q = textToAsk !== undefined ? textToAsk : prompt;
    if (!q.trim() && !imageFile) {
      alert("Iltimos, savol matnini yozing yoki masala rasmini yuklang!");
      return;
    }

    sound.playClick();
    setLoading(true);
    setError(null);
    setResponse(null);
    stopSpeaking();

    try {
      const res = await fetch('/api/ai-tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: q,
          grade,
          topic: 'Matematika masalasi',
          mode,
          imageBase64: imageFile || undefined,
          mimeType: imageMime,
        }),
      });

      const data = await res.json();
      if (data.text) {
        sound.playCorrect();
        setResponse(data.text);

        // Save to history
        const newItem: HistoryItem = {
          id: `hist-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' }),
          prompt: q || "Rasmli masala tahlili",
          response: data.text,
          grade,
          mode,
          hasImage: !!imageFile,
        };

        const updatedHistory = [newItem, ...history.slice(0, 9)];
        setHistory(updatedHistory);
        localStorage.setItem('zukko_ai_history', JSON.stringify(updatedHistory));
      } else {
        setError(data.error || "Javob olishda xatolik yuz berdi");
      }
    } catch (err: any) {
      setError("Server bilan bog'lanishda xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!response) return;
    sound.playClick();
    navigator.clipboard.writeText(response);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Web Speech API Voice synthesis
  const toggleSpeech = () => {
    if (!('speechSynthesis' in window)) {
      alert("Brauzeringizda ovozli o'qish imkoniyati qo'llab-quvvatlanmaydi.");
      return;
    }

    if (isSpeaking) {
      stopSpeaking();
    } else {
      if (!response) return;
      const cleanText = response.replace(/[*#`$\\_]/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 1.0;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-indigo-800/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-12 -mt-12 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-400 to-indigo-500 flex items-center justify-center text-white shadow-lg shrink-0">
              <Sparkles className="w-7 h-7 text-amber-200 animate-pulse" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[11px] font-bold border border-amber-400/30 mb-1">
                <span>Mukammal Gemini 3.8 AI & Vision</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                Ustoz AI — Aqlli Matematik Hamroh
              </h2>
              <p className="text-xs sm:text-sm text-indigo-200/90 mt-1 max-w-xl">
                Ixtiyoriy masalani yozing yoki kitobdan rasmga olib yuklang. Ustoz AI uni qadamba-qadam tushuntirib beradi!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mode Selector Tabs */}
      <div className="grid grid-cols-3 gap-2 bg-white p-2 rounded-2xl border border-slate-200 shadow-2xs">
        <button
          onClick={() => { sound.playClick(); setMode('solve'); }}
          className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            mode === 'solve'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <span>🎯 Qadamba-qadam Yechish</span>
        </button>

        <button
          onClick={() => { sound.playClick(); setMode('generate_practice'); }}
          className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            mode === 'generate_practice'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <span>🎲 O'xshash Mashqlar Tuzish</span>
        </button>

        <button
          onClick={() => { sound.playClick(); setMode('check'); }}
          className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            mode === 'check'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <span>✍️ Yechimimni Tekshirish</span>
        </button>
      </div>

      {/* Main Input Form Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-indigo-600" />
            <span>
              {mode === 'solve' && "Masala matni yoki sharti:"}
              {mode === 'generate_practice' && "Qaysi mavzu yoki masala asosida 3 ta misol tuzilsin?"}
              {mode === 'check' && "Masala va o'zingiz chiqargan javobingiz:"}
            </span>
          </label>

          {/* Grade selection */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-semibold">Sinf / Daraja:</span>
            <select
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className="text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-indigo-700 cursor-pointer"
            >
              <option value="5-6 sinf">5-6 sinf</option>
              <option value="7-8 sinf">7-8 sinf</option>
              <option value="9 sinf">9 sinf</option>
              <option value="10-11 sinf">10-11 sinf</option>
              <option value="DTM / Abituriyent">DTM / Abituriyent</option>
              <option value="Olimpiada">Olimpiada</option>
            </select>
          </div>
        </div>

        {/* Text Area */}
        <div className="relative">
          <textarea
            rows={3}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={
              mode === 'solve'
                ? "Masalan: Tenglamani yeching: 3x² - 12x = 0 yoki uchburchak burchaklari 30°, 60°, 90° bo'lsa katetlar nisbatini toping..."
                : mode === 'generate_practice'
                ? "Masalan: Kasrlarni qo'shish va ayirishga oid 3 ta turli qiyinlikdagi mashq tuzing..."
                : "Masalan: Men 2x + 7 = 19 tenglamani yechib x = 6 chiqardim, to'g'rimi?"
            }
            className="w-full p-4 rounded-2xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 resize-none shadow-2xs leading-relaxed"
          />
        </div>

        {/* Image Attachment Preview if selected */}
        {imageFile && (
          <div className="p-3 bg-indigo-50/70 border border-indigo-200 rounded-2xl flex items-center justify-between gap-3 animate-in fade-in">
            <div className="flex items-center gap-3">
              <img
                src={imageFile}
                alt="Yuklangan masala"
                className="w-16 h-16 object-cover rounded-xl border border-indigo-300 shadow-xs"
              />
              <div>
                <span className="text-xs font-bold text-indigo-900 block">
                  Masala fotosurati biriktirildi
                </span>
                <span className="text-[11px] text-slate-500">
                  AI rasmdagi chizma, tenglama va matnni to'liq o'qiydi
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                sound.playClick();
                setImageFile(null);
              }}
              className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
              title="Rasmni olib tashlash"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Quick Sample Prompts */}
        <div className="space-y-1.5 pt-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Tezkor tayyor masalalar:
          </span>
          <div className="flex flex-wrap gap-2">
            {samplePrompts.map((s, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setPrompt(s.text);
                  handleAsk(s.text);
                }}
                className="text-xs px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200 transition-colors text-left"
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Action Controls & Image Upload button */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {/* Hidden file input */}
            <input
              type="file"
              ref={imageInputRef}
              onChange={handleImageSelect}
              accept="image/*"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                imageInputRef.current?.click();
              }}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 text-xs font-bold border border-slate-200 transition-colors"
            >
              <Camera className="w-4 h-4 text-indigo-600" />
              <span>{imageFile ? "Boshqa rasm" : "Masala rasmini yuklash 📷"}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                sound.playClick();
                setPrompt('');
                setImageFile(null);
                setResponse(null);
                setError(null);
                stopSpeaking();
              }}
              className="px-3 py-2.5 rounded-xl text-slate-400 hover:text-slate-700 text-xs font-semibold hover:bg-slate-100"
            >
              Tozalash
            </button>

            <button
              onClick={() => handleAsk()}
              disabled={loading || (!prompt.trim() && !imageFile)}
              className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-indigo-200 transition-colors"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Ustoz tahlil qilmoqda...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>
                    {mode === 'solve' && "Yechimni Ko'rish"}
                    {mode === 'generate_practice' && "Mashqlar Tuzish"}
                    {mode === 'check' && "Tekshirish"}
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm rounded-2xl animate-in fade-in">
          {error}
        </div>
      )}

      {/* AI Solution Response Card */}
      {response && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-indigo-100 space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2 text-indigo-700 font-bold text-sm">
              <Bot className="w-5 h-5 text-indigo-600" />
              <span>
                {mode === 'solve' && "Ustoz AI Qadamba-qadam Yechimi:"}
                {mode === 'generate_practice' && "Ustoz AI Tuzgan Mustaqil Mashqlar:"}
                {mode === 'check' && "Ustoz AI Tekshiruv Natijasi:"}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={toggleSpeech}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors ${
                  isSpeaking
                    ? 'bg-rose-50 border-rose-200 text-rose-600 animate-pulse'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-indigo-50 hover:text-indigo-600'
                }`}
                title="Ovozli eshitish"
              >
                {isSpeaking ? (
                  <>
                    <VolumeX className="w-3.5 h-3.5 text-rose-600" />
                    <span>To'xtatish</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Ovozli eshitish</span>
                  </>
                )}
              </button>

              <button
                onClick={handleCopy}
                className="flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-indigo-600 px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-200 transition-colors"
                title="Yechimdan nusxa olish"
              >
                {isCopied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700 font-bold">Nusxalandi!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Nusxalash</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="text-slate-800 text-sm sm:text-base leading-relaxed whitespace-pre-line font-sans p-2">
            {response}
          </div>
        </div>
      )}

      {/* History of Recent Questions */}
      {history.length > 0 && (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
              <Clock className="w-4 h-4 text-indigo-600" />
              <span>Oxirgi so'ralgan masalalar tarixi ({history.length}):</span>
            </div>

            <button
              onClick={() => {
                sound.playClick();
                setHistory([]);
                localStorage.removeItem('zukko_ai_history');
              }}
              className="text-[11px] text-slate-400 hover:text-rose-600 font-semibold"
            >
              Tarixni tozalash
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {history.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  sound.playClick();
                  setPrompt(item.prompt);
                  setResponse(item.response);
                  setGrade(item.grade);
                  setMode(item.mode);
                }}
                className="py-2.5 flex items-center justify-between cursor-pointer hover:bg-slate-50 px-2 rounded-xl transition-colors group"
              >
                <div className="flex items-center gap-3 pr-4">
                  <span className="text-xs font-bold text-indigo-600 font-mono">
                    {item.timestamp}
                  </span>
                  <span className="text-xs sm:text-sm font-medium text-slate-800 line-clamp-1 group-hover:text-indigo-600">
                    {item.prompt}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                    {item.grade}
                  </span>
                  <span className="text-xs text-indigo-600 font-bold group-hover:translate-x-0.5 transition-transform">
                    &rarr;
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
