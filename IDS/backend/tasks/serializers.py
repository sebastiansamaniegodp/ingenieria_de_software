from rest_framework import serializers
from .models import Task
from accounts.serializers import UserSerializer
from patients.serializers import PatientSerializer


class TaskSerializer(serializers.ModelSerializer):
    assigned_to_name = serializers.SerializerMethodField()
    assigned_to_details = UserSerializer(source='assigned_to', read_only=True)
    patient_name = serializers.SerializerMethodField()
    patient_details = PatientSerializer(source='patient', read_only=True)

    class Meta:
        model = Task
        fields = [
            'id', 'title', 'description', 'priority', 'status',
            'assigned_to', 'assigned_to_name', 'assigned_to_details',
            'patient', 'patient_name', 'patient_details',
            'appointment', 'due_date', 'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']

    def get_assigned_to_name(self, obj):
        if obj.assigned_to.first_name or obj.assigned_to.last_name:
            return f"{obj.assigned_to.first_name} {obj.assigned_to.last_name}".strip()
        return obj.assigned_to.email

    def get_patient_name(self, obj):
        if obj.patient:
            return f"{obj.patient.first_name} {obj.patient.last_name}"
        return None

    def validate_assigned_to(self, value):
        """Validar que solo staff, enfermeras o admins puedan ser asignados"""
        if value.role not in ['STAFF', 'NURSE', 'ADMIN']:
            raise serializers.ValidationError(
                "Las tareas solo pueden asignarse a personal de staff, enfermería o administración."
            )
        return value
