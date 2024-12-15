import google.generativeai as genai
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
from langchain_google_genai import ChatGoogleGenerativeAI
from django.conf import settings
import json
import os
import requests
from datetime import datetime

# Configure Gemini API
genai.configure(api_key=settings.GEMINI_API_KEY)

# Initialize Gemini model through LangChain
llm = ChatGoogleGenerativeAI(
    model="gemini-1.5-flash",
    temperature=0.3,
    google_api_key=os.getenv("GEMINI_API_KEY"),
)

def fetch_jobs(keywords, location=None, page=1):
    """Fetch jobs from RapidAPI Jobs API"""
    url = "https://jsearch.p.rapidapi.com/search"
    
    query_params = {
        "query": keywords,
        "page": str(page),
        "num_pages": "1"
    }
    if location:
        query_params["location"] = location

    headers = {
        "X-RapidAPI-Key": os.getenv("RAPID_API_KEY"),
        "X-RapidAPI-Host": "jsearch.p.rapidapi.com"
    }

    try:
        response = requests.get(url, headers=headers, params=query_params)
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        print(f"Error fetching jobs: {e}")
        return None

def extract_skills_from_cv(cv_info):
    """Extract all skills from CV"""
    skills = set()
    if 'skills' in cv_info:
        for skill_type in cv_info['skills'].values():
            if isinstance(skill_type, list):
                skills.update([s.lower() for s in skill_type])
    return list(skills)

job_matching_template = PromptTemplate(
    input_variables=["cv_info", "job_listings"],
    template="""
    Analyze the CV and the fetched job listings to find the best matches.

    CV Information:
    {cv_info}

    Available Jobs:
    {job_listings}

    Provide a detailed analysis in the following JSON format:
    {{
        "matched_jobs": [
            {{
                "job_title": "title",
                "company": "company name",
                "location": "location",
                "match_score": "percentage",
                "job_link": "application link",
                "salary_range": "if available",
                "match_analysis": {{
                    "matching_skills": ["matching skills"],
                    "missing_skills": ["skills to develop"],
                    "experience_fit": "analysis of experience match",
                    "location_fit": "location analysis",
                    "application_recommendations": [
                        "specific recommendations for this job"
                    ]
                }}
            }}
        ],
        "overall_recommendations": {{
            "best_matches": ["top 3 job titles"],
            "skills_to_develop": ["priority skills to learn"],
            "career_path_suggestions": ["suggested paths"],
            "job_search_recommendations": ["search strategy tips"]
        }}
    }}
    """
)

job_matching_chain = LLMChain(llm=llm, prompt=job_matching_template)

def find_matching_jobs(cv_info):
    try:
        # Extract skills from CV
        skills = extract_skills_from_cv(cv_info)
        
        # Create search keywords from skills and experience
        keywords = " OR ".join(skills[:5])  # Use top 5 skills
        location = cv_info.get('personal_info', {}).get('location', '')
        
        # Fetch jobs from API
        jobs_data = fetch_jobs(keywords, location)
        
        if not jobs_data or 'data' not in jobs_data:
            return json.dumps({
                "error": "No jobs found or API error"
            })

        # Format jobs for analysis
        job_listings = jobs_data['data']
        
        # Run the job matching analysis
        result = job_matching_chain.run(
            cv_info=cv_info,
            job_listings=json.dumps(job_listings)
        )
        
        # Clean and parse the result
        cleaned_result = result.replace("```json", "").replace("```", "").strip()
        
        try:
            matches = json.loads(cleaned_result)
            return json.dumps({
                "success": True,
                "timestamp": datetime.now().isoformat(),
                "total_jobs_found": len(job_listings),
                "matches": matches,
                "message": "Job matches found and analyzed"
            }, ensure_ascii=False, indent=2)
        except json.JSONDecodeError:
            return json.dumps({
                "success": False,
                "raw_content": cleaned_result,
                "message": "Matches generated but need formatting"
            }, ensure_ascii=False, indent=2)
    except Exception as e:
        return json.dumps({
            "error": f"An error occurred during job matching: {str(e)}"
        }, ensure_ascii=False, indent=2) 