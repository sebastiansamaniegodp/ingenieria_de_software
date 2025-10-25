from django.db import models
from django.utils import timezone
from django.conf import settings
from patients.models import Patient


class MedicalRecord(models.Model):
    TYPE_CHOICES = [
        ('lab_result', 'Resultado de Laboratorio'),
        ('prescription', 'Prescripción'),
        ('diagnosis', 'Diagnóstico'),
        ('note', 'Nota Médica')
    ]

    STATUS_CHOICES = [
        ('pending', 'Pendiente'),
        ('completed', 'Completado'),
        ('reviewed', 'Revisado')
    ]

    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='medical_records')
    doctor = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='medical_records')
    record_type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='note')
    title = models.CharField(max_length=200)
    description = models.TextField()
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='pending')
    date = models.DateField(default=timezone.now)
    attachments = models.TextField(null=True, blank=True, help_text="URLs de archivos adjuntos (JSON)")
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.patient} - {self.title} ({self.date})"

    class Meta:
        verbose_name = 'Registro Médico'
        verbose_name_plural = 'Registros Médicos'
        ordering = ['-date', '-created_at']
