import google.generativeai as genai
from typing import Dict, List
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
from langchain_google_genai import ChatGoogleGenerativeAI
from django.conf import settings
import json
import requests
from urllib.parse import quote

class JobSearchService:
    def __init__(self):
        genai.configure(api_key=settings.GEMINI_API_KEY)
        self.llm = ChatGoogleGenerativeAI(
            model="gemini-1.5-flash",
            temperature=0.3,
            google_api_key=settings.GEMINI_API_KEY,
        )
        self.rapid_api_key = settings.RAPID_API_KEY
        
        self.analysis_template = """
        You are a job search expert. Analyze this CV and provide specific job recommendations.

        CV Details:
        {cv_data}

        Based on this CV, provide a detailed analysis in the following JSON format only:
        {{
            "primary_roles": ["List 2-3 main job roles that best match their profile"],
            "alternative_titles": ["List 2-3 alternative job titles they could apply for"],
            "key_skills": ["List their top 5 most relevant skills"],
            "industry_focus": ["List 1-2 main industries they should target"],
            "experience_level": "entry/mid/senior",
            "search_keywords": ["List 5 specific search terms for job hunting"]
        }}

        Ensure the response is valid JSON and matches their actual experience and skills.
        """

    def _analyze_cv(self, cv_data: Dict) -> Dict:
        """Use Gemini to analyze CV and suggest job search strategy"""
        try:
            # Convert CV data to a more readable format for analysis
            cv_text = f"""
            Name: {cv_data.get('Name', '')}
            Location: {cv_data.get('Location', '')}
            Profile: {cv_data.get('Profile Summary', '')}
            
            Skills:
            {json.dumps(cv_data.get('Skills', {}), indent=2)}
            
            Experience:
            {json.dumps(cv_data.get('Work Experience', []), indent=2)}
            
            Education:
            {json.dumps(cv_data.get('Education', []), indent=2)}
            """

            response = self.llm.predict(
                self.analysis_template.format(cv_data=cv_text)
            )
            
            # Extract JSON from response
            try:
                # Find JSON content between curly braces
                start = response.find('{')
                end = response.rfind('}') + 1
                json_str = response[start:end]
                return json.loads(json_str)
            except json.JSONDecodeError as e:
                print(f"JSON parsing error: {str(e)}")
                print(f"Response was: {response}")
                return self._generate_fallback_analysis(cv_data)
                
        except Exception as e:
            print(f"Error in CV analysis: {str(e)}")
            return self._generate_fallback_analysis(cv_data)

    def _generate_fallback_analysis(self, cv_data: Dict) -> Dict:
        """Generate basic analysis when AI fails"""
        # Extract skills
        skills = []
        if 'Skills' in cv_data:
            for category, skill_list in cv_data['Skills'].items():
                skills.extend(skill_list)

        # Determine experience level
        experience_level = "entry"
        if "Work Experience" in cv_data and len(cv_data["Work Experience"]) > 2:
            experience_level = "mid"

        # Get job title from most recent experience
        primary_role = "Professional"
        if "Work Experience" in cv_data and cv_data["Work Experience"]:
            primary_role = cv_data["Work Experience"][0].get("Title", "Professional")

        return {
            "primary_roles": [primary_role],
            "alternative_titles": [primary_role],
            "key_skills": skills[:5],
            "industry_focus": ["Technology"],
            "experience_level": experience_level,
            "search_keywords": skills[:5]
        }

    def _fetch_jobs_from_rapid_api(self, query: str, location: str) -> List[Dict]:
        """Fetch jobs using RapidAPI's JSearch"""
        url = "https://jsearch.p.rapidapi.com/search"
        
        headers = {
            "X-RapidAPI-Key": self.rapid_api_key,
            "X-RapidAPI-Host": "jsearch.p.rapidapi.com"
        }
        
        querystring = {
            "query": f"{query} in {location}",
            "page": "1",
            "num_pages": "1"
        }
        
        try:
            response = requests.get(url, headers=headers, params=querystring)
            response.raise_for_status()
            data = response.json()
            return data.get("data", [])
        except Exception as e:
            print(f"Error fetching jobs from RapidAPI: {str(e)}")
            return []

    def _generate_job_search_links(self, job_titles: List[str], location: str = None) -> List[Dict]:
        """Generate job search links for various platforms"""
        job_boards = {
            "LinkedIn": "https://www.linkedin.com/jobs/search?keywords={}&location={}",
            "Indeed": "https://www.indeed.com/jobs?q={}&l={}",
            "Glassdoor": "https://www.glassdoor.com/Job/jobs.htm?sc.keyword={}&locT=N&locId={}",
            "RemoteOK": "https://remoteok.com/remote-{}-jobs",
            "WeWorkRemotely": "https://weworkremotely.com/remote-jobs/search?term={}",
            "AngelList": "https://angel.co/jobs?q={}"
        }

        search_results = []
        locations = ["Remote", "Worldwide", "Europe", "United States", "Morocco"] if not location else [location]

        for title in job_titles:
            # Clean and format the job title
            clean_title = title.replace("(", "").replace(")", "").replace("/", "-").strip()
            encoded_title = quote(clean_title)
            
            board_links = {}
            
            # Generate links for each job board
            for board, url_template in job_boards.items():
                if "Remote" in board or "WeWork" in board:
                    # For remote-specific job boards
                    board_links[board] = url_template.format(encoded_title.lower())
                else:
                    # For location-based job boards
                    for loc in locations:
                        encoded_loc = quote(loc)
                        if board not in board_links:
                            board_links[board] = []
                        board_links[board].append({
                            "location": loc,
                            "url": url_template.format(encoded_title, encoded_loc)
                        })

            search_results.append({
                "job_title": clean_title,
                "search_links": board_links
            })

        return search_results

    def search_jobs(self, cv_data: Dict) -> Dict:
        try:
            # First, analyze the CV using Gemini
            analysis = self._analyze_cv(cv_data)
            if not analysis:
                return {
                    "success": False,
                    "error": "Failed to analyze CV"
                }

            location = cv_data.get("Location", "Morocco")
            
            # Collect all job titles from analysis
            all_job_titles = (
                analysis.get("primary_roles", []) + 
                analysis.get("alternative_titles", [])
            )

            # Generate search links for all job titles
            job_search_links = self._generate_job_search_links(all_job_titles, location)

            # Generate skill-based search queries
            key_skills = analysis.get("key_skills", [])
            skill_combinations = [
                f"{title} {' '.join(key_skills[:2])}" 
                for title in all_job_titles
            ]

            # Fetch actual job listings from RapidAPI
            all_jobs = []
            for query in skill_combinations[:3]:  # Limit to top 3 combinations
                jobs = self._fetch_jobs_from_rapid_api(query, "Worldwide")
                all_jobs.extend(jobs)

            # Process and format the jobs
            processed_jobs = []
            seen_jobs = set()

            for job in all_jobs:
                job_id = f"{job.get('job_title', '')}-{job.get('employer_name', '')}"
                
                if job_id not in seen_jobs:
                    seen_jobs.add(job_id)
                    processed_jobs.append({
                        "title": job.get("job_title"),
                        "company": job.get("employer_name"),
                        "location": job.get("job_city", "Remote"),
                        "country": job.get("job_country"),
                        "type": job.get("job_employment_type", "full-time"),
                        "description": job.get("job_description"),
                        "apply_link": job.get("job_apply_link"),
                        "publisher": job.get("job_publisher"),
                        "posting_date": job.get("job_posted_at_datetime_utc")
                    })

            return {
                "success": True,
                "candidate_name": cv_data.get("Name"),
                "location": location,
                "cv_analysis": analysis,
                "job_search_resources": {
                    "search_links_by_title": job_search_links,
                    "remote_job_boards": [
                        {
                            "name": "RemoteOK",
                            "url": "https://remoteok.com/"
                        },
                        {
                            "name": "WeWorkRemotely",
                            "url": "https://weworkremotely.com/"
                        },
                        {
                            "name": "AngelList",
                            "url": "https://angel.co/jobs"
                        }
                    ],
                    "worldwide_opportunities": processed_jobs
                },
                "match_count": len(processed_jobs)
            }

        except Exception as e:
            print(f"Error in job search: {str(e)}")
            return {
                "success": False,
                "error": str(e)
            }
