import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { ResumeAnalysis } from './ResumeAnalysis';
import { ResumeQA } from './ResumeQA';
import { InterviewQuestions } from './InterviewQuestions';
import { useNavigate } from 'react-router-dom';
import { Upload } from 'lucide-react';

interface AnalysisResult {
  match_score: number;
  matching_skills: string[];
  missing_skills: string[];
  strengths: string[];
  areas_for_improvement: string[];
}

interface ResumeData {
  file: File | null;
  text: string;
  analysis: any;
}

export const ResumeAnalysisContainer: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('analysis');
  const [resumeData, setResumeData] = useState<ResumeData>({
    file: null,
    text: '',
    analysis: null
  });

  const handleResumeUpload = (file: File, text: string) => {
    console.log('ResumeAnalysisContainer received file and text:', {
      fileName: file.name,
      textLength: text.length,
      textPreview: text.substring(0, 100)
    });
    setResumeData(prev => ({ ...prev, file, text }));
  };

  const handleAnalysisComplete = (analysis: any) => {
    console.log('Analysis completed:', analysis);
    setResumeData(prev => ({ ...prev, analysis }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-white font-sans">
              Get deep insights about your resume
            </h2>
            <div className="space-y-3">
              <p className="text-white text-base">
                Click Job Possibility to predict your job possibility
              </p>
              <p className="text-red-500 font-semibold text-base">
                Make sure to add Resume first in Resume Analysis
              </p>
            </div>
          </div>
          <Button 
            onClick={() => navigate('/candidate-predictor')}
            className="bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-slate-950 font-semibold px-6 py-2 text-lg"
          >
            Predict Job Possibility
          </Button>
        </div>

        <div className="flex gap-8">
          <div className="w-1/3 flex items-center">
            {resumeData.file ? (
              <div className="w-full h-[600px] rounded-lg overflow-hidden border border-border">
                <iframe
                  src={URL.createObjectURL(resumeData.file)}
                  className="w-full h-full"
                  title="PDF Preview"
                />
              </div>
            ) : (
              <div className="text-center p-6 rounded-lg border border-dashed border-border">
                <p className="text-lg font-medium text-muted-foreground">
                  Get Resume Preview
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  PDF files only
                </p>
              </div>
            )}
          </div>

          <div className="w-2/3">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="analysis">Resume Analysis</TabsTrigger>
                <TabsTrigger value="qa">Resume Q&A</TabsTrigger>
                <TabsTrigger value="questions">Interview Questions</TabsTrigger>
              </TabsList>

              <TabsContent value="analysis">
                <ResumeAnalysis
                  onResumeUpload={handleResumeUpload}
                  onAnalysisComplete={handleAnalysisComplete}
                />
              </TabsContent>

              <TabsContent value="qa">
                <ResumeQA
                  resumeFile={resumeData.file}
                  resumeText={resumeData.text}
                  analysis={resumeData.analysis}
                />
              </TabsContent>

              <TabsContent value="questions">
                <InterviewQuestions
                  resumeFile={resumeData.file}
                  resumeText={resumeData.text}
                  analysis={resumeData.analysis}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}; 