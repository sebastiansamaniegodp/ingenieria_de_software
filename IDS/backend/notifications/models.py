from django.db import models
from django.utils import timezone
from django.conf import settings
from appointments.models import Appointment


class Notification(models.Model):
    TYPE_CHOICES = [
        ('info', 'Información'),
        ('warning', 'Advertencia'),
        ('success', 'Éxito'),
        ('error', 'Error')
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='notifications',
        limit_choices_to={'role': 'DOCTOR'}
    )
    title = models.CharField(max_length=200)
    message = models.TextField()
    type = models.CharField(max_length=10, choices=TYPE_CHOICES, default='info')
    read = models.BooleanField(default=False)
    appointment = models.ForeignKey(
        Appointment,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='notifications',
        help_text='Cita relacionada con esta notificación'
    )
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.title} - {self.user.email}"

    class Meta:
        verbose_name = 'Notificación'
        verbose_name_plural = 'Notificaciones'
        ordering = ['-created_at']
