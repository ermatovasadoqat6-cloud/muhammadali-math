import React, { useRef } from 'react';
import { X, Printer, Award, CheckCircle2, ShieldCheck, Download } from 'lucide-react';
import { QuizResult, TeacherProfile } from '../../types/math';
import { sound } from '../../utils/audio';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: QuizResult;
  teacherProfile: TeacherProfile;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  result,
  teacherProfile,
}) => {
  const certificateRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handlePrint = () => {
    sound.playClick();
    window.print();
  };

  const isHonors = result.scorePercentage >= 85;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-4xl w-full p-4 sm:p-6 shadow-2xl border border-slate-200 relative my-8">
        
        {/* Modal Controls (No print) */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 no-print">
          <div className="flex items-center gap-2 text-indigo-700 font-bold text-sm">
            <Award className="w-5 h-5 text-amber-500" />
            <span>Matematika Yutuq Sertifikati</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-200 transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Chop etish / PDF saqlash</span>
            </button>
            <button
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* The Printable Certificate Container */}
        <div 
          ref={certificateRef}
          className="mt-4 p-8 sm:p-12 bg-gradient-to-br from-amber-50/60 via-white to-indigo-50/60 rounded-2xl border-8 border-double border-amber-600/60 shadow-inner relative text-center text-slate-800"
        >
          {/* Corner Decorative Ornaments */}
          <div className="absolute top-4 left-4 w-12 h-12 border-t-4 border-l-4 border-amber-500 rounded-tl-lg" />
          <div className="absolute top-4 right-4 w-12 h-12 border-t-4 border-r-4 border-amber-500 rounded-tr-lg" />
          <div className="absolute bottom-4 left-4 w-12 h-12 border-b-4 border-l-4 border-amber-500 rounded-bl-lg" />
          <div className="absolute bottom-4 right-4 w-12 h-12 border-b-4 border-r-4 border-amber-500 rounded-br-lg" />

          {/* Certificate Header */}
          <div className="space-y-2">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-tr from-amber-400 to-amber-600 text-white shadow-lg mx-auto mb-2">
              <Award className="w-9 h-9" />
            </div>

            <p className="text-xs uppercase tracking-[0.25em] font-extrabold text-amber-700">
              {teacherProfile.school}
            </p>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-wider text-slate-900 font-serif">
              {isHonors ? "FAXRIY YORLIQ" : "SERTIFIKAT"}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Matematika fani bo'yicha namunali bilim va natijalar uchun
            </p>
          </div>

          {/* Recipient */}
          <div className="my-8">
            <p className="text-xs uppercase tracking-widest text-slate-400 font-semibold mb-2">
              Ushbu hujjat topshiriladi:
            </p>
            <div className="inline-block border-b-2 border-slate-900 pb-1 px-8">
              <span className="text-2xl sm:text-3xl font-extrabold text-indigo-950">
                {result.studentName || "Zukko O'quvchi"}
              </span>
            </div>
          </div>

          {/* Achievement Description */}
          <div className="max-w-xl mx-auto text-sm sm:text-base text-slate-600 leading-relaxed font-serif">
            Ushbu o'quvchi <strong className="text-slate-900 font-sans">{result.quizTitle}</strong> yo'nalishi bo'yicha o'tkazilgan interaktiv sinov testida muvaffaqiyatli ishtirok etib,{' '}
            <strong className="text-indigo-700 font-sans text-lg font-bold">{result.scorePercentage}%</strong> ball to'pladi ({result.correctAnswers}/{result.totalQuestions} ta to'g'ri javob).
          </div>

          {/* Score Badge */}
          <div className="my-6 inline-flex items-center gap-3 px-6 py-2.5 rounded-2xl bg-amber-100/80 border border-amber-300 text-amber-900 font-bold text-sm shadow-xs">
            <ShieldCheck className="w-5 h-5 text-amber-600" />
            <span>Natija darajasi: {isHonors ? "A'lo (Oltin ko'rsatkich)" : result.scorePercentage >= 70 ? "Yaxshi natija" : "Qoniqarli"}</span>
          </div>

          {/* Footer with Signatures */}
          <div className="mt-10 pt-8 border-t border-slate-200/80 grid grid-cols-2 gap-6 items-end text-left sm:text-center">
            
            {/* Date */}
            <div>
              <p className="text-xs text-slate-400 font-medium">Berilgan sana:</p>
              <p className="text-sm font-bold text-slate-800 mt-1 font-mono">
                {new Date(result.completedAt).toLocaleDateString('uz-UZ', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>

            {/* Teacher signature & stamp */}
            <div className="relative">
              <div className="inline-block relative">
                {/* Stamp visual */}
                <div className="w-20 h-20 rounded-full border-2 border-indigo-600/40 border-dashed absolute -top-8 -right-4 flex items-center justify-center text-[9px] font-black text-indigo-700 uppercase tracking-tighter rotate-12 opacity-80 pointer-events-none">
                  Tasdiqlandi
                </div>

                <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                  {teacherProfile.avatarUrl && (
                    <img
                      src={teacherProfile.avatarUrl}
                      alt={teacherProfile.name}
                      className="w-8 h-8 rounded-full object-cover border border-amber-300 shadow-2xs inline-block"
                    />
                  )}
                  <p className="text-xs text-slate-400 font-medium">Matematika o'qituvchisi:</p>
                </div>

                <p className="text-sm font-bold text-indigo-950 underline decoration-indigo-400 decoration-wavy">
                  {teacherProfile.name}
                </p>
                <p className="text-[11px] text-slate-500">{teacherProfile.title}</p>
              </div>
            </div>

          </div>

          {/* Official Verification Note */}
          <p className="mt-8 text-[10px] text-slate-400">
            Hujjat ID: ZUKKO-{Date.now().toString(36).toUpperCase()} • Zukko Matematik Ta'lim Tizimi
          </p>
        </div>

      </div>
    </div>
  );
};
