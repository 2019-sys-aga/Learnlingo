import React from 'react';
import { motion } from 'framer-motion';
import { Volume2 } from 'lucide-react';

interface Question {
  id: string;
  type: string;
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation?: string;
  audio?: string;
  image?: string;
}

interface MultipleChoiceQuestionProps {
  question: Question;
  selectedAnswer: string | null;
  onAnswerSelect: (answer: string) => void;
  showResult: boolean;
}

const MultipleChoiceQuestion: React.FC<MultipleChoiceQuestionProps> = ({
  question,
  selectedAnswer,
  onAnswerSelect,
  showResult
}) => {
  const getOptionStyle = (option: string) => {
    if (!showResult) {
      return selectedAnswer === option
        ? 'border-duo-blue-400 bg-duo-blue-50'
        : 'border-gray-300 hover:border-gray-400';
    }

    const isCorrect = Array.isArray(question.correctAnswer)
      ? question.correctAnswer.includes(option)
      : question.correctAnswer === option;
    
    const isSelected = selectedAnswer === option;

    if (isCorrect) return 'border-duo-green-400 bg-duo-green-50';
    if (isSelected && !isCorrect) return 'border-red-400 bg-red-50';
    return 'border-gray-300';
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Question header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-bold">?</span>
          </div>
          <span className="text-purple-600 font-semibold text-sm uppercase tracking-wide">
            Multiple Choice
          </span>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          {question.question}
        </h2>

        {question.audio && (
          <button className="flex items-center gap-2 bg-duo-blue-500 text-white px-4 py-2 rounded-lg hover:bg-duo-blue-600 transition-colors">
            <Volume2 className="w-5 h-5" />
            <span className="font-medium">Play audio</span>
          </button>
        )}
      </div>

      {/* Options */}
      <div className="space-y-3">
        {question.options?.map((option, index) => (
          <motion.button
            key={index}
            whileHover={!showResult ? { scale: 1.02 } : {}}
            whileTap={!showResult ? { scale: 0.98 } : {}}
            onClick={() => !showResult && onAnswerSelect(option)}
            disabled={showResult}
            className={`w-full p-4 rounded-2xl border-2 text-left transition-all duration-200 ${getOptionStyle(option)}`}
          >
            <span className="font-medium text-gray-800">{option}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default MultipleChoiceQuestion;