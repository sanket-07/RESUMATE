from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import uvicorn
import tempfile
import os
import logging
import datetime
from PyPDF2 import PdfReader
import re
import PyPDF2
import io
import json
from groq import Groq
from dotenv import load_dotenv

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Groq client with different API keys for different functionalities
client_analysis = Groq(api_key=os.getenv('API_KEY_ANALYSIS'))
client_qa = Groq(api_key=os.getenv('API_KEY_QA'))
client_questions = Groq(api_key=os.getenv('API_KEY_QUESTIONS'))
client_improvement = Groq(api_key=os.getenv('API_KEY_IMPROVEMENT'))
client_improved_resume = Groq(api_key=os.getenv('API_KEY_IMPROVED_RESUME'))

# Define role requirements
ROLE_REQUIREMENTS = {
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
}

def extract_text_from_pdf(file: UploadFile) -> str:
    try:
        reader = PdfReader(file.file)
        text = ""
        for page in reader.pages:
            text += page.extract_text()
        return text
    except Exception as e:
        raise Exception(f"Error extracting text from PDF: {str(e)}")

def analyze_resume_text(text: str, requirements: str) -> dict:
    """Analyze resume text against job requirements with bias reduction."""
    try:
        # Anonymize the text first
        text = anonymize_text(text)
        
        # Standardized evaluation criteria
        evaluation_criteria = {
            "technical_skills": 40,  # 40% weight
            "experience": 30,        # 30% weight
            "education": 30          # 30% weight
        }
        
        # Calculate scores for each criterion
        scores = {
            "technical_skills": evaluate_technical_skills(text, requirements),
            "experience": evaluate_experience(text),
            "education": evaluate_education(text)
        }
        
        # Calculate weighted final score
        final_score = sum(
            scores[criterion] * (weight/100)
            for criterion, weight in evaluation_criteria.items()
        )
        
        # Convert requirements to list if it's a string
        if isinstance(requirements, str):
            requirements = [req.strip() for req in requirements.split(',')]
        
        # Convert text to lowercase for case-insensitive matching
        text_lower = text.lower()
        
        # Find matching skills
        matching_skills = []
        missing_skills = []
        
        for req in requirements:
            if req.lower() in text_lower:
                matching_skills.append(req)
            else:
                missing_skills.append(req)
        
        # Calculate match score
        total_requirements = len(requirements)
        if total_requirements == 0:
            match_score = 0
        else:
            match_score = int((len(matching_skills) / total_requirements) * 100)
        
        # Generate strengths and improvement areas
        strengths = []
        if matching_skills:
            strengths.append(f"Strong background in {', '.join(matching_skills[:3])}")
        
        improvement_areas = []
        if missing_skills:
            improvement_areas.append(f"Consider adding experience with {', '.join(missing_skills[:3])}")
        
        return {
            "match_score": int(final_score),
            "matching_skills": matching_skills,
            "missing_skills": missing_skills,
            "strengths": strengths,
            "improvement_areas": improvement_areas
        }
    except Exception as e:
        logger.error(f"Error analyzing resume text: {str(e)}")
        raise

def anonymize_text(text: str) -> str:
    """Anonymize personal identifiers in text"""
    # Replace gender-specific pronouns
    text = re.sub(r'\b(he|him|his|she|her|hers)\b', 'they/them', text, flags=re.IGNORECASE)
    
    # Replace names with "Candidate"
    names = re.findall(r'([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)', text)
    for name in names:
        text = text.replace(name, 'Candidate')
    
    return text

def evaluate_technical_skills(text: str, requirements: List[str]) -> float:
    """Evaluate technical skills objectively"""
    # Count matching skills
    matches = sum(1 for req in requirements if req.lower() in text.lower())
    return (matches / len(requirements)) * 100 if requirements else 0

def evaluate_experience(text: str) -> float:
    """Evaluate experience based on years and achievements"""
    # Basic experience scoring
    years = len(re.findall(r'\d+\s*years?', text, re.I))
    return min(years * 10, 100)  # Cap at 100

def evaluate_education(text: str) -> float:
    """Evaluate education level"""
    # Basic education scoring
    education_score = 0
    if re.search(r'phd|doctorate', text, re.I):
        education_score = 100
    elif re.search(r'master', text, re.I):
        education_score = 80
    elif re.search(r'bachelor|degree', text, re.I):
        education_score = 60
    return education_score

