import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  HelpCircle, 
  Edit3, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle, 
  AlertCircle, 
  X,
  Volume2
} from 'lucide-react';
import { Question, QuizCategory, QuizResult, TeacherProfile } from '../../types/math';
import { Whiteboard } from '../VirtualWhiteboard/Whiteboard';
import { sound } from '../../utils/audio';

interface QuizRunnerProps {
  category: QuizCategory;
  questions: Question[];
  onFinishQuiz: (result: QuizResult) => void;
  onExit: () => void;
  teacherProfile: TeacherProfile;
}

export const QuizRunner: React.FC<QuizRunnerProps> = ({
  category,
  questions,
  onFinishQuiz,
  onExit,
  teacherProfile,
}) => {
  const [studentName, setStudentName] = useState('Azizbek');
  const [hasStarted, setHasStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>(
    new Array(questions.length).fill(-1)
  );
  const [showHint, setShowHint] = useState(false);
  const [showScratchpad, setShowScratchpad] = useState(false);
  const [timeLeft, setTimeLeft] = useState(category.durationMinutes * 60);
  const [startTime] = useState(Date.now());

  // Timer
  useEffect(() => {
    if (!hasStarted) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [hasStarted, selectedAnswers]);

  const handleSelectOption = (optIndex: number) => {
    sound.playClick();
    const updated = [...selectedAnswers];
    updated[currentIndex] = optIndex;
    setSelectedAnswers(updated);
  };

  const handleNext = () => {
    sound.playClick();
    setShowHint(false);
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    sound.playClick();
    setShowHint(false);
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSubmitTest = () => {
    sound.playCorrect();
    const total = questions.length;
    let correctCount = 0;
    const answersData = questions.map((q, idx) => {
      const selected = selectedAnswers[idx];
      const isCorrect = selected === q.correctIndex;
      if (isCorrect) correctCount++;
      return {
        questionId: q.id,
        questionText: q.question,
        selectedOption: selected,
        correctOption: q.correctIndex,
        isCorrect,
        explanation: q.explanation,
      };
    });

    const scorePercentage = Math.round((correctCount / total) * 100);
    const timeSpentSeconds = Math.max(1, Math.round((Date.now() - startTime) / 1000));

    const result: QuizResult = {
      quizTitle: category.title,
      grade: category.grade,
      studentName: studentName.trim() || "Zukko O'quvchi",
      totalQuestions: total,
      correctAnswers: correctCount,
      scorePercentage,
      timeSpentSeconds,
      completedAt: new Date().toISOString(),
      answers: answersData,
    };

    onFinishQuiz(result);
  };

  // Name Entry / Start Screen
  if (!hasStarted) {
    return (
      <div className="max-w-xl mx-auto p-4 sm:p-8 bg-white rounded-3xl shadow-xl border border-slate-200 text-center my-8">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4 font-black text-2xl">
          ✏️
        </div>
        <h2 className="text-2xl font-black text-slate-900">
          {category.title}
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md mx-auto">
          {category.description}
        </p>

        <div className="my-6 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-left text-xs text-slate-600 space-y-2">
          <div className="flex items-center justify-between font-semibold">
            <span>Savollar soni:</span>
            <span className="font-bold text-slate-900">{questions.length} ta</span>
          </div>
          <div className="flex items-center justify-between font-semibold">
            <span>Berilgan vaqt:</span>
            <span className="font-bold text-slate-900">{category.durationMinutes} daqiqa</span>
          </div>
          <div className="flex items-center justify-between font-semibold">
            <span>Ustoz:</span>
            <span className="font-bold text-indigo-700">{teacherProfile.name}</span>
          </div>
        </div>

        <div className="text-left mb-6">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Ism va Familiyangizni kiriting (Sertifikat uchun):
          </label>
          <input
            type="text"
            required
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            placeholder="Masalan: Sardor Aliyev"
            className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-semibold focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              sound.playClick();
              onExit();
            }}
            className="flex-1 py-3 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-xl hover:bg-slate-100 transition-colors"
          >
            Ortga qaytish
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setHasStarted(true);
            }}
            className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-200 transition-colors"
          >
            Testni Boshlash 🚀
          </button>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const isTimeCritical = timeLeft < 120; // less than 2 minutes

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-4">
      {/* Top Test Navigation Bar */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (confirm("Rostdan ham testdan chiqmoqchimisiz? Natijalar saqlanmaydi.")) {
                sound.playClick();
                onExit();
              }
            }}
            className="text-xs font-bold text-slate-400 hover:text-slate-700 flex items-center gap-1"
          >
            <X className="w-4 h-4" />
            <span>Chiqish</span>
          </button>

          <span className="text-slate-300">|</span>

          <div>
            <span className="text-xs text-slate-400 font-medium">{category.title}</span>
            <div className="text-xs sm:text-sm font-bold text-slate-800">
              Savol: {currentIndex + 1} / {questions.length}
            </div>
          </div>
        </div>

        {/* Right Tools: Scratchpad & Timer */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              sound.playClick();
              setShowScratchpad(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Qoralama doska</span>
          </button>

          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-colors ${
              isTimeCritical
                ? 'bg-rose-100 text-rose-700 animate-pulse'
                : 'bg-slate-100 text-slate-700'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>{minutes}:{seconds.toString().padStart(2, '0')}</span>
          </div>
        </div>
      </div>

      {/* Progress Circles */}
      <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none">
        {questions.map((_, idx) => {
          const isAnswered = selectedAnswers[idx] !== -1;
          const isCurrent = currentIndex === idx;
          return (
            <button
              key={idx}
              onClick={() => {
                sound.playClick();
                setCurrentIndex(idx);
                setShowHint(false);
              }}
              className={`w-8 h-8 rounded-xl text-xs font-bold shrink-0 transition-all ${
                isCurrent
                  ? 'bg-indigo-600 text-white ring-2 ring-indigo-400 shadow-xs'
                  : isAnswered
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {idx + 1}
            </button>
          );
        })}
      </div>

      {/* Main Question Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200 space-y-6">
        {/* Topic Badge & Hint Trigger */}
        <div className="flex items-center justify-between">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
            {currentQ.topic}
          </span>

          {currentQ.hint && (
            <button
              onClick={() => {
                sound.playClick();
                setShowHint(!showHint);
              }}
              className="flex items-center gap-1 text-xs font-semibold text-amber-600 hover:text-amber-700"
            >
              <HelpCircle className="w-4 h-4" />
              <span>{showHint ? "Maslahatni yashirish" : "Ustoz maslahati"}</span>
            </button>
          )}
        </div>

        {/* Hint Box */}
        {showHint && currentQ.hint && (
          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm animate-in fade-in">
            💡 <strong>Ustoz maslahati:</strong> {currentQ.hint}
          </div>
        )}

        {/* Question Text */}
        <div className="py-2">
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-relaxed font-sans whitespace-pre-line">
            {currentQ.question}
          </h3>
        </div>

        {/* Answer Options */}
        <div className="space-y-3">
          {currentQ.options.map((opt, optIdx) => {
            const isSelected = selectedAnswers[currentIndex] === optIdx;
            const letter = String.fromCharCode(65 + optIdx);
            return (
              <button
                key={optIdx}
                onClick={() => handleSelectOption(optIdx)}
                className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-center justify-between ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/60 shadow-xs'
                    : 'border-slate-200/80 hover:border-indigo-300 hover:bg-slate-50/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold ${
                      isSelected
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {letter}
                  </div>
                  <span className="text-sm font-semibold text-slate-800">
                    {opt}
                  </span>
                </div>

                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    isSelected ? 'border-indigo-600' : 'border-slate-300'
                  }`}
                >
                  {isSelected && <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Navigation Buttons */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold disabled:opacity-30 hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Oldingi</span>
          </button>

          {currentIndex === questions.length - 1 ? (
            <button
              onClick={handleSubmitTest}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xs font-bold shadow-md shadow-emerald-200 transition-colors"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Testni Yakunlash</span>
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-200 transition-colors"
            >
              <span>Keyingi</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Embedded Scratchpad Modal */}
      {showScratchpad && (
        <Whiteboard
          isModal={true}
          onClose={() => setShowScratchpad(false)}
          title="Qoralama doskasi - Masalani hisoblang"
        />
      )}
    </div>
  );
};
