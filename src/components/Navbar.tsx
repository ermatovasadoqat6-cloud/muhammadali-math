import React from 'react';
import { 
  BookOpen, 
  Gamepad2, 
  FileText, 
  Activity, 
  Edit3, 
  Sparkles, 
  Settings, 
  Volume2, 
  VolumeX, 
  GraduationCap 
} from 'lucide-react';
import { sound } from '../utils/audio';
import { TeacherProfile } from '../types/math';

interface NavbarProps {
  activeTab: 'tests' | 'games' | 'formulas' | 'lab' | 'whiteboard' | 'ai-tutor';
  setActiveTab: (tab: 'tests' | 'games' | 'formulas' | 'lab' | 'whiteboard' | 'ai-tutor') => void;
  teacherProfile: TeacherProfile;
  onOpenTeacherSettings: () => void;
  soundEnabled: boolean;
  setSoundEnabled: (val: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  teacherProfile,
  onOpenTeacherSettings,
  soundEnabled,
  setSoundEnabled,
}) => {
  const toggleSound = () => {
    sound.enabled = !soundEnabled;
    setSoundEnabled(!soundEnabled);
    if (!soundEnabled) sound.playClick();
  };

  const navItems = [
    { id: 'tests', label: 'Testlar', icon: BookOpen, badge: '5-11 sinf' },
    { id: 'games', label: 'O\'yinlar', icon: Gamepad2, badge: '5 ta o\'yin' },
    { id: 'formulas', label: 'Formulalar', icon: FileText, badge: 'Ma\'lumotnoma' },
    { id: 'lab', label: 'Grafik & Lab', icon: Activity, badge: 'Interaktiv' },
    { id: 'whiteboard', label: 'Qoralama Doska', icon: Edit3, badge: 'Chizma' },
    { id: 'ai-tutor', label: 'Ustoz AI', icon: Sparkles, badge: 'Yordamchi' },
  ] as const;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Teacher Branding */}
          <div 
            onClick={() => setActiveTab('tests')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-sky-500 flex items-center justify-center text-white shadow-md shadow-indigo-200 group-hover:scale-105 transition-transform duration-200">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
                  Zukko Matematik
                </span>
              </div>
              <p className="text-xs text-slate-500 line-clamp-1 font-medium">
                {teacherProfile.name}
              </p>
            </div>
          </div>

          {/* Navigation Tabs (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1.5 bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200/60">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    sound.playClick();
                    setActiveTab(item.id);
                  }}
                  className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-white text-indigo-700 shadow-xs border border-slate-200/80 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.id === 'ai-tutor' && (
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Quick Actions (Sound & Teacher Settings) */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleSound}
              title={soundEnabled ? 'Ovozni o\'chirish' : 'Ovozni yoqish'}
              className="p-2.5 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200"
            >
              {soundEnabled ? (
                <Volume2 className="w-5 h-5 text-indigo-600" />
              ) : (
                <VolumeX className="w-5 h-5 text-slate-400" />
              )}
            </button>

            <button
              onClick={() => {
                sound.playClick();
                onOpenTeacherSettings();
              }}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200/80 hover:border-indigo-200 transition-all duration-200"
              title="Ustoz profilini va platforma parametrlarini sozlash"
            >
              {teacherProfile.avatarUrl ? (
                <img
                  src={teacherProfile.avatarUrl}
                  alt={teacherProfile.name}
                  className="w-5 h-5 rounded-full object-cover ring-1 ring-indigo-500"
                />
              ) : (
                <Settings className="w-4 h-4 text-indigo-600" />
              )}
              <span className="hidden sm:inline">Ustoz Sozlamalari</span>
            </button>
          </div>

        </div>

        {/* Mobile Navigation Scrollbar */}
        <div className="flex lg:hidden overflow-x-auto py-2 -mx-4 px-4 gap-1.5 border-t border-slate-100 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  sound.playClick();
                  setActiveTab(item.id);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-colors ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

      </div>
    </header>
  );
};
