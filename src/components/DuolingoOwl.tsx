import React from 'react';
import { motion } from 'framer-motion';

interface DuolingoOwlProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  expression?: 'happy' | 'excited' | 'thinking' | 'sad';
  animate?: boolean;
}

const DuolingoOwl: React.FC<DuolingoOwlProps> = ({ 
  size = 'md', 
  expression = 'happy',
  animate = true 
}) => {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
    xl: 'w-48 h-48'
  };

  const eyeExpressions = {
    happy: { scaleY: 1, y: 0 },
    excited: { scaleY: 1.2, y: -2 },
    thinking: { scaleY: 0.8, y: 2 },
    sad: { scaleY: 0.6, y: 4 }
  };

  return (
    <motion.div 
      className={`relative ${sizeClasses[size]} mx-auto`}
      animate={animate ? { 
        y: [0, -8, 0],
        rotate: [0, 2, -2, 0]
      } : {}}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      {/* Owl body */}
      <div className="absolute inset-0 bg-duo-green-500 rounded-full shadow-lg">
        {/* Eyes */}
        <motion.div 
          className="absolute top-1/4 left-1/4 w-4 h-4 bg-white rounded-full shadow-inner"
          animate={eyeExpressions[expression]}
          transition={{ duration: 0.3 }}
        >
          <div className="absolute top-1 left-1 w-2 h-2 bg-gray-800 rounded-full" />
        </motion.div>
        <motion.div 
          className="absolute top-1/4 right-1/4 w-4 h-4 bg-white rounded-full shadow-inner"
          animate={eyeExpressions[expression]}
          transition={{ duration: 0.3 }}
        >
          <div className="absolute top-1 right-1 w-2 h-2 bg-gray-800 rounded-full" />
        </motion.div>
        
        {/* Beak */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-0 h-0 border-l-2 border-r-2 border-b-3 border-transparent border-b-orange-400" />
        </div>
        
        {/* Eyebrows */}
        <div className="absolute top-2 left-3 w-3 h-1 bg-duo-green-600 rounded transform -rotate-12" />
        <div className="absolute top-2 right-3 w-3 h-1 bg-duo-green-600 rounded transform rotate-12" />
      </div>
    </motion.div>
  );
};

export default DuolingoOwl;