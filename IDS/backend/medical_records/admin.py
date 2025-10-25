from django.contrib import admin
from .models import MedicalRecord


@admin.register(MedicalRecord)
class MedicalRecordAdmin(admin.ModelAdmin):
    list_display = ['id', 'patient', 'doctor', 'record_type', 'title', 'status', 'date', 'created_at']
    list_filter = ['status', 'record_type', 'date', 'created_at']
    search_fields = ['title', 'description', 'patient__first_name', 'patient__last_name']
    ordering = ['-date', '-created_at']
    readonly_fields = ['created_at', 'updated_at']
    autocomplete_fields = ['patient', 'doctor']
