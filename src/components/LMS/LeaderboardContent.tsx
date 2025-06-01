import React, { useState } from 'react';
import { Trophy, Medal, Crown, TrendingUp, Calendar } from 'lucide-react';

interface LeaderboardEntry {
  rank: number;
  user: {
    name: string;
    avatar: string;
    level: number;
  };
  xp: number;
  weeklyXp: number;
}

interface LeaderboardContentProps {
  leaderboard: LeaderboardEntry[];
}

const LeaderboardContent: React.FC<LeaderboardContentProps> = ({ leaderboard }) => {
  const [activeTab, setActiveTab] = useState<'all-time' | 'weekly'>('all-time');

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="w-6 h-6 text-yellow-400" />;
      case 2: return <Medal className="w-6 h-6 text-gray-400" />;
      case 3: return <Medal className="w-6 h-6 text-amber-600" />;
      default: return <span className="text-lg font-bold text-cyan-200">{rank}</span>;
    }
  };

  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 1: return 'from-yellow-400 to-yellow-600 shadow-yellow-400/50';
      case 2: return 'from-gray-400 to-gray-600 shadow-gray-400/50';
      case 3: return 'from-amber-500 to-amber-700 shadow-amber-500/50';
      default: return 'from-neon-cyan to-neon-magenta shadow-cyan-400/30';
    }
  };

  // Sort leaderboard based on active tab
  const sortedLeaderboard = [...leaderboard].sort((a, b) => {
    if (activeTab === 'weekly') {
      return b.weeklyXp - a.weeklyXp;
    }
    return b.xp - a.xp;
  }).map((entry, index) => ({ ...entry, rank: index + 1 }));

  return (
    <div className="space-y-6">
      {/* Header with tabs - Mobile responsive */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-3">
          <Trophy className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-400" />
          <h2 className="text-xl sm:text-2xl font-bold text-neon-cyan">Leaderboard</h2>
        </div>
        
        {/* Tab switcher */}
        <div className="flex p-1 bg-white/5 rounded-xl backdrop-blur-xl border border-white/10">
          <button
            onClick={() => setActiveTab('all-time')}
            className={`flex items-center space-x-2 px-3 py-2 sm:px-4 sm:py-2 rounded-lg transition-all duration-200 text-sm sm:text-base ${
              activeTab === 'all-time'
                ? 'bg-neon-cyan/20 text-neon-cyan'
                : 'text-cyan-200/80 hover:text-neon-cyan'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>All Time</span>
          </button>
          <button
            onClick={() => setActiveTab('weekly')}
            className={`flex items-center space-x-2 px-3 py-2 sm:px-4 sm:py-2 rounded-lg transition-all duration-200 text-sm sm:text-base ${
              activeTab === 'weekly'
                ? 'bg-neon-cyan/20 text-neon-cyan'
                : 'text-cyan-200/80 hover:text-neon-cyan'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>This Week</span>
          </button>
        </div>
      </div>

      {/* Top 3 Podium - Mobile responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8">
        {sortedLeaderboard.slice(0, 3).map((entry, index) => (
          <PodiumCard 
            key={entry.user.name} 
            entry={entry} 
            position={index}
            activeTab={activeTab}
          />
        ))}
      </div>

      {/* Full Leaderboard */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-white/10">
          <h3 className="text-lg font-bold text-white">
            {activeTab === 'all-time' ? 'All Time Rankings' : 'Weekly Rankings'}
          </h3>
        </div>
        
        <div className="divide-y divide-white/10">
          {sortedLeaderboard.map((entry) => (
            <LeaderboardRow 
              key={entry.user.name} 
              entry={entry} 
              activeTab={activeTab}
            />
          ))}
        </div>
      </div>

      {/* Achievement Info */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-white/10">
        <h3 className="text-lg font-bold text-neon-cyan mb-4">How to Climb the Leaderboard</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-neon-cyan/20 rounded-full flex items-center justify-center">
              <span className="text-neon-cyan font-bold">+50</span>
            </div>
            <div>
              <p className="text-white font-medium text-sm">Complete a lesson</p>
              <p className="text-cyan-200/60 text-xs">Earn XP for each completed lesson</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-neon-magenta/20 rounded-full flex items-center justify-center">
              <span className="text-neon-magenta font-bold">+200</span>
            </div>
            <div>
              <p className="text-white font-medium text-sm">Finish a course</p>
              <p className="text-cyan-200/60 text-xs">Big XP bonus for course completion</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-neon-blue/20 rounded-full flex items-center justify-center">
              <span className="text-neon-blue font-bold">+100</span>
            </div>
            <div>
              <p className="text-white font-medium text-sm">Daily streak</p>
              <p className="text-cyan-200/60 text-xs">Bonus for consecutive learning days</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Podium Card Component
const PodiumCard: React.FC<{
  entry: LeaderboardEntry;
  position: number;
  activeTab: 'all-time' | 'weekly';
}> = ({ entry, position, activeTab }) => {
  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 1: return 'from-yellow-400 to-yellow-600';
      case 2: return 'from-gray-400 to-gray-600';
      case 3: return 'from-amber-500 to-amber-700';
      default: return 'from-neon-cyan to-neon-magenta';
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="w-5 h-5 text-yellow-400" />;
      case 2: return <Medal className="w-5 h-5 text-gray-400" />;
      case 3: return <Medal className="w-5 h-5 text-amber-600" />;
      default: return null;
    }
  };

  const xpValue = activeTab === 'weekly' ? entry.weeklyXp : entry.xp;

  return (
    <div className={`bg-white/5 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-white/10 text-center relative overflow-hidden ${
      position === 0 ? 'ring-2 ring-yellow-400/50' : ''
    }`}>
      {/* Rank badge */}
      <div className={`absolute top-4 right-4 w-8 h-8 rounded-full bg-gradient-to-r ${getRankBadgeColor(entry.rank)} flex items-center justify-center`}>
        <span className="text-white font-bold text-sm">{entry.rank}</span>
      </div>
      
      {/* Avatar */}
      <div className="relative mb-4">
        <img 
          src={entry.user.avatar} 
          alt={entry.user.name}
          className="w-16 h-16 sm:w-20 sm:h-20 rounded-full mx-auto border-2 border-neon-cyan"
          style={{boxShadow: '0 0 20px rgba(0,255,255,0.3)'}}
        />
        {getRankIcon(entry.rank) && (
          <div className="absolute -top-2 -right-2">
            {getRankIcon(entry.rank)}
          </div>
        )}
      </div>
      
      {/* User info */}
      <h3 className="text-white font-bold text-sm sm:text-base mb-1">{entry.user.name}</h3>
      <p className="text-cyan-200/80 text-xs sm:text-sm mb-3">Level {entry.user.level}</p>
      
      {/* XP */}
      <div className="bg-white/10 rounded-lg p-3">
        <p className="text-neon-cyan font-bold text-lg sm:text-xl">{xpValue.toLocaleString()}</p>
        <p className="text-cyan-200/60 text-xs">{activeTab === 'weekly' ? 'Weekly XP' : 'Total XP'}</p>
      </div>
    </div>
  );
};

// Leaderboard Row Component
const LeaderboardRow: React.FC<{
  entry: LeaderboardEntry;
  activeTab: 'all-time' | 'weekly';
}> = ({ entry, activeTab }) => {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="w-5 h-5 text-yellow-400" />;
      case 2: return <Medal className="w-5 h-5 text-gray-400" />;
      case 3: return <Medal className="w-5 h-5 text-amber-600" />;
      default: return <span className="text-lg font-bold text-cyan-200 w-5 text-center">{rank}</span>;
    }
  };

  const xpValue = activeTab === 'weekly' ? entry.weeklyXp : entry.xp;

  return (
    <div className="flex items-center justify-between p-4 sm:p-6 hover:bg-white/5 transition-colors duration-200">
      <div className="flex items-center space-x-3 sm:space-x-4 flex-1">
        {/* Rank */}
        <div className="w-8 flex justify-center">
          {getRankIcon(entry.rank)}
        </div>
        
        {/* Avatar */}
        <img 
          src={entry.user.avatar} 
          alt={entry.user.name}
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-neon-cyan/50"
        />
        
        {/* User info */}
        <div className="flex-1 min-w-0">
          <h4 className="text-white font-medium text-sm sm:text-base truncate">{entry.user.name}</h4>
          <p className="text-cyan-200/60 text-xs sm:text-sm">Level {entry.user.level}</p>
        </div>
      </div>
      
      {/* XP */}
      <div className="text-right">
        <p className="text-neon-cyan font-bold text-sm sm:text-base">{xpValue.toLocaleString()}</p>
        <p className="text-cyan-200/60 text-xs">{activeTab === 'weekly' ? 'Weekly' : 'Total'} XP</p>
      </div>
    </div>
  );
};

export default LeaderboardContent;
