from django.contrib import admin
from .models import Appointment


@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = ['id', 'patient', 'doctor', 'date', 'time', 'appointment_type', 'status', 'room', 'created_at']
    list_filter = ['status', 'appointment_type', 'date', 'created_at']
    search_fields = ['patient__first_name', 'patient__last_name', 'doctor__first_name', 'doctor__last_name', 'room']
    ordering = ['date', 'time']
    readonly_fields = ['created_at', 'updated_at']
    autocomplete_fields = ['patient', 'doctor']
