import React, { useState } from 'react';
import HRChatbot from './HRChatbot';
import StartAnimation from '@/components/ui/StartAnimation';
import { Button } from '@/components/ui/button';

interface ResumeData {
  file: File | null;
  text: string;
  analysis: any;
}

const HRResumeAnalysis: React.FC = () => {
  const [resumeData, setResumeData] = useState<ResumeData>({
    file: null,
    text: '',
    analysis: null
  });
  const [showChatbot, setShowChatbot] = useState(true);
  const [selectedFunction, setSelectedFunction] = useState<string | null>(null);

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
    setSelectedFunction(functionName);
  };

  const handleAnimationComplete = () => {
    // Animation completed, no need to change state as we're already showing the chatbot
    console.log('Animation completed');
  };

  return (
    <div className="h-screen w-full relative">
      <HRChatbot onSelectFunction={handleFunctionSelect} />
    </div>
  );
};

export default HRResumeAnalysis; 