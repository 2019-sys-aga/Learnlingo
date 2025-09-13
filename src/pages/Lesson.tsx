import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Heart, Volume2, Check, X } from 'lucide-react';
import { useLearning } from '@/contexts/LearningContext';
import { useToast } from '@/hooks/use-toast';
import MultipleChoiceQuestion from '@/components/questions/MultipleChoiceQuestion';
import FillBlankQuestion from '@/components/questions/FillBlankQuestion';
import TrueFalseQuestion from '@/components/questions/TrueFalseQuestion';
import ImageSelectQuestion from '@/components/questions/ImageSelectQuestion';

const Lesson = () => {
  const navigate = useNavigate();
  const { lessonId } = useParams();
  const { user, currentCourse, completeLesson } = useLearning();
  const { toast } = useToast();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [hearts, setHearts] = useState(user.hearts);
  const [xpGained, setXpGained] = useState(0);

  // Find the lesson
  const lesson = currentCourse?.skills
    .flatMap(skill => skill.lessons)
    .find(l => l.id === lessonId);

  if (!lesson) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Lesson not found</p>
      </div>
    );
  }

  const currentQuestion = lesson.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / lesson.questions.length) * 100;

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handleSubmit = () => {
    if (!selectedAnswer) return;

    const correct = Array.isArray(currentQuestion.correctAnswer)
      ? currentQuestion.correctAnswer.includes(selectedAnswer)
      : currentQuestion.correctAnswer === selectedAnswer;

    setIsCorrect(correct);
    setShowResult(true);

    if (correct) {
      setXpGained(prev => prev + 10);
    } else {
      setHearts(prev => Math.max(0, prev - 1));
    }
  };

  const handleContinue = () => {
    if (currentQuestionIndex < lesson.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      // Lesson complete
      completeLesson(lesson.id, xpGained);
      toast({
        title: "Lesson Complete!",
        description: `You earned ${xpGained} XP!`,
      });
      navigate(-1);
    }
  };

  const renderQuestion = () => {
    switch (currentQuestion.type) {
      case 'multiple-choice':
        return (
          <MultipleChoiceQuestion
            question={currentQuestion}
            selectedAnswer={selectedAnswer}
            onAnswerSelect={handleAnswerSelect}
            showResult={showResult}
          />
        );
      case 'fill-blank':
        return (
          <FillBlankQuestion
            question={currentQuestion}
            selectedAnswer={selectedAnswer}
            onAnswerSelect={handleAnswerSelect}
            showResult={showResult}
          />
        );
      case 'true-false':
        return (
          <TrueFalseQuestion
            question={currentQuestion}
            selectedAnswer={selectedAnswer}
            onAnswerSelect={handleAnswerSelect}
            showResult={showResult}
          />
        );
      case 'image-select':
        return (
          <ImageSelectQuestion
            question={currentQuestion}
            selectedAnswer={selectedAnswer}
            onAnswerSelect={handleAnswerSelect}
            showResult={showResult}
          />
        );
      default:
        return <div>Unknown question type</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          
          {/* Progress bar */}
          <div className="flex-1 mx-4">
            <div className="w-full bg-gray-200 rounded-full h-3">
              <motion.div
                className="bg-duo-green-500 h-3 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* Hearts */}
          <div className="flex items-center gap-1">
            <Heart className="w-5 h-5 text-red-500" />
            <span className="font-semibold text-red-600">{hearts}</span>
          </div>
        </div>
      </div>

      {/* Question content */}
      <div className="flex-1 flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="flex-1 p-6"
          >
            {renderQuestion()}
          </motion.div>
        </AnimatePresence>

        {/* Bottom section */}
        <div className="bg-white border-t border-gray-200 p-4">
          {showResult ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-2xl mb-4 ${
                isCorrect ? 'bg-duo-green-50 border border-duo-green-200' : 'bg-red-50 border border-red-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  isCorrect ? 'bg-duo-green-500' : 'bg-red-500'
                }`}>
                  {isCorrect ? <Check className="w-5 h-5 text-white" /> : <X className="w-5 h-5 text-white" />}
                </div>
                <div>
                  <p className={`font-bold ${isCorrect ? 'text-duo-green-700' : 'text-red-700'}`}>
                    {isCorrect ? 'Excellent!' : 'Correct answer:'}
                  </p>
                  {!isCorrect && (
                    <p className="text-red-600">
                      {Array.isArray(currentQuestion.correctAnswer) 
                        ? currentQuestion.correctAnswer.join(', ')
                        : currentQuestion.correctAnswer}
                    </p>
                  )}
                  {currentQuestion.explanation && (
                    <p className="text-gray-600 text-sm mt-1">{currentQuestion.explanation}</p>
                  )}
                </div>
              </div>
            </motion.div>
          ) : null}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={showResult ? handleContinue : handleSubmit}
            disabled={!selectedAnswer}
            className={`w-full font-bold py-4 px-6 rounded-2xl text-lg transition-all duration-200 ${
              showResult
                ? 'bg-duo-green-500 text-white duo-shadow hover:bg-duo-green-600'
                : selectedAnswer
                ? 'bg-duo-green-500 text-white duo-shadow hover:bg-duo-green-600'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {showResult 
              ? (currentQuestionIndex < lesson.questions.length - 1 ? 'CONTINUE' : 'COMPLETE')
              : 'CHECK'
            }
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default Lesson;