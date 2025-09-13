import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Star, Flame, Gem, Heart, Menu } from 'lucide-react';
import { useLearning } from '@/contexts/LearningContext';
import SkillNode from '@/components/SkillNode';

const SkillTree = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const { user, currentCourse, courses } = useLearning();

  const course = currentCourse || courses.find(c => c.id === courseId);

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Course not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with stats */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => navigate('/courses')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <h1 className="text-lg font-bold text-gray-800">{course.title}</h1>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Menu className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Stats bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <div className="text-2xl">{course.flag}</div>
              <span className="font-semibold text-gray-800">{user.level}</span>
            </div>
            <div className="flex items-center gap-1">
              <Flame className="w-5 h-5 text-orange-500" />
              <span className="font-semibold text-orange-600">{user.streak}</span>
            </div>
            <div className="flex items-center gap-1">
              <Gem className="w-5 h-5 text-duo-blue-500" />
              <span className="font-semibold text-duo-blue-600">{user.gems}</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Heart className="w-5 h-5 text-red-500" />
            <span className="font-semibold text-red-600">{user.hearts}</span>
          </div>
        </div>
      </div>

      {/* Section header */}
      <div className="bg-duo-green-500 px-4 py-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/80 text-sm font-medium">SECTION 1, UNIT 1</p>
            <h2 className="text-white text-xl font-bold">Learn the basics</h2>
          </div>
          <button className="bg-white/20 p-2 rounded-lg">
            <Menu className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Skill tree */}
      <div className="relative px-4 py-8">
        {/* Progress path */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
          {course.skills.map((skill, index) => {
            if (index === course.skills.length - 1) return null;
            const nextSkill = course.skills[index + 1];
            return (
              <motion.path
                key={`path-${index}`}
                d={`M ${skill.position.x} ${skill.position.y + 40} Q ${skill.position.x + 25} ${skill.position.y + 80} ${nextSkill.position.x} ${nextSkill.position.y}`}
                stroke="#e5e7eb"
                strokeWidth="4"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: skill.isCompleted ? 1 : 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              />
            );
          })}
        </svg>

        {/* Skills */}
        <div className="relative" style={{ zIndex: 2 }}>
          {course.skills.map((skill, index) => (
            <motion.div
              key={skill.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1, type: "spring", stiffness: 200 }}
              style={{
                position: 'absolute',
                left: `${skill.position.x}%`,
                top: `${skill.position.y}px`,
                transform: 'translateX(-50%)'
              }}
            >
              <SkillNode skill={skill} />
            </motion.div>
          ))}
        </div>

        {/* Mascot */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1 }}
          className="absolute right-4 bottom-20"
          style={{ zIndex: 3 }}
        >
          <div className="relative">
            <div className="w-16 h-16 bg-duo-green-500 rounded-full flex items-center justify-center shadow-lg">
              <div className="text-2xl">🦉</div>
            </div>
            {/* Speech bubble */}
            <div className="absolute -top-12 -left-8 bg-white rounded-lg p-2 shadow-lg border border-gray-200 text-xs whitespace-nowrap">
              Keep it up!
              <div className="absolute bottom-0 left-6 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white transform translate-y-full"></div>
            </div>
          </div>
        </motion.div>

        {/* Treasure chest */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="absolute left-1/2 transform -translate-x-1/2"
          style={{ top: `${course.skills.length * 120 + 100}px` }}
        >
          <div className="w-16 h-12 bg-gradient-to-b from-duo-yellow-400 to-duo-yellow-600 rounded-lg shadow-lg flex items-center justify-center">
            <div className="w-12 h-8 bg-duo-yellow-500 rounded border-2 border-duo-yellow-700">
              <div className="w-full h-2 bg-duo-yellow-600 rounded-t"></div>
            </div>
          </div>
        </motion.div>

        {/* Bottom padding */}
        <div style={{ height: `${course.skills.length * 120 + 200}px` }} />
      </div>

      {/* Bottom navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
        <div className="flex justify-around">
          {[
            { icon: '🏠', label: 'Home', active: true },
            { icon: '🏆', label: 'Leaderboard' },
            { icon: '🛡️', label: 'Quests' },
            { icon: '👤', label: 'Profile' },
            { icon: '🛒', label: 'Shop' }
          ].map((item, index) => (
            <button
              key={index}
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                item.active ? 'bg-duo-blue-50' : 'hover:bg-gray-50'
              }`}
            >
              <span className="text-xl mb-1">{item.icon}</span>
              <span className={`text-xs font-medium ${
                item.active ? 'text-duo-blue-600' : 'text-gray-600'
              }`}>
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkillTree;