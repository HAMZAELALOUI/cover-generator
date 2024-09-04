from django.urls import path
from .views import CVExtractorView, JobAnalyzerView, GenerateCoverLetterView

urlpatterns = [
    path("extract-cv/", CVExtractorView.as_view(), name="extract-cv"),
    path("analyze-job/", JobAnalyzerView.as_view(), name="analyze-job"),
    path(
        "generate-cover-letter/",
        GenerateCoverLetterView.as_view(),
        name="generate-cover-letter",
    ),
]
