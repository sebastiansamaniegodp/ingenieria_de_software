from rest_framework import serializers
from .models import VitalSign
from patients.serializers import PatientSerializer
from accounts.serializers import UserSerializer


class VitalSignSerializer(serializers.ModelSerializer):
    patient_name = serializers.SerializerMethodField()
    patient_details = PatientSerializer(source='patient', read_only=True)
    recorded_by_name = serializers.SerializerMethodField()
    recorded_by_details = UserSerializer(source='recorded_by', read_only=True)

    class Meta:
        model = VitalSign
        fields = [
            'id', 'patient', 'patient_name', 'patient_details',
            'temperature', 'blood_pressure', 'heart_rate',
            'respiratory_rate', 'oxygen_saturation',
            'recorded_by', 'recorded_by_name', 'recorded_by_details',
            'recorded_at', 'notes', 'created_at'
        ]
        read_only_fields = ['created_at']

    def get_patient_name(self, obj):
        return f"{obj.patient.first_name} {obj.patient.last_name}"

    def get_recorded_by_name(self, obj):
        if obj.recorded_by:
            if obj.recorded_by.first_name or obj.recorded_by.last_name:
                return f"{obj.recorded_by.first_name} {obj.recorded_by.last_name}".strip()
            return obj.recorded_by.email
        return None

    def validate_recorded_by(self, value):
        """Validar que solo enfermeras, doctores o staff puedan registrar signos vitales"""
        if value and value.role not in ['NURSE', 'DOCTOR', 'STAFF']:
            raise serializers.ValidationError(
                "Solo enfermeras, doctores o personal de staff pueden registrar signos vitales."
            )
        return value

    def validate_temperature(self, value):
        """Validar rango razonable de temperatura"""
        if value and (value < 30 or value > 45):
            raise serializers.ValidationError(
                "La temperatura debe estar entre 30°C y 45°C."
            )
        return value

    def validate_heart_rate(self, value):
        """Validar rango razonable de frecuencia cardíaca"""
        if value and (value < 20 or value > 300):
            raise serializers.ValidationError(
                "La frecuencia cardíaca debe estar entre 20 y 300 lpm."
            )
        return value

    def validate_oxygen_saturation(self, value):
        """Validar rango de saturación de oxígeno"""
        if value and (value < 0 or value > 100):
            raise serializers.ValidationError(
                "La saturación de oxígeno debe estar entre 0% y 100%."
            )
        return value
