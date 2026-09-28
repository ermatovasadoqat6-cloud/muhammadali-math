import React, { useRef } from 'react';
import { 
  Sparkles, 
  Send, 
  Award, 
  Users, 
  BookMarked, 
  PlayCircle, 
  CheckCircle2, 
  MessageSquare,
  Camera,
  Trash2,
  Upload
} from 'lucide-react';
import { TeacherProfile } from '../types/math';
import { sound } from '../utils/audio';

interface TeacherHeroProps {
  teacherProfile: TeacherProfile;
  onStartQuiz: () => void;
  onExploreGames: () => void;
  onOpenWhiteboard: () => void;
  onUpdateAvatar?: (avatarUrl: string) => void;
}

export const TeacherHero: React.FC<TeacherHeroProps> = ({
  teacherProfile,
  onStartQuiz,
  onExploreGames,
  onOpenWhiteboard,
  onUpdateAvatar,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Rasm hajmi juda katta (maksimal 5MB). Iltimos kichikroq rasm tanlang.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        sound.playCorrect();
        if (onUpdateAvatar) {
          onUpdateAvatar(reader.result);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveAvatar = (e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playClick();
    if (onUpdateAvatar) {
      onUpdateAvatar('');
    }
  };
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-indigo-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-2xl border border-indigo-800/40 mb-8">
      {/* Background Decorative Glows */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 -mb-20 w-80 h-80 bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Teacher announcement banner */}
      {teacherProfile.announcement && (
        <div className="relative z-10 mb-6 inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 text-xs sm:text-sm font-medium backdrop-blur-md">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0 animate-pulse" />
          <span>{teacherProfile.announcement}</span>
        </div>
      )}

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Teacher intro and description */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-400/20 text-amber-300 border border-amber-400/40 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5" />
              {teacherProfile.title}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-slate-300 border border-white/10">
              {teacherProfile.school}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {teacherProfile.experienceYears}+ yillik tajriba
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Matematika olamiga xush kelibsiz!
          </h1>

          <p className="text-base sm:text-lg text-indigo-200/90 font-medium max-w-2xl leading-relaxed italic border-l-4 border-amber-400 pl-4 py-1">
            "{teacherProfile.motto}"
          </p>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl">
            Hurmatli o'quvchilar! Ushbu platforma orqali siz darsda o'tilgan bilimlarni mustahkamlashingiz, DTM va Olimpiadalarga tayyorlanishingiz, qiziqarli matematik o'yinlar bilan zehnni charxlashingiz mumkin.
          </p>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={() => {
                sound.playClick();
                onStartQuiz();
              }}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/25 hover:from-amber-300 hover:to-amber-400 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <PlayCircle className="w-4 h-4 fill-slate-950 text-amber-400" />
              <span>Test Yechishni Boshlash</span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                onExploreGames();
              }}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-semibold text-sm border border-white/15 transition-all backdrop-blur-xs"
            >
              <span>🎮 Matematik O'yinlar</span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                onOpenWhiteboard();
              }}
              className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-indigo-600/50 hover:bg-indigo-600/70 text-indigo-200 hover:text-white font-semibold text-sm border border-indigo-500/30 transition-all"
            >
              <span>✏️ Qoralama Doska</span>
            </button>

            {teacherProfile.telegram && (
              <a
                href={teacherProfile.telegram.startsWith('http') ? teacherProfile.telegram : `https://t.me/${teacherProfile.telegram.replace('@', '')}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 hover:text-sky-200 font-semibold text-sm border border-sky-500/30 transition-all"
              >
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">Ustozga Telegram</span>
              </a>
            )}
          </div>
        </div>

        {/* Right Column: Teacher Card & Quick Badges */}
        <div className="lg:col-span-4 flex flex-col items-center">
          <div className="relative w-full max-w-sm rounded-3xl bg-slate-900/80 border border-indigo-500/20 p-6 backdrop-blur-md shadow-2xl text-center space-y-4">
            
            {/* Hidden file input for uploading teacher picture */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleAvatarFileChange}
              accept="image/*"
              className="hidden"
            />

            {/* Avatar Circle matching the screenshot */}
            <div className="relative mx-auto w-28 h-28 sm:w-32 sm:h-32">
              <div 
                onClick={() => {
                  sound.playClick();
                  fileInputRef.current?.click();
                }}
                title="Ustoz rasmini yuklash yoki o'zgartirish uchun bosing"
                className="group relative w-full h-full rounded-full p-[3px] bg-gradient-to-b from-sky-400 via-indigo-400 to-amber-300 shadow-xl cursor-pointer transition-transform duration-300 hover:scale-105 active:scale-95"
              >
                <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center overflow-hidden relative">
                  {teacherProfile.avatarUrl ? (
                    <img
                      src={teacherProfile.avatarUrl}
                      alt={teacherProfile.name}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <span className="text-4xl sm:text-5xl font-black text-amber-300 font-sans tracking-tight">
                      {teacherProfile.name.startsWith('Ms.') || teacherProfile.name.startsWith('Mr.')
                        ? 'M'
                        : teacherProfile.name[0] || 'M'}
                    </span>
                  )}

                  {/* Hover Overlay with Camera Icon */}
                  <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white rounded-full">
                    <Camera className="w-6 h-6 text-amber-300 mb-1 animate-bounce" />
                    <span className="text-[10px] font-bold text-slate-200">
                      {teacherProfile.avatarUrl ? "Almashtirish" : "Rasm yuklash"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Online Checkmark Badge (matching screenshot exactly) */}
              <div 
                className="absolute bottom-1 right-1 w-7 h-7 rounded-full bg-emerald-500 border-2 border-slate-950 flex items-center justify-center text-white shadow-md z-10" 
                title="Ustoz Onlayn"
              >
                <CheckCircle2 className="w-4 h-4 stroke-[3]" />
              </div>
            </div>

            {/* Quick Upload / Remove Action Buttons */}
            <div className="flex items-center justify-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  fileInputRef.current?.click();
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 hover:text-white border border-indigo-400/30 transition-all"
              >
                <Camera className="w-3.5 h-3.5 text-amber-400" />
                <span>{teacherProfile.avatarUrl ? "Rasmni o'zgartirish" : "Rasm qo'yish"}</span>
              </button>

              {teacherProfile.avatarUrl && (
                <button
                  type="button"
                  onClick={handleRemoveAvatar}
                  title="Rasmni o'chirish va boshlang'ich holatga qaytarish"
                  className="p-1 rounded-full text-rose-400 hover:text-rose-300 hover:bg-rose-500/20 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-wide">
                {teacherProfile.name}
              </h2>
              <p className="text-xs text-indigo-300 font-medium mt-0.5">
                {teacherProfile.title}
              </p>
            </div>

            {/* Platform Stats Grid */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/10 text-left">
              <div className="bg-white/5 rounded-2xl p-2.5 text-center border border-white/5">
                <div className="text-lg font-black text-amber-300">100+</div>
                <div className="text-[11px] text-slate-400 font-medium">Test & Misol</div>
              </div>
              <div className="bg-white/5 rounded-2xl p-2.5 text-center border border-white/5">
                <div className="text-lg font-black text-sky-300">5 ta</div>
                <div className="text-[11px] text-slate-400 font-medium">Aqliy O'yin</div>
              </div>
              <div className="bg-white/5 rounded-2xl p-2.5 text-center border border-white/5">
                <div className="text-lg font-black text-emerald-300">5-11</div>
                <div className="text-[11px] text-slate-400 font-medium">Sinflar</div>
              </div>
            </div>

            {teacherProfile.phone && (
              <div className="text-xs text-slate-400 flex items-center justify-center gap-1.5 pt-1">
                <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
                <span>Aloqa: {teacherProfile.phone}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
