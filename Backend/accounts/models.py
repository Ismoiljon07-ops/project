from django.db import models
from django.contrib.auth.models import User

ROLE_CHOICES = (
    ('student', 'Student'),
    ('admin', 'Admin'),
)

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    role = models.CharField(db_index=True, max_length=10, choices=ROLE_CHOICES, default='student')
    education_background = models.TextField(blank=True, null=True)
    interests = models.TextField(blank=True, null=True)
    strengths = models.TextField(blank=True, null=True)
    career_goals = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.user.username} - {self.role}"