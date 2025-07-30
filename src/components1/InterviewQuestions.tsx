import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { API_ENDPOINTS } from '@/config/api';

interface InterviewQuestionsProps {
  resumeFile: File | null;
  resumeText: string;
  analysis: any;
}

export const InterviewQuestions: React.FC<InterviewQuestionsProps> = ({ resumeFile, resumeText, analysis }) => {
  const [difficulty, setDifficulty] = useState('medium');
  const [numQuestions, setNumQuestions] = useState(5);
  const [questionTypes, setQuestionTypes] = useState<string[]>(['technical', 'behavioral']);
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerateQuestions = async () => {
    if (!resumeFile) {
      setError('Please upload a resume in the Resume Analysis section first.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('resume', resumeFile);
      formData.append('difficulty', difficulty);
      formData.append('num_questions', numQuestions.toString());
      formData.append('question_types', JSON.stringify(questionTypes));

      const response = await fetch(API_ENDPOINTS.questions, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate questions');
      }

      const data = await response.json();
      setQuestions(data.questions);
    } catch (err) {
      console.error('Questions generation error:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate questions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!resumeFile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-4">
        <Alert variant="info" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Please upload a resume in the Resume Analysis section first to generate interview questions.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Generate Interview Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Difficulty Level</label>
                <Select value={difficulty} onValueChange={setDifficulty}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Number of Questions</label>
                <Select value={numQuestions.toString()} onValueChange={(value) => setNumQuestions(parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select number of questions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">3 Questions</SelectItem>
                    <SelectItem value="5">5 Questions</SelectItem>
                    <SelectItem value="7">7 Questions</SelectItem>
                    <SelectItem value="10">10 Questions</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Question Types</label>
              <div className="flex flex-wrap gap-2">
                {['technical', 'behavioral', 'situational', 'problem-solving'].map((type) => (
                  <Button
                    key={type}
                    variant={questionTypes.includes(type) ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      setQuestionTypes(prev =>
                        prev.includes(type)
                          ? prev.filter(t => t !== type)
                          : [...prev, type]
                      );
                    }}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Button>
                ))}
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button onClick={handleGenerateQuestions} disabled={loading}>
              {loading ? 'Generating Questions...' : 'Generate Questions'}
            </Button>

            {questions.length > 0 && (
              <div className="space-y-6 mt-6">
                <h3 className="font-semibold text-lg">Generated Questions:</h3>
                {questions.map((q, index) => (
                  <Card key={index} className="bg-muted/50">
                    <CardContent className="pt-6">
                      <div className="space-y-2">
                        <div className="flex justify-between items-start">
                          <p className="font-medium">{q.question}</p>
                          <span className="text-sm text-muted-foreground capitalize">{q.difficulty}</span>
                        </div>
                        <p className="text-sm text-muted-foreground capitalize">Type: {q.type}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 