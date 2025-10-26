from django.contrib import admin
from .models import VitalSign


@admin.register(VitalSign)
class VitalSignAdmin(admin.ModelAdmin):
    list_display = ['patient', 'temperature', 'blood_pressure', 'heart_rate',
                    'oxygen_saturation', 'recorded_by', 'recorded_at']
    list_filter = ['recorded_at', 'recorded_by', 'created_at']
    search_fields = ['patient__first_name', 'patient__last_name', 'notes']
    date_hierarchy = 'recorded_at'
    ordering = ['-recorded_at']
    readonly_fields = ['created_at']
