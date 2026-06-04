from django.db import models

class Assessment(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class Question(models.Model):
    assessment = models.ForeignKey(Assessment, on_delete=models.CASCADE, related_name='questions')
    text = models.TextField()
    order = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.assessment.title} - Q{self.order}: {self.text[:30]}"

class Option(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='options')
    text = models.CharField(max_length=255)
    category_tag = models.CharField(max_length=100)  
    score = models.IntegerField(default=1)  

    def __str__(self):
        return f"Opt for Q({self.question.id}): {self.text}"