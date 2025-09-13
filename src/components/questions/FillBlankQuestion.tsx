import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Volume2 } from 'lucide-react';

interface Question {
  id: string;
  type: string;
  question: string;
  correctAnswer: string | string[];
  explanation?: string;
  audio?: string;
}

interface FillBlankQuestionProps {
  question: Question;
  selectedAnswer: string | null;
  onAnswerSelect: (answer: string) => void;
  showResult: boolean;
}

const FillBlankQuestion: React.FC<FillBlankQuestionProps> = ({
  question,
  selectedAnswer,
  onAnswerSelect,
  showResult
}) => {
  const [inputValue, setInputValue] = useState(selectedAnswer || '');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    onAnswerSelect(value);
  };

  const getInputStyle = () => {
    if (!showResult) return 'border-gray-300 focus:border-duo-blue-400';
    
    const isCorrect = Array.isArray(question.correctAnswer)
      ? question.correctAnswer.some(answer => 
          answer.toLowerCase() === inputValue.toLowerCase()
        )
      : question.correctAnswer.toLowerCase() === inputValue.toLowerCase();
    
    return isCorrect ? 'border-duo-green-400 bg-duo-green-50' : 'border-red-400 bg-red-50';
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Question header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-bold">_</span>
          </div>
          <span className="text-blue-600 font-semibold text-sm uppercase tracking-wide">
            Fill in the blank
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

      {/* Input field */}
      <div className="mb-8">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          disabled={showResult}
          placeholder="Type your answer..."
          className={`w-full p-4 text-lg font-medium rounded-2xl border-2 transition-all duration-200 focus:outline-none ${getInputStyle()}`}
        />
      </div>
    </div>
  );
};

export default FillBlankQuestion;