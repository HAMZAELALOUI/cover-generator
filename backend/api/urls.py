from django.urls import path
from .views import CVExtractorView

urlpatterns = [
    path("extract-cv/", CVExtractorView.as_view(), name="extract-cv"),
]
