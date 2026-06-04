from rest_framework import generics
from rest_framework.permissions import AllowAny
from .models import Assessment
from .serializers import AssessmentSerializer

class AssessmentListView(generics.ListAPIView):
    queryset = Assessment.objects.all()
    serializer_class = AssessmentSerializer
    permission_classes = [AllowAny]