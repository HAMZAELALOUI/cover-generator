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
    temperature=0.2,
    google_api_key=os.getenv("GEMINI_API_KEY"),
)

# Define the prompt template
job_analysis_template = PromptTemplate(
    input_variables=["job_description"],
    template="""
    Analyze the following job description and extract key information:

    Job Description:
    {job_description}

    Please extract and structure the following information:
    1. Job Title
    2. Company Name (if mentioned)
    3. Location (if mentioned)
    4. Employment Type (e.g., Full-time, Part-time, Contract)
    5. Required Skills
    6. Preferred Skills (if mentioned)
    7. Required Experience
    8. Education Requirements
    9. Key Responsibilities
    10. Salary Range (if mentioned)
    11. Benefits (if mentioned)
    12. Application Deadline (if mentioned)
    13. Recruiter's Name (if mentioned, look for phrases like "Contact [Name]" or "For inquiries, reach out to [Name]")
    14. Recruiter's Contact Information (if mentioned)
    15. Company Culture or Values (if mentioned)
    16. Application Instructions

    Return the information in a clean JSON format without any markdown formatting or code blocks. If any field is not found, set its value to null.
    """,
)

# Create the LangChain
job_analysis_chain = LLMChain(llm=llm, prompt=job_analysis_template)


def analyze_job_description(job_description):
    try:
        # Run the analysis
        result = job_analysis_chain.run(job_description=job_description)

        # Parse the result as JSON
        parsed_result = json.loads(result)

        # Return the formatted JSON string
        return json.dumps(parsed_result, indent=2)
    except json.JSONDecodeError as e:
        # If parsing fails, return a JSON string with an error message
        return json.dumps(
            {
                "error": f"Failed to parse job analysis result: {str(e)}",
                "raw_response": result,
            },
            indent=2,
        )
    except Exception as e:
        # Handle any other exceptions
        return json.dumps(
            {"error": f"An error occurred during job analysis: {str(e)}"}, indent=2
        )
