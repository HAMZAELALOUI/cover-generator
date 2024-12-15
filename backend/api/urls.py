from django.urls import path
from .views import CVExtractorView, JobAnalyzerView, GenerateCoverLetterView, JobGapAnalyzerView, CVCrafterView, JobMatchFinderView

urlpatterns = [
    path("extract-cv/", CVExtractorView.as_view(), name="extract-cv"),
    path("analyze-job/", JobAnalyzerView.as_view(), name="analyze-job"),
    path(
        "generate-cover-letter/",
        GenerateCoverLetterView.as_view(),
        name="generate-cover-letter",
    ),
    path("analyze-gap/", JobGapAnalyzerView.as_view(), name="analyze-gap"),
    path("craft-cv/", CVCrafterView.as_view(), name="craft-cv"),
    path('find-matches/', JobMatchFinderView.as_view(), name='find-matches'),
]
