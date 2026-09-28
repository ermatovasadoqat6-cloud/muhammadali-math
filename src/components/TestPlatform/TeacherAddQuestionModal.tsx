import React, { useState } from 'react';
import { X, Plus, BookOpen, CheckCircle, HelpCircle } from 'lucide-react';
import { GradeLevel, Question } from '../../types/math';
import { sound } from '../../utils/audio';

interface TeacherAddQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddQuestion: (q: Question) => void;
  defaultGrade?: GradeLevel;
}

export const TeacherAddQuestionModal: React.FC<TeacherAddQuestionModalProps> = ({
  isOpen,
  onClose,
  onAddQuestion,
  defaultGrade = '5-6',
}) => {
  const [grade, setGrade] = useState<GradeLevel>(defaultGrade);
  const [topic, setTopic] = useState('');
  const [questionText, setQuestionText] = useState('');
  const [options, setOptions] = useState<string[]>(['', '', '', '']);
  const [correctIndex, setCorrectIndex] = useState<number>(0);
  const [explanation, setExplanation] = useState('');
  const [hint, setHint] = useState('');
  const [difficulty, setDifficulty] = useState<'oson' | 'orta' | 'qiyin'>('orta');

  if (!isOpen) return null;

  const handleOptionChange = (idx: number, val: string) => {
    const next = [...options];
    next[idx] = val;
    setOptions(next);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionText.trim() || options.some((o) => !o.trim()) || !explanation.trim()) {
      alert("Iltimos, barcha maydonlarni to'ldiring!");
      return;
    }

    const newQ: Question = {
      id: `custom-q-${Date.now()}`,
      grade,
      topic: topic.trim() || "Matematika",
      question: questionText.trim(),
      options: options.map((o) => o.trim()),
      correctIndex,
      explanation: explanation.trim(),
      hint: hint.trim() || undefined,
      difficulty,
    };

    sound.playCorrect();
    onAddQuestion(newQ);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 p-6 sm:p-8">
        
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Yangi Test Savoli Qo'shish</h3>
              <p className="text-xs text-slate-500">O'quvchilaringiz uchun yangi masala va variantlar kiriting</p>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Sinf / Daraja
              </label>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value as GradeLevel)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold bg-white"
              >
                <option value="5-6">5-6 Sinf</option>
                <option value="7-8">7-8 Sinf</option>
                <option value="9">9 Sinf</option>
                <option value="10-11">10-11 Sinf</option>
                <option value="dtm">DTM / Sertifikat</option>
                <option value="olympiad">Olimpiada</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Mavzu
              </label>
              <input
                type="text"
                required
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Masalan: Kasrlar, Viyet"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Qiyinlik darajasi
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as any)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold bg-white"
              >
                <option value="oson">Oson</option>
                <option value="orta">O'rta</option>
                <option value="qiyin">Qiyin</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Savol matni
            </label>
            <textarea
              rows={3}
              required
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              placeholder="Masalan: Tenglamani yeching: 2x² - 8 = 0"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
            />
          </div>

          {/* Options */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Javob variantlari (To'g'ri variantni radiodan tanlang):
            </label>
            <div className="space-y-2">
              {['A', 'B', 'C', 'D'].map((letter, idx) => (
                <div key={letter} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="correctVariant"
                    checked={correctIndex === idx}
                    onChange={() => setCorrectIndex(idx)}
                    className="w-4 h-4 accent-indigo-600 cursor-pointer"
                  />
                  <span className="w-6 text-xs font-bold text-slate-500">{letter})</span>
                  <input
                    type="text"
                    required
                    value={options[idx]}
                    onChange={(e) => handleOptionChange(idx, e.target.value)}
                    placeholder={`${letter} varianti matni`}
                    className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Explanation */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
              Ustoz yechimi va tushuntirishi (Test yakunida ko'rsatiladi)
            </label>
            <textarea
              rows={2}
              required
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              placeholder="Masalan: 2x² = 8 => x² = 4 => x = ±2"
              className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium resize-none"
            />
          </div>

          {/* Hint */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <HelpCircle className="w-3.5 h-3.5 text-amber-500" />
              Maslahat / Hint (ixtiyoriy)
            </label>
            <input
              type="text"
              value={hint}
              onChange={(e) => setHint(e.target.value)}
              placeholder="Masalan: 8 ni o'ng tomonga o'tkazing va 2 ga bo'ling"
              className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium"
            />
          </div>

          {/* Actions */}
          <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-xl hover:bg-slate-100"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md shadow-indigo-200 transition-colors"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Savolni Saqlash</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
