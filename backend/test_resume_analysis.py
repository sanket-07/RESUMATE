import requests
import os

def test_resume_analysis():
    # Test data
    job_description = """
    Software Engineer Position
    Requirements:
    - Strong programming skills in Python, JavaScript, and React
    - Experience with web development and REST APIs
    - Knowledge of machine learning and data analysis
    - Good problem-solving abilities
    - Team player with excellent communication skills
    """

    # Test file paths
    test_files = [
        "test_resumes/resume1.pdf",
        "test_resumes/resume2.pdf",
        "test_resumes/resume3.pdf"
    ]

    # Create test directory if it doesn't exist
    os.makedirs("test_resumes", exist_ok=True)

    # Test 1: Test text extraction
    print("\nTest 1: Testing text extraction")
    for file_path in test_files:
        if os.path.exists(file_path):
            with open(file_path, 'rb') as f:
                files = {'resume_file': f}
                response = requests.post('http://localhost:5000/api/test-extraction', files=files)
                print(f"\nResults for {file_path}:")
                print(response.json())

    # Test 2: Test similarity calculation
    print("\nTest 2: Testing similarity calculation")
    test_texts = [
        "I am a software engineer with 5 years of experience in Python and JavaScript",
        "Experienced in web development and machine learning",
        "Strong programming skills and problem-solving abilities"
    ]

    for i, text in enumerate(test_texts):
        data = {
            'text1': job_description,
            'text2': text
        }
        response = requests.post('http://localhost:5000/api/test-similarity', data=data)
        print(f"\nSimilarity with text {i+1}:")
        print(response.json())

    # Test 3: Test full analysis
    print("\nTest 3: Testing full analysis")
    if all(os.path.exists(f) for f in test_files):
        files = [('resume_files', open(f, 'rb')) for f in test_files]
        data = {
            'job_description': job_description,
            'threshold': '50'
        }
        response = requests.post('http://localhost:5000/api/analyze', files=files, data=data)
        print("\nFull analysis results:")
        print(response.json())

def test_resume_improvement():
    # Test data
    test_files = [
        'test_resumes/resume1.pdf',
        'test_resumes/resume2.pdf'
    ]

    if all(os.path.exists(f) for f in test_files):
        # Test case 1: Valid target role
        files = [('resume', open(test_files[0], 'rb'))]
        data = {
            'target_role': 'Full Stack Developer'
        }
        response = requests.post('http://localhost:8001/api/improve', files=files, data=data)
        print("\nTest Case 1 - Valid target role:")
        print(response.json())

        # Test case 2: Invalid target role
        data = {
            'target_role': 'Invalid Role'
        }
        response = requests.post('http://localhost:8001/api/improve', files=files, data=data)
        print("\nTest Case 2 - Invalid target role:")
        print(response.json())

        # Test case 3: Custom areas for improvement
        data = {
            'custom_areas': 'Technical Skills\nProject Experience\nCommunication'
        }
        response = requests.post('http://localhost:8001/api/improve', files=files, data=data)
        print("\nTest Case 3 - Custom areas:")
        print(response.json())

        # Test case 4: Missing resume
        data = {
            'target_role': 'Full Stack Developer'
        }
        response = requests.post('http://localhost:8001/api/improve', data=data)
        print("\nTest Case 4 - Missing resume:")
        print(response.json())

        # Test case 5: Missing both target role and custom areas
        response = requests.post('http://localhost:8001/api/improve', files=files)
        print("\nTest Case 5 - Missing both target role and custom areas:")
        print(response.json())

if __name__ == '__main__':
    test_resume_analysis()
    test_resume_improvement() 