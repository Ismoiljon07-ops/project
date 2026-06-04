from django.urls import path
from .views import AssessmentListView

urlpatterns = [
    path('', AssessmentListView.as_view(), name='assessment-list'),
]