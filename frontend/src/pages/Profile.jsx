import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { resultService } from '../services/resultService';
import LoadingSpinner from '../components/LoadingSpinner';
import AvatarSelector from '../components/AvatarSelector';
import Modal from '../components/common/Modal';
import PageHeader from '../components/common/PageHeader';
import StatCard from '../components/common/StatCard';
import { getUserAvatar } from '../utils/avatar';
import { calculateExp, calculateLevel, getRankTitle } from '../utils/formatters';
import { User, Trophy, Flame, Shield, Award, Sparkles, Star, Target, CheckCircle2, History } from 'lucide-react';

const Profile = () => {
  const { user, role } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [avatarId, setAvatarId] = useState(() => {
    return localStorage.getItem('quiz_app_avatar') || 'yeti';
  });
  const [showAvatarModal, setShowAvatarModal] = useState(false);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      setError('');
      const res = await resultService.getUserHistory();
      if (res.success && res.data) {
        setHistory(res.data.results || []);
      } else {
        setError(res.error || 'Failed to load quest history.');
      }
      setLoading(false);
    };

    fetchHistory();
  }, []);

  const handleAvatarSelect = (id) => {
    setAvatarId(id);
    localStorage.setItem('quiz_app_avatar', id);
  };

  const activeAvatar = getUserAvatar(avatarId);

  // Calculated Stats
  const totalAttempts = history.length;
  const victories = history.filter(h => h.passed).length;
  const totalScore = history.reduce((sum, h) => sum + h.score, 0);
  const expEarned = calculateExp(history);
  const averageAccuracy = totalAttempts > 0
    ? (history.reduce((sum, h) => sum + h.percentage, 0) / totalAttempts).toFixed(1)
    : '0.0';
  const highestScore = totalAttempts > 0
    ? Math.max(...history.map(h => h.percentage))
    : 0;

  // Level Calculation
  const currentLevel = calculateLevel(expEarned);
  const currentLevelExp = expEarned % 500;
  const levelProgress = Math.min(100, Math.round((currentLevelExp / 500) * 100));
  const rankTitle = getRankTitle(currentLevel);

  // Achievements Definition
  const achievements = [
    { id: 'first_blood', title: 'First Quest 🗡️', desc: 'Complete your 1st quiz quest', unlocked: totalAttempts >= 1 },
    { id: 'victory_vanguard', title: 'Victory Vanguard 🌟', desc: 'Clear and pass at least 1 quest', unlocked: victories >= 1 },
    { id: 'sharpshooter', title: 'Sharpshooter 🎯', desc: 'Achieve 100% accuracy on any quest', unlocked: highestScore === 100 },
    { id: 'exp_titan', title: 'EXP Titan 🔥', desc: 'Accumulate 1,000+ total EXP', unlocked: expEarned >= 1000 },
    { id: 'quest_master', title: 'Quest Master 👑', desc: 'Clear 5 or more quests in victory', unlocked: victories >= 5 },
  ];

  return (
    <div className="space-y-8 pb-12">
      <PageHeader
        icon={User}
        title={`${user?.name}'s Hero Profile`}
        subtitle="Manage your avatar, view stats, and inspect quest achievements"
        badgeText={role === 'admin' ? 'GUILD MASTER' : 'PLAYER HERO CARD'}
      >
        <button
          onClick={() => setShowAvatarModal(true)}
          className="btn-cartoon-yellow px-4 py-2.5 rounded-2xl text-xs flex items-center justify-center gap-2"
        >
          <span>Change Avatar 🎮</span>
        </button>
      </PageHeader>

      {/* Main Profile Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Hero Badge Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-4 border-slate-900 shadow-[0_8px_0_#0f172a] text-center space-y-6">
          <div className="relative inline-block mx-auto">
            <div className={`w-28 h-28 rounded-3xl ${activeAvatar.bg} border-4 border-slate-900 text-5xl flex items-center justify-center shadow-[0_6px_0_#0f172a]`}>
              {activeAvatar.emoji}
            </div>
            <button
              onClick={() => setShowAvatarModal(true)}
              className="absolute -bottom-2 -right-2 bg-amber-400 text-slate-900 border-2 border-slate-900 px-2 py-0.5 rounded-full font-cartoon text-[10px] font-black shadow"
            >
              EDIT
            </button>
          </div>

          <div>
            <h2 className="text-2xl font-black text-slate-900 font-cartoon">{user?.name}</h2>
            <p className="text-xs font-bold text-slate-500">{user?.email}</p>
            <span className="inline-block mt-2 px-3 py-1 bg-amber-300 text-slate-900 border-2 border-slate-900 rounded-full text-xs font-black font-cartoon uppercase shadow-[0_2px_0_#0f172a]">
              {rankTitle}
            </span>
          </div>

          {/* Level Progress Bar */}
          <div className="bg-slate-50 p-4 rounded-2xl border-2 border-slate-900 text-left space-y-2">
            <div className="flex justify-between items-center text-xs font-black font-cartoon">
              <span>LEVEL {currentLevel}</span>
              <span className="text-sky-600">{currentLevelExp} / 500 XP</span>
            </div>
            <div className="w-full h-4 bg-slate-200 rounded-full border-2 border-slate-900 overflow-hidden">
              <div
                className="h-full bg-amber-400 border-r-2 border-slate-900 transition-all duration-300"
                style={{ width: `${levelProgress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Right Column (2 Cols): Stats & Achievements */}
        <div className="lg:col-span-2 space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatCard icon={Flame} title="TOTAL EXP" value={`${expEarned} PTS`} colorBg="bg-amber-400" colorText="text-slate-900" />
            <StatCard icon={CheckCircle2} title="VICTORIES" value={victories} colorBg="bg-emerald-500" colorText="text-white" />
            <StatCard icon={Target} title="ACCURACY" value={`${averageAccuracy}%`} colorBg="bg-sky-500" colorText="text-white" />
            <StatCard icon={Trophy} title="BEST SCORE" value={`${highestScore}%`} colorBg="bg-rose-500" colorText="text-white" />
          </div>

          {/* Achievements Section */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-4 border-slate-900 shadow-[0_8px_0_#0f172a] space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black text-slate-900 font-cartoon flex items-center gap-2">
                  <Award className="w-6 h-6 text-amber-500" /> Hero Badges & Trophies
                </h3>
                <p className="text-xs font-bold text-slate-500">Milestones unlocked through questing</p>
              </div>
              <span className="text-xs font-black font-cartoon bg-sky-100 text-sky-900 px-3 py-1 rounded-full border-2 border-slate-900">
                {achievements.filter(a => a.unlocked).length} / {achievements.length} UNLOCKED
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {achievements.map((a) => (
                <div
                  key={a.id}
                  className={`p-4 rounded-2xl border-3 border-slate-900 flex items-center gap-3 transition-all ${
                    a.unlocked
                      ? 'bg-amber-100 shadow-[0_4px_0_#0f172a]'
                      : 'bg-slate-100 opacity-60 grayscale'
                  }`}
                >
                  <div className="w-12 h-12 rounded-2xl bg-white border-2 border-slate-900 text-2xl flex items-center justify-center shrink-0">
                    {a.icon}
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-900 font-cartoon">{a.title}</h4>
                    <p className="text-[11px] font-bold text-slate-600 mt-0.5">{a.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Avatar Selector Modal */}
      <Modal isOpen={showAvatarModal} onClose={() => setShowAvatarModal(false)} title="Choose Hero Avatar 🎮">
        <div className="space-y-6">
          <AvatarSelector
            selectedAvatarId={avatarId}
            onSelect={(id) => {
              handleAvatarSelect(id);
              setShowAvatarModal(false);
            }}
          />
        </div>
      </Modal>
    </div>
  );
};

export default Profile;