@app.post("/api/analyze")
async def analyze_resume(
    resume: UploadFile = File(...),
    job_description: str = Form(...)
):
    try:
        # Extract text from PDF
        resume_text = extract_text_from_pdf(resume)
        
        prompt = f"""
        Analyze this resume:
        {resume_text}

        Against this job description:
        {job_description}

        Provide a detailed analysis in this exact JSON format:
        {{
            "match_score": <number between 0 and 100>,
            "matching_skills": [<list of matching skills>],
            "missing_skills": [<list of missing skills>],
            "strengths": [<list of strengths>],
            "areas_for_improvement": [<list of areas for improvement>]
        }}

        Important:
        1. Return ONLY valid JSON, no other text
        2. Ensure all fields are present
        3. Use proper JSON formatting with double quotes
        4. Include at least one item in each array
        5. Analyze the resume against the specific job description provided
        6. Consider both technical and soft skills mentioned in the job description
        7. Match score should reflect how well the candidate matches the job requirements
        """

        completion = client_analysis.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
            max_tokens=1024,
        )

        response_text = completion.choices[0].message.content.strip()
        
        # Try to parse the response as JSON
        try:
            analysis_result = json.loads(response_text)
            
            # Validate the response format
            required_fields = ["match_score", "matching_skills", "missing_skills", "strengths", "areas_for_improvement"]
            for field in required_fields:
                if field not in analysis_result:
                    raise ValueError(f"Missing required field: {field}")
            
            # Ensure arrays are not empty
            if not analysis_result["matching_skills"]:
                analysis_result["matching_skills"] = ["No matching skills found"]
            if not analysis_result["missing_skills"]:
                analysis_result["missing_skills"] = ["No missing skills found"]
            if not analysis_result["strengths"]:
                analysis_result["strengths"] = ["No specific strengths identified"]
            if not analysis_result["areas_for_improvement"]:
                analysis_result["areas_for_improvement"] = ["No specific areas for improvement identified"]
            
            return analysis_result
            
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse AI response as JSON: {response_text}")
            # Return a default analysis if JSON parsing fails
            return {
                "match_score": 0,
                "matching_skills": ["Error analyzing skills"],
                "missing_skills": ["Error analyzing missing skills"],
                "strengths": ["Unable to analyze strengths"],
                "areas_for_improvement": ["Error analyzing improvement areas"]
            }
            
    except Exception as e:
        logger.error(f"Error in analyze_resume: {str(e)}")
        return {
            "match_score": 0,
            "matching_skills": ["Error analyzing skills"],
            "missing_skills": ["Error analyzing missing skills"],
            "strengths": ["Error analyzing strengths"],
            "areas_for_improvement": [f"Error: {str(e)}"]
        }

@app.get("/health")
async def health_check():
    """Health check endpoint to verify the server is running"""
    try:
        return {
            "status": "healthy",
            "timestamp": datetime.datetime.now().isoformat()
        }
    except Exception as e:
        logger.error(f"Health check failed: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/qa")
async def resume_qa(
    resume_file: Optional[UploadFile] = File(None),
    resume_text: Optional[str] = Form(None),
    question: str = Form(...)
):
    try:
        # Get resume text either from file or directly from the request
        if resume_file:
            text = extract_text_from_pdf(resume_file)
        elif resume_text:
            text = resume_text
        else:
            return {"error": "Please provide either a resume file or resume text"}
        
        prompt = f"""
        Based on this resume:
        {text}

        Answer this question:
        {question}

        Format your response as bullet points, with each point starting with a hyphen (-).
        Keep each point concise and clear.
        If the information is not available in the resume, say so in a single bullet point.
        """

        completion = client_qa.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
            max_tokens=1024,
        )

        # Split the response into bullet points
        answer = completion.choices[0].message.content
        bullet_points = [point.strip() for point in answer.split('\n') if point.strip()]
        
        # Ensure each point starts with a hyphen
        formatted_points = []
        for point in bullet_points:
            if not point.startswith('-'):
                point = f"- {point}"
            formatted_points.append(point)

        return {"answer": formatted_points}
    except Exception as e:
        logger.error(f"Error in resume_qa: {str(e)}")
        return {"error": str(e)}

