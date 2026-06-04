from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from accounts.models import Profile

@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    username = request.data.get('username')
    password = request.data.get('password')
    email = request.data.get('email', '')

    if not username or not password:
        return Response({'error': 'Username and password are required'}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(username=username).exists():
        return Response({'error': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)

    user = User(username=username, email=email)
    user.set_password(password)
    user.save()
    
    # Automatically create the profile linked to the new user
    Profile.objects.get_or_create(user=user)
    
    refresh = RefreshToken.for_user(user)
    
    return Response({
        'message': 'User registered successfully',
        'refresh': str(refresh),
        'access': str(refresh.access_token),
        'username': user.username
    }, status=status.HTTP_201_CREATED)

@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def user_profile_api(request):
    profile, created = Profile.objects.get_or_create(user=request.user)

    if request.method == 'GET':
        return Response({
            'username': request.user.username,
            'email': request.user.email,
            'education_background': profile.education_background,
            'interests': profile.interests,
            'strengths': profile.strengths,
            'career_goals': profile.career_goals
        }, status=status.HTTP_200_OK)

    elif request.method == 'PUT':
        profile.education_background = request.data.get('education_background', profile.education_background)
        profile.interests = request.data.get('interests', profile.interests)
        profile.strengths = request.data.get('strengths', profile.strengths)
        profile.career_goals = request.data.get('career_goals', profile.career_goals)
        profile.save()
        
        email = request.data.get('email')
        if email:
            request.user.email = email
            request.user.save()

        return Response({'message': 'Profile updated successfully'}, status=status.HTTP_200_OK)