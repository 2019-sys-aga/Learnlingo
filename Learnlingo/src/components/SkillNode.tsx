import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Star, Lock, Play, Mic, BookOpen } from 'lucide-react';

interface Skill {
  id: string;
  title: string;
  description: string;
  level: number;
  maxLevel: number;
  isUnlocked: boolean;
  isCompleted: boolean;
  lessons: any[];
  position: { x: number; y: number };
}

interface SkillNodeProps {
  skill: Skill;
}

const SkillNode: React.FC<SkillNodeProps> = ({ skill }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (!skill.isUnlocked) return;
    
    // Find first incomplete lesson
    const nextLesson = skill.lessons.find(lesson => !lesson.isCompleted) || skill.lessons[0];
    if (nextLesson) {
      navigate(`/lesson/${nextLesson.id}`);
    }
  };

  const getNodeColor = () => {
    if (!skill.isUnlocked) return 'bg-gray-300';
    if (skill.isCompleted) return 'bg-duo-yellow-400';
    if (skill.level > 0) return 'bg-duo-green-500';
    return 'bg-duo-blue-500';
  };

  const getNodeIcon = () => {
    if (!skill.isUnlocked) return <Lock className="w-6 h-6 text-gray-500" />;
    if (skill.isCompleted) return <Star className="w-6 h-6 text-white" />;
    return <BookOpen className="w-6 h-6 text-white" />;
  };

  return (
    <div className="flex flex-col items-center">
      <motion.button
        whileHover={skill.isUnlocked ? { scale: 1.1 } : {}}
        whileTap={skill.isUnlocked ? { scale: 0.95 } : {}}
        onClick={handleClick}
        disabled={!skill.isUnlocked}
        className={`skill-node w-16 h-16 rounded-full ${getNodeColor()} shadow-lg flex items-center justify-center relative ${
          skill.isUnlocked ? 'cursor-pointer' : 'cursor-not-allowed'
        }`}
      >
        {getNodeIcon()}
        
        {/* Progress ring */}
        {skill.isUnlocked && skill.level > 0 && (
          <svg className="absolute inset-0 w-16 h-16 transform -rotate-90">
            <circle
              cx="32"
              cy="32"
              r="28"
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="3"
              fill="none"
            />
            <circle
              cx="32"
              cy="32"
              r="28"
              stroke="white"
              strokeWidth="3"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 28}`}
              strokeDashoffset={`${2 * Math.PI * 28 * (1 - skill.level / skill.maxLevel)}`}
              className="transition-all duration-500"
            />
          </svg>
        )}

        {/* Level indicator */}
        {skill.level > 0 && (
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-duo-yellow-400 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-md">
            {skill.level}
          </div>
        )}
      </motion.button>

      {/* Skill title */}
      <p className="text-sm font-semibold text-gray-700 mt-2 text-center max-w-20">
        {skill.title}
      </p>

      {/* Lesson types */}
      {skill.isUnlocked && (
        <div className="flex gap-1 mt-2">
          {skill.lessons.slice(0, 5).map((lesson, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full ${
                lesson.isCompleted ? 'bg-duo-green-500' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SkillNode;