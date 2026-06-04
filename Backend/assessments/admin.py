from django.contrib import admin
from .models import Assessment, Question, Option

class OptionInline(admin.TabularInline):
    model = Option
    extra = 4  

class QuestionAdmin(admin.ModelAdmin):
    inlines = [OptionInline]
    list_display = ['text', 'assessment', 'order']
    list_filter = ['assessment']

admin.site.register(Assessment)
admin.site.register(Question, QuestionAdmin)
admin.site.register(Option)