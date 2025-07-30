import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface CareerPathProps {
  resumeFile: File | null;
  resumeText: string;
  analysis: any;
}

const CareerPath: React.FC<CareerPathProps> = ({ resumeFile, resumeText, analysis }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [careerPaths, setCareerPaths] = useState<any>(null);

  const handleAnalyze = async () => {
    if (!resumeText) {
      setError('Please upload a resume first');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:5000/api/analyze-career-path', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ resume_text: resumeText }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze career path');
      }

      const data = await response.json();
      setCareerPaths(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Career Path Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          {!resumeText ? (
            <Alert>
              <AlertDescription>
                Please upload a resume in the Resume Analysis section first.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-4">
              <Button onClick={handleAnalyze} disabled={loading}>
                {loading ? 'Analyzing...' : 'Analyze Career Path'}
              </Button>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {careerPaths && (
                <div className="space-y-4">
                  <div className="grid gap-4">
                    {careerPaths.map((path: any, index: number) => (
                      <Card key={index}>
                        <CardHeader>
                          <CardTitle>{path.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-medium">Description</h4>
                              <p className="text-sm text-muted-foreground">{path.description}</p>
                            </div>
                            <div>
                              <h4 className="font-medium">Required Skills</h4>
                              <ul className="list-disc list-inside space-y-1">
                                {path.required_skills.map((skill: string, skillIndex: number) => (
                                  <li key={skillIndex} className="text-sm text-muted-foreground">
                                    {skill}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h4 className="font-medium">Next Steps</h4>
                              <ul className="list-disc list-inside space-y-1">
                                {path.next_steps.map((step: string, stepIndex: number) => (
                                  <li key={stepIndex} className="text-sm text-muted-foreground">
                                    {step}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CareerPath; 