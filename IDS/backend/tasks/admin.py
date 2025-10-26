from django.contrib import admin
from .models import Task


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ['title', 'priority', 'status', 'assigned_to', 'patient', 'due_date', 'created_at']
    list_filter = ['status', 'priority', 'assigned_to', 'created_at']
    search_fields = ['title', 'description', 'assigned_to__first_name', 'assigned_to__last_name']
    date_hierarchy = 'created_at'
    ordering = ['-priority', 'due_date']
