import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  XCircle, 
  Award, 
  RotateCcw, 
  ArrowLeft, 
  HelpCircle, 
  Clock, 
  BookOpen,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { QuizResult, TeacherProfile } from '../../types/math';
import { CertificateModal } from './CertificateModal';
import { sound } from '../../utils/audio';

interface QuizResultModalProps {
  result: QuizResult;
  onRetake: () => void;
  onBackToList: () => void;
  teacherProfile: TeacherProfile;
}

export const QuizResultModal: React.FC<QuizResultModalProps> = ({
  result,
  onRetake,
  onBackToList,
  teacherProfile,
}) => {
  const [showCertificate, setShowCertificate] = useState(false);
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);

  useEffect(() => {
    if (result.scorePercentage >= 70) {
      sound.playFanfare();
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } else {
      sound.playCorrect();
    }
  }, [result]);

  const toggleExpand = (idx: number) => {
    sound.playClick();
    setExpandedQuestion(expandedQuestion === idx ? null : idx);
  };

  const minutes = Math.floor(result.timeSpentSeconds / 60);
  const seconds = result.timeSpentSeconds % 60;

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Top Banner Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-emerald-400 via-indigo-500 to-amber-400" />
        
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-indigo-50 text-indigo-600 mb-4 shadow-inner">
          <Award className="w-10 h-10 text-indigo-600" />
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
          Sinov Testi Yakunlandi!
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          {result.quizTitle} • O'quvchi: <strong>{result.studentName}</strong>
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto my-6">
          <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100">
            <div className="text-2xl sm:text-3xl font-black text-indigo-700">
              {result.scorePercentage}%
            </div>
            <div className="text-xs text-indigo-600 font-semibold mt-1">Umumiy Ball</div>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100">
            <div className="text-2xl sm:text-3xl font-black text-emerald-600">
              {result.correctAnswers} / {result.totalQuestions}
            </div>
            <div className="text-xs text-emerald-600 font-semibold mt-1">To'g'ri Javob</div>
          </div>

          <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-100">
            <div className="text-2xl sm:text-3xl font-black text-rose-600">
              {result.totalQuestions - result.correctAnswers}
            </div>
            <div className="text-xs text-rose-600 font-semibold mt-1">Noto'g'ri</div>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-100">
            <div className="text-2xl sm:text-3xl font-black text-amber-600 flex items-center justify-center gap-1">
              <Clock className="w-5 h-5" />
              <span>{minutes}:{seconds.toString().padStart(2, '0')}</span>
            </div>
            <div className="text-xs text-amber-700 font-semibold mt-1">Sarflangan Vaqt</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={() => {
              sound.playClick();
              setShowCertificate(true);
            }}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white font-bold text-sm rounded-2xl shadow-lg shadow-amber-500/25 transition-all transform hover:-translate-y-0.5"
          >
            <Award className="w-4 h-4" />
            <span>Sertifikatni Ko'rish / Yuklab Olish</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onRetake();
            }}
            className="flex items-center gap-2 px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm rounded-2xl transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Qayta Yechish</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onBackToList();
            }}
            className="flex items-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-2xl transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Boshqa Testlarga O'tish</span>
          </button>
        </div>
      </div>

      {/* Question Breakdown and Step-by-Step Solutions */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200 space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Savollar Tahlili va To'liq Yechimlari
            </h3>
            <p className="text-xs text-slate-500">
              Xatolaringiz ustida ishlang va har bir savolning batafsil tushuntirilishini o'rganing
            </p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
            {result.answers.length} ta savol
          </span>
        </div>

        <div className="space-y-3">
          {result.answers.map((ans, idx) => {
            const isExpanded = expandedQuestion === idx;
            return (
              <div
                key={ans.questionId}
                className={`rounded-2xl border transition-all ${
                  ans.isCorrect
                    ? 'border-emerald-200 bg-emerald-50/20'
                    : 'border-rose-200 bg-rose-50/20'
                }`}
              >
                <div
                  onClick={() => toggleExpand(idx)}
                  className="p-4 flex items-center justify-between cursor-pointer select-none"
                >
                  <div className="flex items-center gap-3 pr-2">
                    <div className="shrink-0">
                      {ans.isCorrect ? (
                        <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                      ) : (
                        <XCircle className="w-6 h-6 text-rose-500" />
                      )}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-400 mr-2">
                        {idx + 1}-savol:
                      </span>
                      <span className="text-sm font-semibold text-slate-800 line-clamp-1">
                        {ans.questionText}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                        ans.isCorrect
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-rose-100 text-rose-700'
                      }`}
                    >
                      {ans.isCorrect ? "To'g'ri" : "Xato"}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400" />
                    )}
                  </div>
                </div>

                {/* Expanded Solution View */}
                {isExpanded && (
                  <div className="px-4 pb-4 pt-1 border-t border-slate-100 text-sm space-y-3 animate-in fade-in">
                    <div className="p-3 bg-white rounded-xl border border-slate-200">
                      <p className="font-semibold text-slate-800 mb-2">
                        Savol: {ans.questionText}
                      </p>
                      <div className="text-xs text-slate-600 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-500">Sizning javobingiz:</span>
                          <span
                            className={
                              ans.isCorrect ? 'text-emerald-600 font-bold' : 'text-rose-600 font-bold'
                            }
                          >
                            {ans.selectedOption !== -1
                              ? `${String.fromCharCode(65 + ans.selectedOption)} varianti`
                              : "Belgilanmagan"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-500">To'g'ri javob:</span>
                          <span className="text-emerald-700 font-bold">
                            {String.fromCharCode(65 + ans.correctOption)} varianti
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Teacher Explanation */}
                    <div className="p-3.5 bg-indigo-50/70 border border-indigo-200/80 rounded-xl text-indigo-950 text-xs sm:text-sm leading-relaxed">
                      <div className="flex items-center gap-1.5 font-bold text-indigo-900 mb-1">
                        <BookOpen className="w-4 h-4 text-indigo-600" />
                        <span>Ustozdan yechim va tushuntirish:</span>
                      </div>
                      <p className="whitespace-pre-line">{ans.explanation}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Certificate Modal */}
      <CertificateModal
        isOpen={showCertificate}
        onClose={() => setShowCertificate(false)}
        result={result}
        teacherProfile={teacherProfile}
      />
    </div>
  );
};
