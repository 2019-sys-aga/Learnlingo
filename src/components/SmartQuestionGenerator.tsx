import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, Sparkles, Target, BookOpen } from 'lucide-react';

interface SmartQuestionGeneratorProps {
  onGenerate: (questions: any[]) => void;
  isGenerating: boolean;
}

const SmartQuestionGenerator: React.FC<SmartQuestionGeneratorProps> = ({
  onGenerate,
  isGenerating
}) => {
  const [selectedTypes, setSelectedTypes] = useState<string[]>([
    'multiple-choice',
    'fill-blank',
    'true-false'
  ]);

  const questionTypes = [
    {
      id: 'multiple-choice',
      name: 'Multiple Choice',
      icon: Target,
      description: 'Test knowledge with options',
      color: 'bg-purple-500'
    },
    {
      id: 'fill-blank',
      name: 'Fill in the Blank',
      icon: BookOpen,
      description: 'Complete missing words',
      color: 'bg-blue-500'
    },
    {
      id: 'true-false',
      name: 'True or False',
      icon: Brain,
      description: 'Verify understanding',
      color: 'bg-orange-500'
    },
    {
      id: 'short-answer',
      name: 'Short Answer',
      icon: Sparkles,
      description: 'Explain concepts',
      color: 'bg-green-500'
    }
  ];

  const toggleQuestionType = (typeId: string) => {
    setSelectedTypes(prev => 
      prev.includes(typeId)
        ? prev.filter(id => id !== typeId)
        : [...prev, typeId]
    );
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
          <Brain className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-800">AI Question Generator</h3>
          <p className="text-sm text-gray-600">Customize your learning experience</p>
        </div>
      </div>

      <div className="space-y-3 mb-6">
        <h4 className="font-semibold text-gray-700">Question Types</h4>
        <div className="grid grid-cols-2 gap-3">
          {questionTypes.map((type) => (
            <motion.button
              key={type.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => toggleQuestionType(type.id)}
              className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                selectedTypes.includes(type.id)
                  ? 'border-duo-green-400 bg-duo-green-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-6 h-6 ${type.color} rounded-full flex items-center justify-center`}>
                  <type.icon className="w-3 h-3 text-white" />
                </div>
                <span className="font-medium text-sm text-gray-800">{type.name}</span>
              </div>
              <p className="text-xs text-gray-600 text-left">{type.description}</p>
            </motion.button>
          ))}
        </div>
      </div>

      <div className="bg-duo-blue-50 rounded-xl p-4 border border-duo-blue-200">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-duo-blue-600" />
          <span className="font-semibold text-duo-blue-800 text-sm">AI Features</span>
        </div>
        <ul className="text-xs text-duo-blue-700 space-y-1">
          <li>• Adaptive difficulty based on content complexity</li>
          <li>• Context-aware question generation</li>
          <li>• Intelligent explanations and hints</li>
          <li>• Progress tracking and analytics</li>
        </ul>
      </div>
    </div>
  );
};

export default SmartQuestionGenerator;