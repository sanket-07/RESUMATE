import { useState } from 'react';
import { CheckCircle2, XCircle, ArrowRight, RotateCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from "@/lib/utils";

// shadcn/ui components
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface CandidateData {
  years_experience: string;
  skill_match_score: string;
  education: string;
  job_level: string;
  industry: string;
}

interface PredictionResult {
  prediction: boolean;
  probability: number;
  recommendation: string;
}

interface CandidatePredictorProps {
  initialData?: CandidateData | null;
  useResumeData?: boolean;
}

export default function CandidatePredictor({ initialData, useResumeData = false }: CandidatePredictorProps) {
  const [formData, setFormData] = useState<CandidateData>({
    years_experience: initialData?.years_experience || '',
    skill_match_score: initialData?.skill_match_score || '',
    education: initialData?.education || 'Bachelor',
    job_level: initialData?.job_level || 'Mid-level',
    industry: initialData?.industry || 'Technology'
  });
  
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(true);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const years_experience = parseFloat(formData.years_experience);
      const skill_match_score = parseFloat(formData.skill_match_score);
      
      if (isNaN(years_experience) || isNaN(skill_match_score)) {
        throw new Error('Please enter valid numeric values');
      }
      
      const experienceScore = Math.min(years_experience / 10, 1) * 0.3;
      const skillScore = skill_match_score * 0.4;
      
      let educationScore = 0;
      switch (formData.education) {
        case 'High School': educationScore = 0.1; break;
        case 'Associate': educationScore = 0.2; break;
        case 'Bachelor': educationScore = 0.3; break;
        case 'Master': educationScore = 0.4; break;
        case 'PhD': educationScore = 0.5; break;
        default: educationScore = 0.3;
      }
      educationScore *= 0.15;
      
      let levelScore = 0;
      switch (formData.job_level) {
        case 'Entry-level': levelScore = 0.7; break;
        case 'Mid-level': levelScore = 0.5; break;
        case 'Senior': levelScore = 0.3; break;
        case 'Executive': levelScore = 0.2; break;
        default: levelScore = 0.5;
      }
      levelScore *= 0.1;
      
      const industryScore = 0.05;
      const probability = experienceScore + skillScore + educationScore + levelScore + industryScore;
      const prediction = probability > 0.6;
      
      const recommendation = prediction 
        ? "Candidate is recommended for the position" 
        : "Candidate is not recommended for the position";
      
      setResult({
        prediction,
        probability,
        recommendation
      });
      
      setShowForm(false);
      
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setShowForm(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <Card className="border border-cyan-400/30 bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
              AI Candidate Predictor
            </CardTitle>
            <CardDescription className="text-gray-400">
              {useResumeData ? 'Using data from your resume analysis' : 'Enter your details manually'}
            </CardDescription>
          </CardHeader>

          {error && (
            <div className="mx-6 mb-6 p-4 bg-red-900/50 border border-red-500 rounded-lg text-red-200">
              {error}
            </div>
          )}

          {showForm ? (
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-gray-300">Years of Experience</Label>
                    <Input
                      name="years_experience"
                      type="number"
                      value={formData.years_experience}
                      onChange={handleChange}
                      className="bg-gray-800/50 border-gray-700 text-white hover:border-cyan-400 focus:border-cyan-400"
                      placeholder="5.5"
                      required
                      disabled={useResumeData}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-300">Skill Match Score (0-1)</Label>
                    <Input
                      name="skill_match_score"
                      type="number"
                      value={formData.skill_match_score}
                      onChange={handleChange}
                      className="bg-gray-800/50 border-gray-700 text-white hover:border-cyan-400 focus:border-cyan-400"
                      placeholder="0.85"
                      min="0"
                      max="1"
                      step="0.01"
                      required
                      disabled={useResumeData}
                    />
                    <p className="text-sm text-gray-500">1 = perfect skill match</p>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-300">Education</Label>
                    <Select
                      value={formData.education}
                      onValueChange={(value) => handleSelectChange('education', value)}
                      disabled={useResumeData}
                    >
                      <SelectTrigger className="bg-gray-800/50 border-gray-700 text-white hover:border-cyan-400">
                        <SelectValue placeholder="Select education" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectItem value="High School">High School</SelectItem>
                        <SelectItem value="Associate">Associate</SelectItem>
                        <SelectItem value="Bachelor">Bachelor</SelectItem>
                        <SelectItem value="Master">Master</SelectItem>
                        <SelectItem value="PhD">PhD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-300">Job Level</Label>
                    <Select
                      value={formData.job_level}
                      onValueChange={(value) => handleSelectChange('job_level', value)}
                      disabled={useResumeData}
                    >
                      <SelectTrigger className="bg-gray-800/50 border-gray-700 text-white hover:border-cyan-400">
                        <SelectValue placeholder="Select job level" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectItem value="Entry-level">Entry-level</SelectItem>
                        <SelectItem value="Mid-level">Mid-level</SelectItem>
                        <SelectItem value="Senior">Senior</SelectItem>
                        <SelectItem value="Executive">Executive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-300">Industry</Label>
                    <Select
                      value={formData.industry}
                      onValueChange={(value) => handleSelectChange('industry', value)}
                      disabled={useResumeData}
                    >
                      <SelectTrigger className="bg-gray-800/50 border-gray-700 text-white hover:border-cyan-400">
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectItem value="Technology">Technology</SelectItem>
                        <SelectItem value="Finance">Finance</SelectItem>
                        <SelectItem value="Healthcare">Healthcare</SelectItem>
                        <SelectItem value="Education">Education</SelectItem>
                        <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                        <SelectItem value="Retail">Retail</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-slate-950 font-semibold"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <RotateCw className="mr-2 h-4 w-4 animate-spin" />
                      Predicting...
                    </>
                  ) : (
                    'Predict Job Possibility'
                  )}
                </Button>
              </form>
            </CardContent>
          ) : (
            <CardContent>
              {result && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-6"
                >
                  <Card className={`border ${result.prediction ? 'border-green-500/30 bg-green-900/10' : 'border-red-500/30 bg-red-900/10'} p-6`}>
                    <div className="flex items-start gap-4">
                      {result.prediction ? (
                        <CheckCircle2 className="h-10 w-10 text-green-400 flex-shrink-0" />
                      ) : (
                        <XCircle className="h-10 w-10 text-red-400 flex-shrink-0" />
                      )}
                      <div>
                        <h3 className="text-xl font-bold text-white">
                          {result.recommendation}
                        </h3>
                        <div className="mt-4 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-400">Confidence Score</span>
                            <span className="text-sm font-medium text-white">
                              {(result.probability * 100).toFixed(2)}%
                            </span>
                          </div>
                          <Progress 
                            value={result.probability * 100} 
                            className={cn(
                              "h-2",
                              result.prediction ? "bg-green-900/50 [&>div]:bg-green-400" : "bg-red-900/50 [&>div]:bg-red-400"
                            )}
                          />
                        </div>
                        <Badge
                          variant="outline"
                          className={`mt-3 ${result.prediction ? 'border-green-400 text-green-400' : 'border-red-400 text-red-400'}`}
                        >
                          {result.prediction ? 'Recommended' : 'Not Recommended'}
                        </Badge>
                      </div>
                    </div>
                  </Card>

                  <Card className="border border-gray-700 bg-gray-800/50">
                    <CardHeader>
                      <CardTitle className="text-white">Candidate Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <p className="text-sm text-gray-400">Years of Experience</p>
                          <p className="text-white">{formData.years_experience}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-gray-400">Skill Match Score</p>
                          <p className="text-white">{formData.skill_match_score}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-gray-400">Education</p>
                          <p className="text-white">{formData.education}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-gray-400">Job Level</p>
                          <p className="text-white">{formData.job_level}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-gray-400">Industry</p>
                          <p className="text-white">{formData.industry}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Button
                    onClick={handleReset}
                    variant="outline"
                    className="w-full border-cyan-400 text-cyan-400 hover:bg-cyan-400/10 hover:text-cyan-300 py-6 text-lg"
                  >
                    <RotateCw className="mr-2" />
                    Evaluate Another Candidate
                  </Button>
                </motion.div>
              )}
            </CardContent>
          )}
        </Card>
      </motion.div>
    </div>
  );
}