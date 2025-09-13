import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { LearningProvider } from "@/contexts/LearningContext";
import SplashScreen from "@/pages/SplashScreen";
import CourseSelection from "@/pages/CourseSelection";
import FileUpload from "@/pages/FileUpload";
import SkillTree from "@/pages/SkillTree";
import Lesson from "@/pages/Lesson";
import Profile from "@/pages/Profile";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LearningProvider>
        <TooltipProvider>
          <BrowserRouter>
            <Toaster />
            <Sonner />
            <Routes>
              <Route path="/" element={<SplashScreen />} />
              <Route path="/courses" element={<CourseSelection />} />
              <Route path="/upload" element={<FileUpload />} />
              <Route path="/learn/:courseId" element={<SkillTree />} />
              <Route path="/lesson/:lessonId" element={<Lesson />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </LearningProvider>
    </QueryClientProvider>
  );
}

export default App;