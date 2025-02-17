from django.urls import path
from . import views
from .views import AI
urlpatterns = [
    path("AI", AI.as_view(), name="AI")
]