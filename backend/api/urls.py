from django.urls import path
from .views import CVExtractorView, JobAnalyzerView

urlpatterns = [
    path("extract-cv/", CVExtractorView.as_view(), name="extract-cv"),
    path("analyze-job/", JobAnalyzerView.as_view(), name="analyze-job"),
]
