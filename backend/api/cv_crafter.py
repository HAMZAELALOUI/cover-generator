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

cv_crafting_template = PromptTemplate(
    input_variables=["cv_info", "job_analysis"],
    template="""
    Based on the original CV and job description, create a tailored version of the CV that specifically targets this job opportunity.

    Original CV: {cv_info}
    Job Description: {job_analysis}

    Instructions:
    1. Analyze the job requirements carefully
    2. Restructure and rewrite the CV to highlight relevant experience
    3. Prioritize skills that match the job requirements
    4. Rewrite descriptions to use keywords from the job posting
    5. Focus on transferable skills where direct experience is missing

    Create a tailored CV in French that follows this exact structure:

    {{
        "personal_info": {{
            "name": "full name",
            "titre": "titre professionnel ciblé",
            "email": "email",
            "phone": "phone",
            "linkedin": "profile linkedin",
            "location": "location",
            "languages": {{
                "language": "level"
            }}
        }},
        "profil": "4-5 lignes décrivant votre profil en relation avec le poste",
        "competences": {{
            "techniques": ["compétences techniques pertinentes"],
            "frameworks": ["frameworks pertinents"],
            "bases_de_donnees": ["bases de données pertinentes"],
            "outils": ["outils pertinents"]
        }},
        "experience_professionnelle": [
            {{
                "poste": "titre du poste",
                "entreprise": "nom de l'entreprise",
                "periode": "période",
                "realisations": [
                    "réalisation 1 en lien avec le poste visé",
                    "réalisation 2 en lien avec le poste visé"
                ],
                "technologies": ["technologies utilisées pertinentes"]
            }}
        ],
        "formation": [
            {{
                "diplome": "nom du diplôme",
                "etablissement": "nom de l'établissement",
                "periode": "période",
                "details": ["détails pertinents pour le poste"]
            }}
        ],
        "projets": [
            {{
                "nom": "nom du projet",
                "description": "description ciblée",
                "technologies": ["technologies pertinentes"],
                "points_cles": ["points clés en lien avec le poste"]
            }}
        ]
    }}

    Important:
    - Rewrite all content to target this specific job
    - Use relevant keywords from the job description
    - Focus on achievements that demonstrate required skills
    - Highlight projects that show relevant experience
    - Adapt the professional title to match the job
    - Keep only the most relevant information
    """
)

cv_crafting_chain = LLMChain(llm=llm, prompt=cv_crafting_template)

def craft_tailored_cv(cv_info, job_analysis):
    try:
        # Run the CV crafting
        result = cv_crafting_chain.run(
            cv_info=cv_info,
            job_analysis=job_analysis
        )
        
        # Clean and parse the result
        cleaned_result = result.replace("```json", "").replace("```", "").strip()
        
        try:
            crafted_cv = json.loads(cleaned_result)
            return json.dumps({
                "success": True,
                "tailored_cv": crafted_cv,
                "message": "CV restructured and tailored for the target position"
            }, ensure_ascii=False, indent=2)
        except json.JSONDecodeError:
            return json.dumps({
                "success": False,
                "raw_content": cleaned_result,
                "message": "CV generated but needs formatting"
            }, ensure_ascii=False, indent=2)
    except Exception as e:
        return json.dumps({
            "error": f"An error occurred during CV crafting: {str(e)}"
        }, ensure_ascii=False, indent=2)