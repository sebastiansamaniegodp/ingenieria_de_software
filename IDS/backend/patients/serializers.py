from rest_framework import serializers
from .models import Patient


class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = [
            'id', 'first_name', 'last_name', 'email', 'age',
            'gender', 'blood_type', 'phone', 'address',
            'last_visit', 'status', 'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']

    def validate_email(self, value):
        """Validar que el email no esté duplicado al actualizar"""
        if self.instance:
            # Es una actualización
            if Patient.objects.exclude(pk=self.instance.pk).filter(email=value).exists():
                raise serializers.ValidationError("Ya existe un paciente con este email.")
        else:
            # Es una creación
            if Patient.objects.filter(email=value).exists():
                raise serializers.ValidationError("Ya existe un paciente con este email.")
        return value

    def validate_age(self, value):
        """Validar que la edad sea razonable"""
        if value is not None and (value < 0 or value > 150):
            raise serializers.ValidationError("La edad debe estar entre 0 y 150 años.")
        return value
