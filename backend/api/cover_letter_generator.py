import google.generativeai as genai
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
from langchain_google_genai import ChatGoogleGenerativeAI
from django.conf import settings
import json
import os

# Configure Gemini API
genai.configure(api_key=settings.GEMINI_API_KEY)

# Initialize Gemini model through LangChain
llm = ChatGoogleGenerativeAI(
    model="gemini-1.5-flash",
    temperature=0.7,
    google_api_key=os.getenv("GEMINI_API_KEY"),
)

# Define the prompt template
cover_letter_template = PromptTemplate(
    input_variables=["cv_info", "job_analysis", "language"],
    template="""
    Generate a professional cover letter based on the following information:

    CV Information:
    {cv_info}

    Job Analysis:
    {job_analysis}

    Language: {language}

    Please create a compelling cover letter following these specific guidelines:

    1. Format:
       - Professional business letter format
       - Current date at the top
       - Proper salutation (if recruiter name is known, use it; otherwise, use "Dear Hiring Manager")
       - 3-4 concise paragraphs
       - Professional closing

    2. First Paragraph:
       - Strong opening hook
       - Mention the specific position you're applying for
       - Brief introduction about yourself
       - Show enthusiasm for the role and company

    3. Second Paragraph:
       - Focus on matching your skills with job requirements
       - Highlight relevant projects and experiences
       - Use specific examples and achievements
       - Address any potential gaps or mismatches proactively
       - Emphasize transferable skills

    4. Third Paragraph:
       - Explain why you're interested in this specific company
       - Show knowledge of the company/industry
       - Demonstrate cultural fit
       - Mention relevant certifications or continuous learning

    5. Closing Paragraph:
       - Express enthusiasm for an interview
       - Include your contact information
       - Thank them for their consideration
       - Professional signature

    Style Guidelines:
    - Tone: Professional yet enthusiastic
    - Length: 300-400 words
    - Format: Clear paragraphs with proper spacing
    - Focus on achievements and potential value
    - Be specific and quantify achievements where possible
    - Address any experience gaps positively
    - Highlight relevant technical skills and projects

    The cover letter should be written in {language} and maintain a professional, confident tone while showing genuine interest in the position.
    
    Important: If the candidate's experience doesn't exactly match the job requirements, focus on potential, relevant projects, and transferable skills.
    """,
)

# Create the LangChain
cover_letter_chain = LLMChain(llm=llm, prompt=cover_letter_template)


def generate_cover_letter(cv_info, job_analysis, language):
    try:
        # Run the cover letter generation
        result = cover_letter_chain.run(
            cv_info=json.dumps(cv_info),
            job_analysis=json.dumps(job_analysis),
            language=language,
        )

        # Return the generated cover letter
        return json.dumps({"cover_letter": result})
    except Exception as e:
        # Handle any exceptions
        return json.dumps(
            {"error": f"An error occurred during cover letter generation: {str(e)}"}
        )
