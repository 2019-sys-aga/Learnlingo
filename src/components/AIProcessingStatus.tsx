import React from 'react';
import { motion } from 'framer-motion';
import { Brain, FileText, Sparkles, Target, CheckCircle } from 'lucide-react';

interface ProcessingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  status: 'pending' | 'processing' | 'completed';
}

interface AIProcessingStatusProps {
  currentStep: number;
  totalSteps: number;
}

const AIProcessingStatus: React.FC<AIProcessingStatusProps> = ({
  currentStep,
  totalSteps
}) => {
  const steps: ProcessingStep[] = [
    {
      id: 'extract',
      title: 'Extracting Content',
      description: 'Reading and parsing your document',
      icon: FileText,
      status: currentStep > 0 ? 'completed' : currentStep === 0 ? 'processing' : 'pending'
    },
    {
      id: 'analyze',
      title: 'AI Analysis',
      description: 'Understanding topics and concepts',
      icon: Brain,
      status: currentStep > 1 ? 'completed' : currentStep === 1 ? 'processing' : 'pending'
    },
    {
      id: 'generate',
      title: 'Generating Questions',
      description: 'Creating personalized learning content',
      icon: Sparkles,
      status: currentStep > 2 ? 'completed' : currentStep === 2 ? 'processing' : 'pending'
    },
    {
      id: 'structure',
      title: 'Building Course',
      description: 'Organizing skills and lessons',
      icon: Target,
      status: currentStep > 3 ? 'completed' : currentStep === 3 ? 'processing' : 'pending'
    }
  ];

  const getStepIcon = (step: ProcessingStep) => {
    if (step.status === 'completed') {
      return <CheckCircle className="w-6 h-6 text-duo-green-500" />;
    }
    return <step.icon className={`w-6 h-6 ${
      step.status === 'processing' ? 'text-duo-blue-500' : 'text-gray-400'
    }`} />;
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
      <div className="text-center mb-6">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 bg-gradient-to-r from-duo-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <Brain className="w-6 h-6 text-white" />
        </motion.div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">AI is Working</h3>
        <p className="text-gray-600">Creating your personalized learning experience</p>
      </div>

      <div className="space-y-4">
        {steps.map((step, index) => (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`flex items-center gap-4 p-3 rounded-xl transition-all duration-300 ${
              step.status === 'processing' 
                ? 'bg-duo-blue-50 border border-duo-blue-200' 
                : step.status === 'completed'
                ? 'bg-duo-green-50 border border-duo-green-200'
                : 'bg-gray-50 border border-gray-200'
            }`}
          >
            <div className="flex-shrink-0">
              {step.status === 'processing' ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  {getStepIcon(step)}
                </motion.div>
              ) : (
                getStepIcon(step)
              )}
            </div>
            
            <div className="flex-1">
              <h4 className={`font-semibold ${
                step.status === 'completed' ? 'text-duo-green-700' :
                step.status === 'processing' ? 'text-duo-blue-700' :
                'text-gray-600'
              }`}>
                {step.title}
              </h4>
              <p className={`text-sm ${
                step.status === 'completed' ? 'text-duo-green-600' :
                step.status === 'processing' ? 'text-duo-blue-600' :
                'text-gray-500'
              }`}>
                {step.description}
              </p>
            </div>

            {step.status === 'processing' && (
              <div className="flex-shrink-0">
                <div className="w-2 h-2 bg-duo-blue-500 rounded-full animate-pulse" />
              </div>
            )}
          </motion.div>
        ))}
      </div>

      <div className="mt-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Progress</span>
          <span>{Math.round((currentStep / totalSteps) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            className="bg-gradient-to-r from-duo-blue-500 to-purple-500 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>
    </div>
  );
};

export default AIProcessingStatus;