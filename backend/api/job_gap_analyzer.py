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
    temperature=0.3,
    google_api_key=os.getenv("GEMINI_API_KEY"),
)

gap_analysis_template = PromptTemplate(
    input_variables=["cv_info", "job_requirements"],
    template="""
    Analyze the gap between the candidate's profile and job requirements, and provide detailed recommendations:

    Candidate Profile:
    {cv_info}

    Job Requirements:
    {job_requirements}

    Provide a comprehensive analysis focusing on:

    1. Skills Assessment:
    - Missing required skills
    - Skills that need improvement
    - Current skill strengths
    - Technical skill gaps
    - Soft skill gaps

    2. Experience Evaluation:
    - Years of experience gap
    - Domain experience requirements
    - Project experience alignment
    - Leadership/management experience if required

    3. Education & Certification Analysis:
    - Education requirement gaps
    - Required certifications missing
    - Recommended additional qualifications

    4. Detailed Learning Path:
    - Specific courses to take
    - Recommended learning resources
    - Estimated time investment
    - Priority order of skills to acquire

    5. Practical Development Steps:
    - Recommended practice projects
    - Industry-specific experience building
    - Portfolio development suggestions
    - Networking recommendations

    Please provide actionable insights and specific recommendations that will help the candidate bridge these gaps effectively.

    Format the response as a clear, structured analysis with specific, actionable items in each category.
    """
)

gap_analysis_chain = LLMChain(llm=llm, prompt=gap_analysis_template)

def analyze_job_gap(cv_info, job_requirements):
    try:
        # Run the analysis
        result = gap_analysis_chain.run(
            cv_info=json.dumps(cv_info),
            job_requirements=json.dumps(job_requirements)
        )
        
        # Return the raw analysis without trying to parse it as JSON
        return json.dumps({
            "gap_analysis": result.strip()
        })
    except Exception as e:
        return json.dumps({
            "error": f"An error occurred during gap analysis: {str(e)}"
        }) 