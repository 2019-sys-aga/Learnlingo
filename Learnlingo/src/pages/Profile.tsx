import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Flame, Trophy, Target } from 'lucide-react';
import { useLearning } from '@/contexts/LearningContext';

const Profile = () => {
  const navigate = useNavigate();
  const { user } = useLearning();

  const stats = [
    { icon: Flame, label: 'Day Streak', value: user.streak, color: 'text-orange-500' },
    { icon: Star, label: 'Total XP', value: user.xp, color: 'text-duo-yellow-500' },
    { icon: Trophy, label: 'Level', value: user.level, color: 'text-purple-500' },
    { icon: Target, label: 'Lessons', value: 47, color: 'text-duo-green-500' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <h1 className="text-lg font-bold text-gray-800">Profile</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="p-6">
        {/* User info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 mb-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-duo-green-500 rounded-full flex items-center justify-center">
              <span className="text-2xl">👤</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">{user.name}</h2>
              <p className="text-gray-600">{user.email}</p>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200"
            >
              <div className="flex items-center gap-3">
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
                <div>
                  <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200"
        >
          <h3 className="text-lg font-bold text-gray-800 mb-4">Achievements</h3>
          <div className="grid grid-cols-3 gap-4">
            {['🏆', '🔥', '⭐', '🎯', '💎', '🚀'].map((emoji, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl mb-2">{emoji}</div>
                <p className="text-xs text-gray-600">Achievement {index + 1}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;