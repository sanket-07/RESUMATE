# Add these predefined email templates at the top of your file
ACCEPTANCE_EMAIL_TEMPLATE = """Dear {candidate_name},

We are pleased to inform you that your application for the position has been successful. Your qualifications and experience align well with our requirements, and we were particularly impressed with your background.

Next Steps:
1. Please confirm your availability for an interview by responding to this email
2. Prepare any relevant documents or portfolios
3. We will schedule a detailed interview discussion

We look forward to meeting you and discussing the role in more detail.

Best regards,
HR Team"""

REJECTION_EMAIL_TEMPLATE = """Dear {candidate_name},

Thank you for your interest in the position and for taking the time to submit your application.

After careful consideration of your profile, we regret to inform you that we have decided to move forward with other candidates whose qualifications more closely match our current requirements.

We encourage you to apply for future positions that align with your skills and experience. We will keep your application on file for any suitable openings.

We wish you success in your job search and future career endeavors.

Best regards,
HR Team"""

from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

@app.route('/api/generate-message', methods=['POST'])
def generate_message():
    try:
        action = request.form.get('action')
        candidates = json.loads(request.form.get('candidates', '[]'))
        
        if not action:
            return jsonify({'success': False, 'error': 'Missing required parameters'})

        # Use predefined templates instead of AI generation
        if action == 'accept':
            # For multiple candidates, use the first candidate's name or a generic greeting
            candidate_name = candidates[0]['name'] if candidates else "Candidate"
            generated_message = ACCEPTANCE_EMAIL_TEMPLATE.format(candidate_name=candidate_name)
        else:  # reject
            candidate_name = candidates[0]['name'] if candidates else "Candidate"
            generated_message = REJECTION_EMAIL_TEMPLATE.format(candidate_name=candidate_name)
        
        return jsonify({
            'success': True,
            'generated_message': generated_message
        })

    except Exception as e:
        print(f"Error generating message: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500 