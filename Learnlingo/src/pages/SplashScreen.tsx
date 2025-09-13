import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import DuolingoOwl from '@/components/DuolingoOwl';

const SplashScreen = () => {
  const navigate = useNavigate();
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleGetStarted = () => {
    navigate('/courses');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-duo-green-400 via-duo-green-500 to-duo-green-600 flex flex-col items-center justify-center p-4">
      {/* Status bar simulation */}
      <div className="absolute top-0 left-0 right-0 h-12 flex items-center justify-between px-6 text-white font-semibold">
        <span>9:41</span>
        <div className="flex items-center gap-1">
          <div className="flex gap-1">
            <div className="w-1 h-3 bg-white rounded-full"></div>
            <div className="w-1 h-3 bg-white rounded-full"></div>
            <div className="w-1 h-3 bg-white rounded-full"></div>
            <div className="w-1 h-3 bg-white rounded-full"></div>
          </div>
          <svg className="w-6 h-4 ml-2" viewBox="0 0 24 16" fill="white">
            <path d="M2 4h20v8H2z" />
            <path d="M22 6h2v4h-2z" />
          </svg>
        </div>
      </div>

      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "backOut" }}
        className="text-center"
      >
        <DuolingoOwl size="xl" expression="excited" />
        
        <motion.h1
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-6xl font-bold text-white mt-8 mb-4"
        >
          LearnLingo
        </motion.h1>
        
        <motion.p
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="text-xl text-white/90 mb-12"
        >
          Learn anything, anywhere
        </motion.p>
      </motion.div>

      {showContent && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-sm space-y-4"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleGetStarted}
            className="w-full bg-white text-duo-green-600 font-bold py-4 px-6 rounded-2xl text-lg duo-shadow hover:shadow-lg transition-all duration-200"
          >
            GET STARTED
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full bg-transparent border-2 border-white text-white font-bold py-4 px-6 rounded-2xl text-lg hover:bg-white/10 transition-all duration-200"
          >
            I ALREADY HAVE AN ACCOUNT
          </motion.button>
        </motion.div>
      )}

      {/* Bottom indicator */}
      <div className="absolute bottom-4 w-32 h-1 bg-black/20 rounded-full"></div>
    </div>
  );
};

export default SplashScreen;