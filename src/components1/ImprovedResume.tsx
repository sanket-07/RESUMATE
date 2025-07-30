import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import Spinner from "@/components/ui/spinner";
import { Divider } from "@/components/ui/divider";
import { Badge } from "@/components/ui/badge";
import { FaFileAlt } from 'react-icons/fa';
import { API_ENDPOINTS } from '@/config/api';

interface ImprovedResumeProps {
  resumeFile: File | null;
}

const ROLE_REQUIREMENTS = {
  "AI/ML Engineer": [
    "Machine Learning",
    "Deep Learning",
    "Python",
    "TensorFlow/PyTorch",
    "Data Analysis",
    "Statistical Modeling",
    "Computer Vision",
    "Natural Language Processing",
    "Big Data",
    "Cloud Computing"
  ],
  "Frontend Engineer": [
    "React",
    "JavaScript/TypeScript",
    "HTML5/CSS3",
    "Responsive Design",
    "State Management",
    "Web Performance",
    "Cross-browser Compatibility",
    "UI/UX Design",
    "Testing",
    "Build Tools"
  ],
  "Backend Engineer": [
    "Node.js/Python/Java",
    "RESTful APIs",
    "Database Design",
    "System Architecture",
    "Microservices",
    "Cloud Services",
    "Security",
    "Performance Optimization",
    "CI/CD",
    "Testing"
  ],
  "Full Stack Engineer": [
    "Frontend Development",
    "Backend Development",
    "Database Management",
    "API Design",
    "Cloud Services",
    "DevOps",
    "Security",
    "Testing",
    "System Design",
    "Performance Optimization"
  ],
  "DevOps Engineer": [
    "CI/CD",
    "Docker/Kubernetes",
    "Cloud Platforms",
    "Infrastructure as Code",
    "Monitoring",
    "Logging",
    "Security",
    "Automation",
    "Scripting",
    "System Administration"
  ],
  "Data Engineer": [
    "ETL",
    "Data Warehousing",
    "Big Data",
    "SQL/NoSQL",
    "Data Modeling",
    "Data Pipeline",
    "Data Quality",
    "Cloud Services",
    "Programming",
    "Data Governance"
  ],
  "Data Scientist": [
    "Statistical Analysis",
    "Machine Learning",
    "Data Visualization",
    "Python/R",
    "SQL",
    "Big Data",
    "Business Intelligence",
    "A/B Testing",
    "Feature Engineering",
    "Model Deployment"
  ],
  "Product Manager": [
    "Product Strategy",
    "Market Research",
    "User Research",
    "Agile/Scrum",
    "Product Analytics",
    "Roadmapping",
    "Stakeholder Management",
    "User Stories",
    "Product Launch",
    "Competitive Analysis"
  ],
  "UX Designer": [
    "User Research",
    "Wireframing",
    "Prototyping",
    "User Testing",
    "Information Architecture",
    "Interaction Design",
    "Visual Design",
    "Accessibility",
    "Design Systems",
    "Usability Testing"
  ],
  "UI Developer": [
    "HTML5/CSS3",
    "JavaScript",
    "Responsive Design",
    "UI Frameworks",
    "Animation",
    "Cross-browser Compatibility",
    "Performance",
    "Accessibility",
    "Design Systems",
    "Version Control"
  ]
};

export default function ImprovedResume({ resumeFile }: ImprovedResumeProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [improvedResume, setImprovedResume] = useState<string>('');
  const [targetRole, setTargetRole] = useState<string>('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [customSkills, setCustomSkills] = useState<string>('');
  const { toast } = useToast();

  const roles = Object.keys(ROLE_REQUIREMENTS);

  const handleGetImprovedResume = async () => {
    if (!resumeFile) {
      toast({
        title: 'Error',
        description: 'Please upload a resume first.',
        variant: 'destructive',
      });
      return;
    }

    if (!targetRole) {
      toast({
        title: 'Error',
        description: 'Please select a target role.',
        variant: 'destructive',
      });
      return;
    }

    if (selectedSkills.length === 0 && !customSkills.trim()) {
      toast({
        title: 'Error',
        description: 'Please select skills to highlight or enter custom skills.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setImprovedResume('');

    const formData = new FormData();
    formData.append('resume', resumeFile);
    formData.append('target_role', targetRole);
    formData.append('highlight_skills', JSON.stringify(selectedSkills));
    if (customSkills.trim()) {
      formData.append('custom_skills', customSkills);
    }

    try {
      const response = await fetch(API_ENDPOINTS.improvedResume, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate improved resume');
      }

      const data = await response.json();
      setImprovedResume(data.improved_resume);

      toast({
        title: 'Success',
        description: 'Improved resume generated successfully.',
      });
    } catch (error) {
      console.error('Resume improvement error:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to generate improved resume.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Improved Resume</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label>Target Role</Label>
              <Select value={targetRole} onValueChange={setTargetRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {targetRole && (
              <div className="space-y-2">
                <Label>Skills to Highlight</Label>
                <div className="grid grid-cols-2 gap-2">
                  {ROLE_REQUIREMENTS[targetRole as keyof typeof ROLE_REQUIREMENTS].map((skill) => (
                    <div key={skill} className="flex items-center space-x-2">
                      <Checkbox
                        id={skill}
                        checked={selectedSkills.includes(skill)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedSkills([...selectedSkills, skill]);
                          } else {
                            setSelectedSkills(selectedSkills.filter(s => s !== skill));
                          }
                        }}
                      />
                      <Label htmlFor={skill}>{skill}</Label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <Label>Custom Skills (Optional)</Label>
              <Textarea
                placeholder="Enter additional skills to highlight, one per line..."
                value={customSkills}
                onChange={(e) => setCustomSkills(e.target.value)}
                className="min-h-[100px]"
              />
            </div>

            <Button
              onClick={handleGetImprovedResume}
              disabled={!resumeFile || !targetRole || (selectedSkills.length === 0 && !customSkills.trim())}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Spinner className="mr-2 h-4 w-4" />
                  Generating improved resume...
                </>
              ) : (
                'Generate Improved Resume'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {improvedResume && !isLoading && (
        <Card>
          <CardHeader>
            <CardTitle>Improved Resume</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="whitespace-pre-wrap bg-muted/50 p-4 rounded-lg">
              {improvedResume}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 