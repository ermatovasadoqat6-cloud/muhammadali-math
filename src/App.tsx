import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { TeacherHero } from './components/TeacherHero';
import { QuizView } from './components/TestPlatform/QuizView';
import { MathGamesHub } from './components/MathGames/MathGamesHub';
import { FormulasView } from './components/FormulasAndMaterials/FormulasView';
import { InteractiveLab } from './components/InteractiveLab/InteractiveLab';
import { Whiteboard } from './components/VirtualWhiteboard/Whiteboard';
import { AiMathTutor } from './components/AiMathTutor/AiMathTutor';
import { TeacherSettingsModal } from './components/TeacherSettingsModal';
import { initialTeacherProfile } from './data/mockData';
import { Question, TeacherProfile } from './types/math';
import { sound } from './utils/audio';
import { Heart, GraduationCap, Award, BookOpen, Sparkles } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'tests' | 'games' | 'formulas' | 'lab' | 'whiteboard' | 'ai-tutor'>('tests');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isTeacherSettingsOpen, setIsTeacherSettingsOpen] = useState(false);

  // Persistent Teacher Profile
  const [teacherProfile, setTeacherProfile] = useState<TeacherProfile>(() => {
    try {
      const saved = localStorage.getItem('zukko_teacher_profile');
      return saved ? JSON.parse(saved) : initialTeacherProfile;
    } catch {
      return initialTeacherProfile;
    }
  });

  // Persistent Custom Teacher Questions
  const [customQuestions, setCustomQuestions] = useState<Question[]>(() => {
    try {
      const saved = localStorage.getItem('zukko_custom_questions');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const handleSaveProfile = (profile: TeacherProfile) => {
    setTeacherProfile(profile);
    localStorage.setItem('zukko_teacher_profile', JSON.stringify(profile));
  };

  const handleAddCustomQuestion = (q: Question) => {
    const updated = [q, ...customQuestions];
    setCustomQuestions(updated);
    localStorage.setItem('zukko_custom_questions', JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        teacherProfile={teacherProfile}
        onOpenTeacherSettings={() => setIsTeacherSettingsOpen(true)}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* Hero Section shown on the Home/Tests tab */}
        {activeTab === 'tests' && (
          <TeacherHero
            teacherProfile={teacherProfile}
            onStartQuiz={() => {
              // smooth scroll to quiz section
              const el = document.getElementById('tests-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            onExploreGames={() => setActiveTab('games')}
            onOpenWhiteboard={() => setActiveTab('whiteboard')}
            onUpdateAvatar={(avatarUrl) => {
              handleSaveProfile({ ...teacherProfile, avatarUrl: avatarUrl || undefined });
            }}
          />
        )}

        <div id="tests-section">
          {activeTab === 'tests' && (
            <QuizView
              teacherProfile={teacherProfile}
              customQuestions={customQuestions}
              onAddCustomQuestion={handleAddCustomQuestion}
            />
          )}

          {activeTab === 'games' && <MathGamesHub />}

          {activeTab === 'formulas' && <FormulasView />}

          {activeTab === 'lab' && <InteractiveLab />}

          {activeTab === 'whiteboard' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    Interaktiv Qoralama va Chizma Doskasi
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Misollar yechish, qoralama hisob-kitoblar va geometrik chizmalar uchun doska
                  </p>
                </div>
              </div>
              <Whiteboard isModal={false} />
            </div>
          )}

          {activeTab === 'ai-tutor' && <AiMathTutor />}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-16 py-8 text-center text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto px-4 space-y-3">
          <div className="flex items-center justify-center gap-2 text-indigo-700 font-extrabold text-base">
            <GraduationCap className="w-5 h-5" />
            <span>Zukko Matematik Ta'lim Platformasi</span>
          </div>

          <p className="text-slate-600 max-w-md mx-auto">
            Hurmatli ustozimiz <strong>{teacherProfile.name}</strong> sharafiga va barcha intiluvchan o'quvchilar uchun mehr bilan yaratildi.
          </p>

          <div className="pt-2 text-slate-400 flex items-center justify-center gap-1">
            <span>Matematika bilan kelajak sari</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-current inline" />
            <span>• 2026</span>
          </div>
        </div>
      </footer>

      {/* Teacher Settings Modal */}
      <TeacherSettingsModal
        isOpen={isTeacherSettingsOpen}
        onClose={() => setIsTeacherSettingsOpen(false)}
        currentProfile={teacherProfile}
        onSaveProfile={handleSaveProfile}
      />
    </div>
  );
}
