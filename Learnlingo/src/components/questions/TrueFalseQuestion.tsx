import React from 'react';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';

interface Question {
  id: string;
  type: string;
  question: string;
  correctAnswer: string | string[];
  explanation?: string;
}

interface TrueFalseQuestionProps {
  question: Question;
  selectedAnswer: string | null;
  onAnswerSelect: (answer: string) => void;
  showResult: boolean;
}

const TrueFalseQuestion: React.FC<TrueFalseQuestionProps> = ({
  question,
  selectedAnswer,
  onAnswerSelect,
  showResult
}) => {
  const options = [
    { value: 'true', label: 'True', icon: Check, color: 'duo-green' },
    { value: 'false', label: 'False', icon: X, color: 'red' }
  ];

  const getOptionStyle = (value: string) => {
    if (!showResult) {
      return selectedAnswer === value
        ? 'border-duo-blue-400 bg-duo-blue-50'
        : 'border-gray-300 hover:border-gray-400';
    }

    const isCorrect = question.correctAnswer === value;
    const isSelected = selectedAnswer === value;

    if (isCorrect) return 'border-duo-green-400 bg-duo-green-50';
    if (isSelected && !isCorrect) return 'border-red-400 bg-red-50';
    return 'border-gray-300';
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Question header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-bold">T/F</span>
          </div>
          <span className="text-orange-600 font-semibold text-sm uppercase tracking-wide">
            True or False
          </span>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          {question.question}
        </h2>
      </div>

      {/* Options */}
      <div className="grid grid-cols-2 gap-4">
        {options.map((option) => (
          <motion.button
            key={option.value}
            whileHover={!showResult ? { scale: 1.02 } : {}}
            whileTap={!showResult ? { scale: 0.98 } : {}}
            onClick={() => !showResult && onAnswerSelect(option.value)}
            disabled={showResult}
            className={`p-6 rounded-2xl border-2 transition-all duration-200 flex flex-col items-center gap-3 ${getOptionStyle(option.value)}`}
          >
            <option.icon className={`w-8 h-8 text-${option.color}-500`} />
            <span className="font-bold text-lg text-gray-800">{option.label}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default TrueFalseQuestion;