@app.post("/api/questions")
async def generate_questions(
    resume: UploadFile = File(...),
    question_types: str = Form(...),
    difficulty: str = Form(...),
    num_questions: int = Form(...)
):
    try:
        # Extract text from PDF
        resume_text = extract_text_from_pdf(resume)
        
        # Parse question types
        types = json.loads(question_types)
        
        prompt = f"""
        Based on this resume:
        {resume_text}

        Generate {num_questions} interview questions with these specifications:
        - Types: {', '.join(types)}
        - Difficulty: {difficulty}
        - Questions should be specific to the candidate's experience and skills

        Provide the questions in this exact JSON format:
        {{
            "questions": [
                {{
                    "question": "<question text>",
                    "type": "<question type>",
                    "difficulty": "<difficulty level>"
                }},
                ...
            ]
        }}

        Important:
        1. Return ONLY valid JSON, no other text
        2. Ensure all fields are present for each question
        3. Use proper JSON formatting with double quotes
        4. Generate exactly {num_questions} questions
        5. Make questions specific to the resume content
        """

        completion = client_questions.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
            max_tokens=1024,
        )

        response_text = completion.choices[0].message.content.strip()
        
        # Try to parse the response as JSON
        try:
            questions_result = json.loads(response_text)
            
            # Validate the response format
            if "questions" not in questions_result:
                raise ValueError("Missing 'questions' field in response")
            
            # Ensure we have the correct number of questions
            if len(questions_result["questions"]) != num_questions:
                logger.warning(f"Expected {num_questions} questions, got {len(questions_result['questions'])}")
            
            # Validate each question has required fields
            for i, q in enumerate(questions_result["questions"]):
                required_fields = ["question", "type", "difficulty"]
                for field in required_fields:
                    if field not in q:
                        raise ValueError(f"Question {i+1} missing required field: {field}")
            
            return questions_result
            
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse AI response as JSON: {response_text}")
            # Return a default response if JSON parsing fails
            return {
                "questions": [
                    {
                        "question": "Error generating questions. Please try again.",
                        "type": "error",
                        "difficulty": "unknown"
                    }
                ]
            }
            
    except Exception as e:
        logger.error(f"Error in generate_questions: {str(e)}")
        return {
            "questions": [
                {
                    "question": f"Error: {str(e)}",
                    "type": "error",
                    "difficulty": "unknown"
                }
            ]
        }

@app.post("/api/improve")
async def improve_resume(
    resume: UploadFile = File(...),
    target_role: Optional[str] = Form(None),
    custom_areas: Optional[str] = Form(None)
):
    try:
        # Extract text from PDF
        resume_text = extract_text_from_pdf(resume)
        
        # Prepare improvement areas
        if target_role and target_role in ROLE_REQUIREMENTS:
            requirements = ROLE_REQUIREMENTS[target_role]
        elif custom_areas:
            requirements = custom_areas.split('\n')
        else:
            return {"error": "Please provide either a target role or custom areas for improvement"}
        
        prompt = f"""
        Based on this resume:
        {resume_text}

        And these requirements:
        {json.dumps(requirements, indent=2)}

        Provide improvement suggestions in this JSON format:
        {{
            "suggestions": [
                {{
                    "area": "<area for improvement>",
                    "suggestions": [
                        "<specific suggestion 1>",
                        "<specific suggestion 2>",
                        "<specific suggestion 3>"
                    ],
                    "example": "<example of improved content>"
                }},
                ...
            ]
        }}

        Return only valid JSON, no other text.
        """

        completion = client_improvement.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
            max_tokens=1024,
        )

        return json.loads(completion.choices[0].message.content)
    except Exception as e:
        return {"error": str(e)}

@app.post("/api/improved-resume")
async def get_improved_resume(
    resume: UploadFile = File(...),
    target_role: str = Form(...),
    highlight_skills: str = Form(...),
    custom_skills: Optional[str] = Form(None)
):
    try:
        # Extract text from PDF
        resume_text = extract_text_from_pdf(resume)
        
        # Parse skills to highlight
        skills = json.loads(highlight_skills)
        if custom_skills:
            skills.extend(custom_skills.split('\n'))
        
        prompt = f"""
        You are an expert resume writer and career coach. Your task is to create an improved version of this resume:

        Original Resume:
        {resume_text}

        Target Role: {target_role}
        Skills to Highlight: {', '.join(skills)}

        Create a significantly improved version that:
        1. Maintains all factual information but presents it more effectively
        2. Uses strong action verbs and quantifiable achievements
        3. Emphasizes experiences and skills relevant to {target_role}
        4. Highlights the specified skills: {', '.join(skills)}
        5. Uses ATS-friendly formatting and keywords
        6. Includes specific metrics and results where possible
        7. Organizes information in a clear, professional structure
        8. Adds relevant certifications or training if mentioned
        9. Uses industry-standard terminology
        10. Optimizes for both human readers and ATS systems

        Format the improved resume with clear sections:
        - Professional Summary
        - Skills
        - Professional Experience
        - Education
        - Certifications (if any)
        - Projects (if any)

        Return the improved resume text only, no other text or formatting.
        Make it significantly different from the original while maintaining accuracy.
        """

        completion = client_improved_resume.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
            max_tokens=2048,  # Increased token limit for longer responses
        )

        improved_text = completion.choices[0].message.content.strip()
        
        # Validate the response
        if not improved_text or improved_text == resume_text:
            return {
                "improved_resume": "Error: Failed to generate an improved version. Please try again."
            }
            
        return {"improved_resume": improved_text}
    except Exception as e:
        logger.error(f"Error in get_improved_resume: {str(e)}")
        return {
            "improved_resume": f"Error generating improved resume: {str(e)}"
        }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)