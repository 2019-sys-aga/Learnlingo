import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus } from 'lucide-react';
import { useLearning } from '@/contexts/LearningContext';
import DuolingoOwl from '@/components/DuolingoOwl';

const CourseSelection = () => {
  const navigate = useNavigate();
  const { courses, setCurrentCourse } = useLearning();

  const handleCourseSelect = (course: any) => {
    setCurrentCourse(course);
    navigate(`/learn/${course.id}`);
  };

  const handleCreateCourse = () => {
    navigate('/upload');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <h1 className="text-lg font-bold text-gray-800">Choose a course</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="p-6">
        {/* Duo mascot with speech bubble */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-4 mb-8"
        >
          <DuolingoOwl size="md" expression="happy" />
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200 relative">
            <div className="absolute -left-2 top-4 w-0 h-0 border-t-8 border-b-8 border-r-8 border-transparent border-r-white"></div>
            <p className="text-gray-700 font-medium">
              What would you like to learn?
            </p>
          </div>
        </motion.div>

        {/* Course options */}
        <div className="space-y-3 mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Available Courses</h2>
          
          {courses.map((course, index) => (
            <motion.button
              key={course.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleCourseSelect(course)}
              className="w-full bg-white rounded-2xl p-4 border-2 border-gray-200 hover:border-duo-blue-300 transition-all duration-200 flex items-center gap-4"
            >
              <div className="text-3xl">{course.flag}</div>
              <div className="flex-1 text-left">
                <h3 className="font-semibold text-gray-800 text-lg">{course.title}</h3>
                <p className="text-gray-600 text-sm">{course.description}</p>
                {course.progress > 0 && (
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-duo-green-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{course.progress}% complete</p>
                  </div>
                )}
              </div>
            </motion.button>
          ))}

          {/* Create new course option */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: courses.length * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCreateCourse}
            className="w-full bg-duo-blue-50 rounded-2xl p-4 border-2 border-duo-blue-200 hover:border-duo-blue-400 transition-all duration-200 flex items-center gap-4"
          >
            <div className="w-12 h-12 bg-duo-blue-500 rounded-full flex items-center justify-center">
              <Plus className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 text-left">
              <h3 className="font-semibold text-duo-blue-700 text-lg">Create Custom Course</h3>
              <p className="text-duo-blue-600 text-sm">Upload your own content and let AI create lessons</p>
            </div>
          </motion.button>
        </div>

        {/* Continue button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="w-full bg-duo-green-500 text-white font-bold py-4 px-6 rounded-2xl text-lg duo-shadow hover:bg-duo-green-600 transition-colors"
          disabled
        >
          CONTINUE
        </motion.button>
      </div>
    </div>
  );
};

export default CourseSelection;