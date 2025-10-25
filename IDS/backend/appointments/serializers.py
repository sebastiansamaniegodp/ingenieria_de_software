from rest_framework import serializers
from .models import Appointment
from patients.serializers import PatientSerializer
from accounts.serializers import UserSerializer


class AppointmentSerializer(serializers.ModelSerializer):
    patient_name = serializers.SerializerMethodField()
    doctor_name = serializers.SerializerMethodField()
    patient_details = PatientSerializer(source='patient', read_only=True)
    doctor_details = UserSerializer(source='doctor', read_only=True)

    class Meta:
        model = Appointment
        fields = [
            'id', 'patient', 'patient_name', 'patient_details',
            'doctor', 'doctor_name', 'doctor_details',
            'date', 'time', 'appointment_type', 'status', 'room', 'notes',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']

    def get_patient_name(self, obj):
        return f"{obj.patient.first_name} {obj.patient.last_name}"

    def get_doctor_name(self, obj):
        if obj.doctor.first_name or obj.doctor.last_name:
            return f"{obj.doctor.first_name} {obj.doctor.last_name}".strip()
        return obj.doctor.email

    def validate(self, data):
        """Validar que el doctor no tenga citas superpuestas"""
        if self.instance:
            # Es una actualización, excluir la cita actual
            conflicting = Appointment.objects.filter(
                doctor=data.get('doctor', self.instance.doctor),
                date=data.get('date', self.instance.date),
                time=data.get('time', self.instance.time),
                status__in=['scheduled', 'in_progress']
            ).exclude(pk=self.instance.pk)
        else:
            # Es una creación
            conflicting = Appointment.objects.filter(
                doctor=data['doctor'],
                date=data['date'],
                time=data['time'],
                status__in=['scheduled', 'in_progress']
            )

        if conflicting.exists():
            raise serializers.ValidationError(
                "El doctor ya tiene una cita programada en este horario."
            )

        return data
