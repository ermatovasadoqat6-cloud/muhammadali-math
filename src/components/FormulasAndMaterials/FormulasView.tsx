import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  Copy, 
  Check, 
  Printer, 
  BookOpen, 
  Sparkles, 
  Layers, 
  Compass, 
  Sigma, 
  Box,
  Lightbulb
} from 'lucide-react';
import { FormulaItem, StudyArticle } from '../../types/math';
import { formulasDatabase, studyArticles } from '../../data/mockData';
import { sound } from '../../utils/audio';

export const FormulasView: React.FC = () => {
  const [subTab, setSubTab] = useState<'formulas' | 'articles'>('formulas');
  const [category, setCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<StudyArticle | null>(null);

  const categories = [
    { id: 'all', label: 'Barchasi', icon: Layers },
    { id: 'algebra', label: 'Algebra', icon: Compass },
    { id: 'geometriya', label: 'Planimetriya', icon: Compass },
    { id: 'trigonometriya', label: 'Trigonometriya', icon: Sigma },
    { id: 'stereometriya', label: 'Stereometriya', icon: Box },
    { id: 'analiz', label: 'Analiz & Hosila', icon: Sparkles },
  ];

  const filteredFormulas = formulasDatabase.filter((f) => {
    const matchesCat = category === 'all' || f.category === category;
    const matchesSearch =
      f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.formula.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const handleCopy = (formula: FormulaItem) => {
    sound.playClick();
    navigator.clipboard.writeText(`${formula.title}:\n${formula.formula}`);
    setCopiedId(formula.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handlePrint = () => {
    sound.playClick();
    window.print();
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <FileText className="w-8 h-8 text-indigo-600" />
            <span>Foydali O'quv Materiallari & Formulalar</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            5-11 sinflar, DTM va olimpiadalar uchun eng zarur formulalar, qoidalar va ustoz qo'llanmalari
          </p>
        </div>

        <div className="flex items-center gap-2 no-print">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold shadow-2xs transition-colors"
          >
            <Printer className="w-4 h-4 text-indigo-600" />
            <span>Chop etish (Shpargalka)</span>
          </button>
        </div>
      </div>

      {/* Sub Tabs: Formulas vs Articles */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 no-print">
        <button
          onClick={() => { sound.playClick(); setSubTab('formulas'); }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            subTab === 'formulas'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Formulalar Ma'lumotnomasi
        </button>

        <button
          onClick={() => { sound.playClick(); setSubTab('articles'); }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            subTab === 'articles'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Ustoz Metodikasi & Maslahatlar
        </button>
      </div>

      {subTab === 'formulas' ? (
        <div className="space-y-6">
          {/* Search & Categories */}
          <div className="space-y-3 no-print">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Formula nomi, mavzu yoki qoida bo'yicha qidiring (masalan: Pifagor, Viyet, Logarifm)..."
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white border border-slate-200 text-xs sm:text-sm font-medium shadow-2xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              />
            </div>

            {/* Categories */}
            <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none">
              {categories.map((cat) => {
                const Icon = cat.icon;
                const isActive = category === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      sound.playClick();
                      setCategory(cat.id);
                    }}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-2xs'
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Formulas Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredFormulas.map((f) => (
              <div
                key={f.id}
                className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-md border border-slate-200 flex flex-col justify-between transition-all"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 uppercase">
                      {f.category} • {f.grade}
                    </span>

                    <button
                      onClick={() => handleCopy(f)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-100 transition-colors no-print"
                      title="Formulani nusxalash"
                    >
                      {copiedId === f.id ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mb-2">
                    {f.title}
                  </h3>

                  <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                    {f.description}
                  </p>

                  {/* Formula Box */}
                  <div className="p-4 rounded-2xl bg-slate-900 text-amber-300 font-mono text-sm leading-relaxed whitespace-pre-line shadow-inner">
                    {f.formula}
                  </div>

                  {/* Example if exists */}
                  {f.example && (
                    <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
                      <span className="font-bold text-indigo-700 block mb-0.5">Misol:</span>
                      <code className="font-mono text-slate-800 whitespace-pre-line">{f.example}</code>
                    </div>
                  )}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mt-4 pt-3 border-t border-slate-100">
                  {f.tags.map((t) => (
                    <span
                      key={t}
                      className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {filteredFormulas.length === 0 && (
            <div className="text-center py-12 bg-white rounded-3xl border border-slate-200">
              <p className="text-slate-500 text-sm">
                Qidiruvingiz bo'yicha formula topilmadi.
              </p>
            </div>
          )}
        </div>
      ) : (
        /* Educational Articles and Study Guides */
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {studyArticles.map((art) => (
              <div
                key={art.id}
                onClick={() => {
                  sound.playClick();
                  setSelectedArticle(art);
                }}
                className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-lg border border-slate-200 cursor-pointer flex flex-col justify-between transition-all hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                    <span className="font-bold text-indigo-600">{art.category}</span>
                    <span>{art.readTime}</span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-2">
                    {art.title}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed mb-4">
                    {art.summary}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                  <span>Ustoz: {art.author}</span>
                  <span className="text-indigo-600 font-bold">O'qish &rarr;</span>
                </div>
              </div>
            ))}
          </div>

          {/* Full Article Reader Modal */}
          {selectedArticle && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
              <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-50 text-indigo-700">
                    {selectedArticle.category} • {selectedArticle.readTime}
                  </span>
                  <button
                    onClick={() => setSelectedArticle(null)}
                    className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                  >
                    ✕
                  </button>
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                  {selectedArticle.title}
                </h3>

                <p className="text-xs text-slate-500 italic">
                  Muallif: {selectedArticle.author}
                </p>

                <div className="space-y-3 py-2 text-sm text-slate-700 leading-relaxed">
                  {selectedArticle.content.map((p, i) => (
                    <p key={i} className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                      {p}
                    </p>
                  ))}
                </div>

                {selectedArticle.tips.length > 0 && (
                  <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 uppercase">
                      <Lightbulb className="w-4 h-4 text-amber-600" />
                      <span>Ustozdan oltin tavsiyalar:</span>
                    </div>
                    <ul className="list-disc list-inside text-xs sm:text-sm text-amber-950 space-y-1">
                      {selectedArticle.tips.map((tip, idx) => (
                        <li key={idx}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
