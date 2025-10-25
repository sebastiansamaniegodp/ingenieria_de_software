from rest_framework import serializers
from .models import MedicalRecord
from patients.serializers import PatientSerializer
from accounts.serializers import UserSerializer


class MedicalRecordSerializer(serializers.ModelSerializer):
    patient_name = serializers.SerializerMethodField()
    doctor_name = serializers.SerializerMethodField()
    patient_details = PatientSerializer(source='patient', read_only=True)
    doctor_details = UserSerializer(source='doctor', read_only=True)

    class Meta:
        model = MedicalRecord
        fields = [
            'id', 'patient', 'patient_name', 'patient_details',
            'doctor', 'doctor_name', 'doctor_details',
            'record_type', 'title', 'description', 'status', 'date',
            'attachments', 'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']

    def get_patient_name(self, obj):
        return f"{obj.patient.first_name} {obj.patient.last_name}"

    def get_doctor_name(self, obj):
        if obj.doctor.first_name or obj.doctor.last_name:
            return f"{obj.doctor.first_name} {obj.doctor.last_name}".strip()
        return obj.doctor.email

    def validate_title(self, value):
        """Validar que el título no esté vacío"""
        if not value or not value.strip():
            raise serializers.ValidationError("El título no puede estar vacío.")
        return value.strip()

    def validate_description(self, value):
        """Validar que la descripción no esté vacía"""
        if not value or not value.strip():
            raise serializers.ValidationError("La descripción no puede estar vacía.")
        return value.strip()
