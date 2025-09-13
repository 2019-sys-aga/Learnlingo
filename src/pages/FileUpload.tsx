import React, { useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { ArrowLeft, Upload, FileText, Image, File, Loader2, AlertCircle } from 'lucide-react';
import { useLearning } from '@/contexts/LearningContext';
import { useToast } from '@/hooks/use-toast';
import DuolingoOwl from '@/components/DuolingoOwl';
import AIProcessingStatus from '@/components/AIProcessingStatus';
import SmartQuestionGenerator from '@/components/SmartQuestionGenerator';

const FileUpload = () => {
  const navigate = useNavigate();
  const { uploadFile, setCurrentCourse, isLoading, error } = useLearning();
  const { toast } = useToast();
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [processingStep, setProcessingStep] = useState(0);
  const [showProcessing, setShowProcessing] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setUploadedFiles(prev => [...prev, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/plain': ['.txt'],
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
      'application/json': ['.json']
    },
    multiple: true
  });

  const handleProcessFiles = async () => {
    if (uploadedFiles.length === 0) return;

    setShowProcessing(true);
    setProcessingStep(0);
    
    // Simulate processing steps for better UX
    const stepInterval = setInterval(() => {
      setProcessingStep(prev => {
        if (prev < 3) return prev + 1;
        clearInterval(stepInterval);
        return prev;
      });
    }, 2000);

    try {
      const course = await uploadFile(uploadedFiles[0]);
      
      clearInterval(stepInterval);
      setProcessingStep(4);
      
      setTimeout(() => {
        setShowProcessing(false);
      }, 1000);
      
      toast({
        title: "Course created successfully!",
        description: `AI generated ${course.skills.length} skills with smart questions!`,
      });

      setCurrentCourse(course);
      navigate(`/learn/${course.id}`);
    } catch (error) {
      clearInterval(stepInterval);
      setShowProcessing(false);
      toast({
        title: "Error processing file",
        description: error || "Please try again with a different file.",
        variant: "destructive"
      });
    }
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <Image className="w-6 h-6" />;
    if (file.type.includes('pdf')) return <FileText className="w-6 h-6" />;
    return <File className="w-6 h-6" />;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/courses')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <h1 className="text-lg font-bold text-gray-800">Create Course</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="p-6">
        {/* Duo mascot with instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-4 mb-8"
        >
          <DuolingoOwl size="md" expression="thinking" />
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200 relative">
            <div className="absolute -left-2 top-4 w-0 h-0 border-t-8 border-b-8 border-r-8 border-transparent border-r-white"></div>
            <p className="text-gray-700 font-medium">
              Upload your content and I'll use AI to create personalized lessons with smart questions!
            </p>
          </div>
        </motion.div>

        {/* AI Processing Status */}
        {showProcessing && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <AIProcessingStatus currentStep={processingStep} totalSteps={4} />
          </motion.div>
        )}

        {/* Error display */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center gap-3"
          >
            <AlertCircle className="w-5 h-5 text-red-500" />
            <p className="text-red-700">{error}</p>
          </motion.div>
        )}

        {/* File upload area */}
        {!showProcessing && <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 ${
            isDragActive 
              ? 'border-duo-blue-400 bg-duo-blue-50' 
              : 'border-gray-300 hover:border-duo-blue-300 hover:bg-gray-50'
          }`}
        >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <input {...getInputProps()} />
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            {isDragActive ? 'Drop files here' : 'Upload your learning materials'}
          </h3>
          <p className="text-gray-500 mb-4">
            Drag and drop files or click to browse
          </p>
          <p className="text-sm text-gray-400">
            Supports PDF, DOCX, TXT, images, and more
          </p>
        </motion.div>
        </div>
        }
        {/* Uploaded files */}
        {uploadedFiles.length > 0 && !showProcessing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Uploaded Files</h3>
            <div className="space-y-2">
              {uploadedFiles.map((file, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-lg p-3 border border-gray-200 flex items-center gap-3"
                >
                  {getFileIcon(file)}
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{file.name}</p>
                    <p className="text-sm text-gray-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Process button */}
        {uploadedFiles.length > 0 && !showProcessing && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleProcessFiles}
            disabled={isLoading}
            className="w-full bg-duo-green-500 text-white font-bold py-4 px-6 rounded-2xl text-lg duo-shadow hover:bg-duo-green-600 transition-colors mt-8 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Starting AI Analysis...
              </>
            ) : (
              '🧠 Generate Smart Course with AI'
            )}
          </motion.button>
        )}

        {/* Smart Question Generator Info */}
        {!showProcessing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-8"
          >
            <SmartQuestionGenerator 
              onGenerate={() => {}} 
              isGenerating={isLoading} 
            />
          </motion.div>
        )}

        {/* Sample content suggestion */}
        {!showProcessing && <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 bg-duo-yellow-50 rounded-2xl p-4 border border-duo-yellow-200"
        >
          <h4 className="font-semibold text-duo-yellow-800 mb-2">💡 Pro Tip</h4>
          <p className="text-duo-yellow-700 text-sm">
            Upload PDFs, DOCX, or text files with educational content. Our AI will:
            • Extract key topics and concepts
            • Generate personalized questions
            • Create adaptive learning paths
            • Provide intelligent explanations
          </p>
        </motion.div>
        }
      </div>
    </div>
  );
};

export default FileUpload;