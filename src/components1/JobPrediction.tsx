import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface JobPredictionProps {
  resumeFile: File | null;
  resumeText: string;
  analysis: any;
}

const JobPrediction: React.FC<JobPredictionProps> = ({ resumeFile, resumeText, analysis }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [predictions, setPredictions] = useState<any>(null);

  const handlePredict = async () => {
    if (!resumeText) {
      setError('Please upload a resume first');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:5000/api/predict-job', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ resume_text: resumeText }),
      });

      if (!response.ok) {
        throw new Error('Failed to get job predictions');
      }

      const data = await response.json();
      setPredictions(data);
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
          <CardTitle>Job Prediction</CardTitle>
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
              <Button onClick={handlePredict} disabled={loading}>
                {loading ? 'Predicting...' : 'Predict Job Roles'}
              </Button>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {predictions && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Predicted Job Roles:</h3>
                  <div className="grid gap-4">
                    {predictions.map((prediction: any, index: number) => (
                      <Card key={index}>
                        <CardContent className="pt-6">
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="font-medium">{prediction.role}</h4>
                              <p className="text-sm text-muted-foreground">
                                Match Score: {prediction.score}%
                              </p>
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

export default JobPrediction; 