from django.db import models
from django.utils import timezone
from django.conf import settings
from patients.models import Patient


class VitalSign(models.Model):
    patient = models.ForeignKey(
        Patient,
        on_delete=models.CASCADE,
        related_name='vital_signs'
    )
    temperature = models.DecimalField(
        max_digits=4,
        decimal_places=1,
        null=True,
        blank=True,
        help_text='Temperatura corporal en grados Celsius'
    )
    blood_pressure = models.CharField(
        max_length=10,
        null=True,
        blank=True,
        help_text='Presión arterial (formato: 120/80)'
    )
    heart_rate = models.IntegerField(
        null=True,
        blank=True,
        help_text='Frecuencia cardíaca en latidos por minuto'
    )
    respiratory_rate = models.IntegerField(
        null=True,
        blank=True,
        help_text='Frecuencia respiratoria por minuto'
    )
    oxygen_saturation = models.IntegerField(
        null=True,
        blank=True,
        help_text='Saturación de oxígeno en porcentaje'
    )
    recorded_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='recorded_vital_signs',
        limit_choices_to={'role__in': ['NURSE', 'DOCTOR', 'STAFF']}
    )
    recorded_at = models.DateTimeField(default=timezone.now)
    notes = models.TextField(
        blank=True,
        help_text='Observaciones adicionales'
    )
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"Signos vitales de {self.patient} - {self.recorded_at.strftime('%Y-%m-%d %H:%M')}"

    class Meta:
        verbose_name = 'Signo Vital'
        verbose_name_plural = 'Signos Vitales'
        ordering = ['-recorded_at']
