import { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  PointElement
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RotateCw } from 'lucide-react';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

interface SalaryData {
  years_experience: string;
  education: string;
  job_level: string;
  industry: string;
  location: string;
}

interface ChartData {
  experience: {
    labels: number[];
    data: number[];
  };
  education: {
    labels: string[];
    data: number[];
  };
  industry: {
    labels: string[];
    data: number[];
  };
  job_level: {
    labels: string[];
    data: number[];
  };
}

interface SalaryResult {
  predicted_salary: string;
  candidate_data: SalaryData;
  chart_data: ChartData;
}

interface SalaryPredictorProps {
  initialData?: SalaryData | null;
  useResumeData?: boolean;
}

export default function SalaryPredictor({ initialData, useResumeData = false }: SalaryPredictorProps) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const [formData, setFormData] = useState<SalaryData>({
    years_experience: initialData?.years_experience || '',
    education: initialData?.education || 'Bachelor',
    job_level: initialData?.job_level || 'Mid-level',
    industry: initialData?.industry || 'Technology',
    location: initialData?.location || 'Urban'
  });
  
  const [result, setResult] = useState<SalaryResult | null>(null);
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
      // Convert string values to numbers for calculation
      const years_experience = parseFloat(formData.years_experience);
      
      // Simple validation
      if (isNaN(years_experience)) {
        throw new Error('Please enter valid numeric values');
      }
      
      // Basic salary calculation
      const base_salary = 30000;
      const exp_factor = years_experience * 2000;
      
      // Education factor
      const edu_mapping: {[key: string]: number} = {
        'High School': 0,
        'Associate': 5000,
        'Bachelor': 15000,
        'Master': 25000,
        'PhD': 35000
      };
      const edu_factor = edu_mapping[formData.education] || 15000;
      
      // Job level factor
      const level_mapping: {[key: string]: number} = {
        'Entry-level': 0,
        'Mid-level': 20000,
        'Senior': 40000,
        'Executive': 80000
      };
      const level_factor = level_mapping[formData.job_level] || 20000;
      
      // Industry factor
      const industry_mapping: {[key: string]: number} = {
        'Technology': 15000,
        'Finance': 12000,
        'Healthcare': 10000,
        'Education': 5000,
        'Manufacturing': 8000,
        'Retail': 3000
      };
      const industry_factor = industry_mapping[formData.industry] || 15000;
      
      // Location factor
      const location_mapping: {[key: string]: number} = {
        'Urban': 10000,
        'Suburban': 5000,
        'Rural': 0
      };
      const location_factor = location_mapping[formData.location] || 10000;
      
      // Calculate salary
      const predicted_salary = base_salary + exp_factor + edu_factor + level_factor + industry_factor + location_factor;
      
      // Format salary for display
      const formatted_salary = `$${predicted_salary.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      
      // Generate chart data
      const chart_data: ChartData = {
        experience: {
          labels: [0, 5, 10, 15, 20, 25, 30],
          data: [
            30000 + 0 * 2000 + edu_factor + level_factor + industry_factor + location_factor,
            30000 + 5 * 2000 + edu_factor + level_factor + industry_factor + location_factor,
            30000 + 10 * 2000 + edu_factor + level_factor + industry_factor + location_factor,
            30000 + 15 * 2000 + edu_factor + level_factor + industry_factor + location_factor,
            30000 + 20 * 2000 + edu_factor + level_factor + industry_factor + location_factor,
            30000 + 25 * 2000 + edu_factor + level_factor + industry_factor + location_factor,
            30000 + 30 * 2000 + edu_factor + level_factor + industry_factor + location_factor,
          ]
        },
        education: {
          labels: ['High School', 'Associate', 'Bachelor', 'Master', 'PhD'],
          data: [
            30000 + exp_factor + 0 + level_factor + industry_factor + location_factor,
            30000 + exp_factor + 5000 + level_factor + industry_factor + location_factor,
            30000 + exp_factor + 15000 + level_factor + industry_factor + location_factor,
            30000 + exp_factor + 25000 + level_factor + industry_factor + location_factor,
            30000 + exp_factor + 35000 + level_factor + industry_factor + location_factor,
          ]
        },
        industry: {
          labels: ['Technology', 'Finance', 'Healthcare', 'Education', 'Manufacturing', 'Retail'],
          data: [
            30000 + exp_factor + edu_factor + level_factor + 15000 + location_factor,
            30000 + exp_factor + edu_factor + level_factor + 12000 + location_factor,
            30000 + exp_factor + edu_factor + level_factor + 10000 + location_factor,
            30000 + exp_factor + edu_factor + level_factor + 5000 + location_factor,
            30000 + exp_factor + edu_factor + level_factor + 8000 + location_factor,
            30000 + exp_factor + edu_factor + level_factor + 3000 + location_factor,
          ]
        },
        job_level: {
          labels: ['Entry-level', 'Mid-level', 'Senior', 'Executive'],
          data: [
            30000 + exp_factor + edu_factor + 0 + industry_factor + location_factor,
            30000 + exp_factor + edu_factor + 20000 + industry_factor + location_factor,
            30000 + exp_factor + edu_factor + 40000 + industry_factor + location_factor,
            30000 + exp_factor + edu_factor + 80000 + industry_factor + location_factor,
          ]
        }
      };
      
      // Set the result
      setResult({
        predicted_salary: formatted_salary,
        candidate_data: formData,
        chart_data
      });
      
      // Hide the form and show the result
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

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Salary ($)',
        },
      },
    },
  };

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {showForm ? (
        <Card>
          <CardHeader>
            <CardTitle>Salary Predictor</CardTitle>
            <CardDescription>
              Enter your details to predict your potential salary
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="years_experience">Years of Experience</Label>
                <Input
                  id="years_experience"
                  name="years_experience"
                  type="number"
                  value={formData.years_experience}
                  onChange={handleChange}
                  placeholder="Enter years of experience"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="education">Education Level</Label>
                <Select value={formData.education} onValueChange={(value) => handleSelectChange('education', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select education level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="High School">High School</SelectItem>
                    <SelectItem value="Associate">Associate</SelectItem>
                    <SelectItem value="Bachelor">Bachelor</SelectItem>
                    <SelectItem value="Master">Master</SelectItem>
                    <SelectItem value="PhD">PhD</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="job_level">Job Level</Label>
                <Select value={formData.job_level} onValueChange={(value) => handleSelectChange('job_level', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select job level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Entry-level">Entry-level</SelectItem>
                    <SelectItem value="Mid-level">Mid-level</SelectItem>
                    <SelectItem value="Senior">Senior</SelectItem>
                    <SelectItem value="Executive">Executive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <Select value={formData.industry} onValueChange={(value) => handleSelectChange('industry', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Technology">Technology</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                    <SelectItem value="Healthcare">Healthcare</SelectItem>
                    <SelectItem value="Education">Education</SelectItem>
                    <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                    <SelectItem value="Retail">Retail</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Select value={formData.location} onValueChange={(value) => handleSelectChange('location', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Urban">Urban</SelectItem>
                    <SelectItem value="Suburban">Suburban</SelectItem>
                    <SelectItem value="Rural">Rural</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <RotateCw className="mr-2 h-4 w-4 animate-spin" />
                    Predicting...
                  </>
                ) : (
                  'Predict Salary'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Salary Prediction Results</CardTitle>
            <CardDescription>
              Your predicted salary based on the provided information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-primary">{result?.predicted_salary}</h3>
                <p className="text-muted-foreground">Predicted Annual Salary</p>
              </div>

              {mounted && result?.chart_data && (
                <div className="space-y-8">
                  <div className="h-[300px]">
                    <h4 className="text-lg font-semibold mb-4">Salary by Experience</h4>
                    <Line
                      data={{
                        labels: result.chart_data.experience.labels,
                        datasets: [
                          {
                            label: 'Salary',
                            data: result.chart_data.experience.data,
                            borderColor: 'rgb(75, 192, 192)',
                            tension: 0.1
                          }
                        ]
                      }}
                      options={chartOptions}
                    />
                  </div>

                  <div className="h-[300px]">
                    <h4 className="text-lg font-semibold mb-4">Salary by Education</h4>
                    <Bar
                      data={{
                        labels: result.chart_data.education.labels,
                        datasets: [
                          {
                            label: 'Salary',
                            data: result.chart_data.education.data,
                            backgroundColor: 'rgba(75, 192, 192, 0.5)'
                          }
                        ]
                      }}
                      options={chartOptions}
                    />
                  </div>

                  <div className="h-[300px]">
                    <h4 className="text-lg font-semibold mb-4">Salary by Industry</h4>
                    <Bar
                      data={{
                        labels: result.chart_data.industry.labels,
                        datasets: [
                          {
                            label: 'Salary',
                            data: result.chart_data.industry.data,
                            backgroundColor: 'rgba(75, 192, 192, 0.5)'
                          }
                        ]
                      }}
                      options={chartOptions}
                    />
                  </div>

                  <div className="h-[300px]">
                    <h4 className="text-lg font-semibold mb-4">Salary by Job Level</h4>
                    <Bar
                      data={{
                        labels: result.chart_data.job_level.labels,
                        datasets: [
                          {
                            label: 'Salary',
                            data: result.chart_data.job_level.data,
                            backgroundColor: 'rgba(75, 192, 192, 0.5)'
                          }
                        ]
                      }}
                      options={chartOptions}
                    />
                  </div>
                </div>
              )}

              <Button onClick={handleReset} className="w-full">
                <RotateCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}