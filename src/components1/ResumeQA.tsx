import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { API_ENDPOINTS } from '@/config/api';

// Add this interface for the analysis type
interface Analysis {
  match_score?: number;
  matching_skills?: string[];
  missing_skills?: string[];
  strengths?: string[];
  areas_for_improvement?: string[];
}

interface ResumeQAProps {
  resumeFile: File | null;
  resumeText: string;
  analysis: any;
}

export const ResumeQA: React.FC<ResumeQAProps> = ({ resumeFile, resumeText, analysis }) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Add useEffect to log props changes
  useEffect(() => {
    console.log('ResumeQA props updated:', {
      hasResumeFile: !!resumeFile,
      resumeTextLength: resumeText?.length || 0,
      resumeTextPreview: resumeText?.substring(0, 100),
      hasAnalysis: !!analysis,
      resumeFileName: resumeFile?.name
    });
  }, [resumeFile, resumeText, analysis]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    if (!resumeText) {
      console.error('No resume text available:', {
        hasResumeFile: !!resumeFile,
        resumeTextLength: resumeText?.length || 0,
        resumeTextPreview: resumeText?.substring(0, 100)
      });
      setError('No resume text available. Please upload a resume first.');
      return;
    }

    setLoading(true);
    setError(null);
    setAnswer(null);

    try {
      console.log('Sending QA request with resume text length:', resumeText.length);
      const formData = new FormData();
      formData.append('question', question.trim());
      formData.append('resume_text', resumeText);

      const response = await fetch(API_ENDPOINTS.qa, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error occurred' }));
        throw new Error(errorData.error || `Server responded with status ${response.status}`);
      }

      const data = await response.json();
      console.log('QA response:', data);
      
      // Handle array response
      if (Array.isArray(data.answer)) {
        setAnswer(data.answer.join('\n'));
        setQuestion('');
      } else if (typeof data.answer === 'string') {
        setAnswer(data.answer);
        setQuestion('');
      } else if (data.error) {
        throw new Error(data.error);
      } else {
        throw new Error('No answer received from the server');
      }
    } catch (err) {
      console.error('QA error:', err);
      setError(err instanceof Error ? err.message : 'Failed to get answer. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!resumeText) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-4">
        <Alert variant="info" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Please upload a resume in the Resume Analysis section first to use the Q&A feature.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Ask Questions About Your Resume</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="Ask a question about your resume..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                required
              />
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button type="submit" disabled={loading}>
              {loading ? 'Getting Answer...' : 'Ask Question'}
            </Button>
          </form>

          {answer && (
            <div className="mt-6 space-y-2">
              <h3 className="font-semibold">Answer:</h3>
              <p className="text-muted-foreground whitespace-pre-wrap">{answer}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};