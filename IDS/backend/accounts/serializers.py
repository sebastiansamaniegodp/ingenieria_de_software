from rest_framework import serializers
from .models import CustomUser


class UserSerializer(serializers.ModelSerializer):
    """Serializer básico para información de usuario"""
    specialty_display = serializers.CharField(source='get_specialty_display', read_only=True)

    class Meta:
        model = CustomUser
        fields = ["id", "email", "first_name", "last_name", "role", "specialty", "specialty_display", "medical_license", "work_schedule", "is_active"]
        read_only_fields = ["id"]


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = CustomUser
        fields = ["id", "email", "password", "first_name", "last_name", "role", "specialty", "medical_license", "work_schedule"]
        read_only_fields = ["id"]

    def validate_email(self, value):
        value = value.lower().strip()
        if CustomUser.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("El email ya está registrado.")
        return value

    def validate_medical_license(self, value):
        if value:
            if CustomUser.objects.filter(medical_license=value).exists():
                raise serializers.ValidationError("Esta licencia médica ya está registrada.")
        return value

    def validate(self, attrs):
        role = attrs.get('role')
        specialty = attrs.get('specialty')
        medical_license = attrs.get('medical_license')

        # Validar que solo los doctores tengan especialidad y licencia
        if role != 'DOCTOR':
            if specialty or medical_license:
                raise serializers.ValidationError(
                    "Solo los usuarios con rol DOCTOR pueden tener especialidad y licencia médica."
                )
        else:
            # Para doctores, la especialidad y licencia son requeridas
            if not specialty:
                raise serializers.ValidationError(
                    "La especialidad es requerida para doctores."
                )
            if not medical_license:
                raise serializers.ValidationError(
                    "La licencia médica es requerida para doctores."
                )

        return attrs

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = CustomUser.objects.create_user(password=password, **validated_data)
        return user
