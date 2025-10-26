from rest_framework import serializers
from .models import Notification
from accounts.serializers import UserSerializer
from appointments.serializers import AppointmentSerializer


class NotificationSerializer(serializers.ModelSerializer):
    user_details = UserSerializer(source='user', read_only=True)
    appointment_details = AppointmentSerializer(source='appointment', read_only=True)

    class Meta:
        model = Notification
        fields = [
            'id', 'user', 'user_details', 'title', 'message', 'type',
            'read', 'appointment', 'appointment_details', 'created_at'
        ]
        read_only_fields = ['created_at']

    def validate_user(self, value):
        """Validar que solo doctores puedan recibir notificaciones"""
        if value.role != 'DOCTOR':
            raise serializers.ValidationError(
                "Las notificaciones solo pueden enviarse a doctores."
            )
        return value
