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
}

interface ImageSelectQuestionProps {
  question: Question;
  selectedAnswer: string | null;
  onAnswerSelect: (answer: string) => void;
  showResult: boolean;
}

const ImageSelectQuestion: React.FC<ImageSelectQuestionProps> = ({
  question,
  selectedAnswer,
  onAnswerSelect,
  showResult
}) => {
  // Sample images for demonstration
  const imageOptions = [
    { value: 'woman', image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face', label: 'the woman' },
    { value: 'man', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face', label: 'the man' },
    { value: 'child', image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=200&h=200&fit=crop&crop=face', label: 'the child' },
    { value: 'number', image: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=200&h=200&fit=crop', label: 'one' }
  ];

  const getOptionStyle = (value: string) => {
    if (!showResult) {
      return selectedAnswer === value
        ? 'border-duo-green-400 bg-duo-green-50'
        : 'border-gray-300 hover:border-gray-400';
    }

    const isCorrect = Array.isArray(question.correctAnswer)
      ? question.correctAnswer.includes(value)
      : question.correctAnswer === value;
    
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
          <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-bold">📷</span>
          </div>
          <span className="text-pink-600 font-semibold text-sm uppercase tracking-wide">
            Select the image
          </span>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          {question.question}
        </h2>

        {question.audio && (
          <div className="flex items-center gap-3 mb-6">
            <button className="flex items-center gap-2 bg-duo-blue-500 text-white px-4 py-2 rounded-lg hover:bg-duo-blue-600 transition-colors">
              <Volume2 className="w-5 h-5" />
            </button>
            <span className="text-duo-blue-600 font-medium text-lg">la femme</span>
          </div>
        )}
      </div>

      {/* Image options */}
      <div className="grid grid-cols-2 gap-4">
        {imageOptions.map((option) => (
          <motion.button
            key={option.value}
            whileHover={!showResult ? { scale: 1.02 } : {}}
            whileTap={!showResult ? { scale: 0.98 } : {}}
            onClick={() => !showResult && onAnswerSelect(option.value)}
            disabled={showResult}
            className={`p-4 rounded-2xl border-2 transition-all duration-200 ${getOptionStyle(option.value)}`}
          >
            <div className="aspect-square rounded-xl overflow-hidden mb-3">
              <img
                src={option.image}
                alt={option.label}
                className="w-full h-full object-cover"
              />
            </div>
            <p className="font-medium text-gray-800">{option.label}</p>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default ImageSelectQuestion;