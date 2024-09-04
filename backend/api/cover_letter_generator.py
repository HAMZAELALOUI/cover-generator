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

    Please create a well-structured cover letter that highlights the candidate's relevant skills and experience for the job. The cover letter should be written in {language}.
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
