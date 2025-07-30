import React, { useState } from 'react';
import EmployeeChatbot from './EmployeeChatbot';
import StartAnimation from '@/components/ui/StartAnimation';

interface ResumeData {
  file: File | null;
  text: string;
  analysis: any;
}

const EmployeeResumeAnalysis: React.FC = () => {
  const [resumeData, setResumeData] = useState<ResumeData>({
    file: null,
    text: '',
    analysis: null
  });
  const [showChatbot, setShowChatbot] = useState(true);

  const handleResumeUpload = (file: File, text: string) => {
    console.log('Resume uploaded:', file.name);
    console.log('Extracted text length:', text.length);
    console.log('Text preview:', text.substring(0, 100));
    setResumeData(prev => ({
      ...prev,
      file,
      text
    }));
  };

  const handleAnalysisComplete = (analysis: any) => {
    console.log('Analysis completed:', analysis);
    setResumeData(prev => ({
      ...prev,
      analysis
    }));
  };

  const handleFunctionSelect = (functionName: string) => {
    // Handle function selection from chatbot
    console.log('Selected function:', functionName);
  };

  const handleAnimationComplete = () => {
    // Animation completed, no need to change state as we're already showing the chatbot
    console.log('Animation completed');
  };

  return (
    <div className="h-screen w-full relative">
      <EmployeeChatbot onSelectFunction={handleFunctionSelect} />
    </div>
  );
};

export default EmployeeResumeAnalysis;