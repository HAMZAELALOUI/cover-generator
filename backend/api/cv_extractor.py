import os
import sys
import google.generativeai as genai
from django.conf import settings
from PyPDF2 import PdfReader
from PIL import Image
import pytesseract
import io
import json
import re

print("Python executable:", sys.executable)

genai.configure(api_key=settings.GEMINI_API_KEY)


def extract_text_from_image(image):
    return pytesseract.image_to_string(image)


def extract_from_pdf(file_path):
    try:
        reader = PdfReader(file_path)
        text = ""
        for page in reader.pages:
            text += page.extract_text()
        return text
    except Exception as e:
        print(f"Error in extract_from_pdf: {str(e)}")
        raise


def extract_from_image(file_path):
    with Image.open(file_path) as img:
        return extract_text_from_image(img)


def extract_cv_info(file_path):
    file_extension = file_path.split(".")[-1].lower()

    if file_extension == "pdf":
        text = extract_from_pdf(file_path)
    elif file_extension in ["png", "jpg", "jpeg"]:
        text = extract_from_image(file_path)
    else:
        with open(file_path, "r") as file:
            text = file.read()

    model = genai.GenerativeModel("gemini-1.5-pro")
    prompt = f"""
    Extract the following information from the CV text below:
    - Name
    - Email
    - Phone
    - LinkedIn
    - Location
    - Languages (with proficiency levels)
    - Profile Summary
    - Skills (categorized if possible)
    - Education (including institution, degree, and dates)
    - Work Experience (including company, title, dates, and description)
    - Academic Projects (including project name, technologies used, and description)
    - Certifications
    - Soft Skills
    - Interests

    CV Text:
    {text}

    Return the information in a clean JSON format without any markdown formatting or code blocks.
    """
    response = model.generate_content(prompt)

    # Print the raw response for debugging
    print("Raw Gemini API response:", response.text)

    # Remove markdown code blocks if present
    clean_response = re.sub(r"```json\n|\n```", "", response.text)

    try:
        # Try to parse the cleaned response as JSON
        json_data = json.loads(clean_response)
        return json.dumps(json_data, indent=2)  # Return a formatted JSON string
    except json.JSONDecodeError as e:
        # If parsing fails, return a JSON string with an error message
        return json.dumps(
            {
                "error": f"Failed to parse Gemini API response: {str(e)}",
                "raw_response": clean_response,
            },
            indent=2,
        )
