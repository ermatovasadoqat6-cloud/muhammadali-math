import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Play, 
  Clock, 
  HelpCircle, 
  Award, 
  Layers, 
  Brain, 
  Sigma, 
  Calculator, 
  Compass, 
  CheckCircle2,
  Filter
} from 'lucide-react';
import { GradeLevel, Question, QuizCategory, QuizResult, TeacherProfile } from '../../types/math';
import { quizCategories, questionsDatabase } from '../../data/mockData';
import { QuizRunner } from './QuizRunner';
import { QuizResultModal } from './QuizResultModal';
import { TeacherAddQuestionModal } from './TeacherAddQuestionModal';
import { sound } from '../../utils/audio';

interface QuizViewProps {
  teacherProfile: TeacherProfile;
  customQuestions: Question[];
  onAddCustomQuestion: (q: Question) => void;
}

export const QuizView: React.FC<QuizViewProps> = ({
  teacherProfile,
  customQuestions,
  onAddCustomQuestion,
}) => {
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<QuizCategory | null>(null);
  const [currentResult, setCurrentResult] = useState<QuizResult | null>(null);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // Combine database questions with custom questions added by teacher
  const allQuestions = [...questionsDatabase, ...customQuestions];

  const gradeFilters = [
    { id: 'all', label: 'Barcha Sinflar' },
    { id: '5-6', label: '5-6 Sinf' },
    { id: '7-8', label: '7-8 Sinf' },
    { id: '9', label: '9 Sinf' },
    { id: '10-11', label: '10-11 Sinf' },
    { id: 'dtm', label: 'DTM / Sertifikat' },
    { id: 'olympiad', label: 'Olimpiada' },
  ];

  const filteredCategories = quizCategories.filter((cat) => {
    const matchesGrade = selectedGrade === 'all' || cat.grade === selectedGrade;
    const matchesSearch =
      cat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesGrade && matchesSearch;
  });

  const getQuestionsForCategory = (cat: QuizCategory) => {
    return allQuestions.filter((q) => q.grade === cat.grade);
  };

  const startQuiz = (cat: QuizCategory) => {
    sound.playClick();
    setActiveCategory(cat);
    setCurrentResult(null);
  };

  // If in quiz runner mode
  if (activeCategory && !currentResult) {
    const questionsForThisCat = getQuestionsForCategory(activeCategory);
    return (
      <QuizRunner
        category={activeCategory}
        questions={questionsForThisCat.length > 0 ? questionsForThisCat : allQuestions.slice(0, 8)}
        onFinishQuiz={(result) => setCurrentResult(result)}
        onExit={() => setActiveCategory(null)}
        teacherProfile={teacherProfile}
      />
    );
  }

  // If result is shown
  if (currentResult) {
    return (
      <QuizResultModal
        result={currentResult}
        onRetake={() => setCurrentResult(null)}
        onBackToList={() => {
          setActiveCategory(null);
          setCurrentResult(null);
        }}
        teacherProfile={teacherProfile}
      />
    );
  }

  return (
    <div className="space-y-8">
      {/* Header and Filter Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Interaktiv Matematika Testlari
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Har bir sinf uchun tayyorlangan standart va qiziqarli testlarni yeching, bilimingizni baholang
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              sound.playClick();
              setShowAddModal(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-2xl border border-indigo-200 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Savol qo'shish (Ustoz)</span>
          </button>
        </div>
      </div>

      {/* Search and Grade Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Test mavzulari yoki kalit so'zlarni qidiring..."
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
          />
        </div>

        {/* Grade Pills */}
        <div className="flex items-center gap-1 overflow-x-auto py-1 scrollbar-none">
          {gradeFilters.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                sound.playClick();
                setSelectedGrade(tab.id);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                selectedGrade === tab.id
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Quiz Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.map((cat) => {
          const count = getQuestionsForCategory(cat).length;
          return (
            <div
              key={cat.id}
              className="group bg-white rounded-3xl p-6 shadow-md hover:shadow-xl border border-slate-200/90 transition-all duration-300 flex flex-col justify-between hover:-translate-y-1"
            >
              <div className="space-y-4">
                {/* Category Top Banner */}
                <div className="flex items-center justify-between">
                  <div
                    className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${cat.color} flex items-center justify-center text-white shadow-md`}
                  >
                    <Calculator className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                    {cat.grade.toUpperCase()}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                {/* Info Pills */}
                <div className="flex items-center gap-3 text-xs text-slate-500 font-semibold pt-2">
                  <div className="flex items-center gap-1">
                    <HelpCircle className="w-3.5 h-3.5 text-indigo-500" />
                    <span>{count} ta savol</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-500" />
                    <span>{cat.durationMinutes} daqiqa</span>
                  </div>
                </div>
              </div>

              {/* Start Test Button */}
              <div className="pt-6 mt-6 border-t border-slate-100">
                <button
                  onClick={() => startQuiz(cat)}
                  className="w-full py-3 rounded-2xl bg-indigo-600 group-hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-indigo-100 transition-colors"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Testni Boshlash</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredCategories.length === 0 && (
        <div className="text-center py-12 bg-white rounded-3xl border border-slate-200">
          <p className="text-slate-500 text-sm">
            Qidiruvingiz bo'yicha hech qanday test topilmadi.
          </p>
        </div>
      )}

      {/* Teacher Add Question Modal */}
      <TeacherAddQuestionModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAddQuestion={onAddCustomQuestion}
        defaultGrade={selectedGrade === 'all' ? '5-6' : (selectedGrade as GradeLevel)}
      />
    </div>
  );
};
