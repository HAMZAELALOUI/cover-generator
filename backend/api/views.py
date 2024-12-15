from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .cv_extractor import extract_cv_info
from .job_analyzer import analyze_job_description
import json
import os
from django.conf import settings
import logging
from .cover_letter_generator import generate_cover_letter
from .job_gap_analyzer import analyze_job_gap
from .cv_crafter import craft_tailored_cv
from .services.job_search_service import JobSearchService

logger = logging.getLogger(__name__)


class CVExtractorView(APIView):
    def post(self, request):
        if "file" not in request.FILES:
            return Response(
                {"error": "No file uploaded"}, status=status.HTTP_400_BAD_REQUEST
            )

        uploaded_file = request.FILES["file"]
        file_name = uploaded_file.name
        file_extension = file_name.split(".")[-1].lower()

        if file_extension not in ["pdf", "png", "jpg", "jpeg"]:
            return Response(
                {
                    "error": "Unsupported file format. Please upload a PDF or image file."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        file_path = os.path.join(settings.MEDIA_ROOT, file_name)

        os.makedirs(settings.MEDIA_ROOT, exist_ok=True)

        with open(file_path, "wb+") as destination:
            for chunk in uploaded_file.chunks():
                destination.write(chunk)

        try:
            cv_info = extract_cv_info(file_path)
            os.remove(file_path)  # Remove the file after processing

            # Print the raw response for debugging
            print("Raw API response:", cv_info)

            # Return the JSON string directly
            return Response(json.loads(cv_info), status=status.HTTP_200_OK)
        except json.JSONDecodeError as json_error:
            logger.error(f"JSON Decode Error: {str(json_error)}")
            return Response(
                {
                    "error": "Invalid JSON response from CV extractor",
                    "raw_response": cv_info,
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        except Exception as e:
            logger.error(f"Error in CV extraction: {str(e)}")
            if os.path.exists(file_path):
                os.remove(file_path)  # Ensure file is removed even if an error occurs
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class JobAnalyzerView(APIView):
    def post(self, request):
        job_description = request.data.get("job_description")
        if not job_description:
            return Response(
                {"error": "No job description provided"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            analysis_result = analyze_job_description(job_description)
            return Response(json.loads(analysis_result), status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class GenerateCoverLetterView(APIView):
    def post(self, request):
        cv_info = request.data.get("cv_info")
        job_analysis = request.data.get("job_analysis")
        language = request.data.get("language", "English")

        if not cv_info or not job_analysis:
            return Response(
                {"error": "CV info and job analysis are required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            cover_letter = generate_cover_letter(cv_info, job_analysis, language)
            return Response(json.loads(cover_letter), status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Error in cover letter generation: {str(e)}")
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class JobGapAnalyzerView(APIView):
    def post(self, request):
        cv_info = request.data.get("cv_info")
        job_analysis = request.data.get("job_analysis")

        if not cv_info or not job_analysis:
            return Response(
                {"error": "CV info and job analysis are required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            gap_analysis = analyze_job_gap(cv_info, job_analysis)
            return Response(json.loads(gap_analysis), status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Error in gap analysis: {str(e)}")
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class CVCrafterView(APIView):
    def post(self, request):
        original_cv = request.data.get("original_cv")
        job_description = request.data.get("job_description")

        if not original_cv or not job_description:
            return Response(
                {"error": "Original CV and job description are required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            crafted_cv = craft_tailored_cv(
                cv_info=original_cv,
                job_analysis=job_description
            )
            return Response(json.loads(crafted_cv), status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Error in CV crafting: {str(e)}")
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class JobMatchFinderView(APIView):
    def post(self, request):
        try:
            cv_data = request.data
            if not cv_data:
                return Response(
                    {"error": "CV data is required"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Validate required fields
            required_fields = ["Name", "Skills", "Location"]
            missing_fields = [field for field in required_fields if field not in cv_data]
            if missing_fields:
                return Response(
                    {"error": f"Missing required fields: {', '.join(missing_fields)}"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Initialize job search service
            job_service = JobSearchService()
            
            # Search for matching jobs
            matching_jobs = job_service.search_jobs(cv_data)
            
            return Response({
                "success": True,
                "candidate_name": cv_data.get("Name"),
                "matches": matching_jobs,
                "match_count": len(matching_jobs),
                "location": cv_data.get("Location")
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response(
                {"error": f"An error occurred while finding job matches: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


