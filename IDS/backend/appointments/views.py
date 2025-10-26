from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Count
from django.utils import timezone
from datetime import timedelta
from .models import Appointment
from .serializers import AppointmentSerializer


class AppointmentViewSet(viewsets.ModelViewSet):
    """
    ViewSet para operaciones CRUD de Citas.
    """
    queryset = Appointment.objects.all().select_related('patient', 'doctor')
    serializer_class = AppointmentSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'appointment_type', 'patient', 'doctor', 'date']
    search_fields = ['patient__first_name', 'patient__last_name', 'doctor__first_name', 'doctor__last_name', 'room']
    ordering_fields = ['date', 'time', 'created_at']
    ordering = ['date', 'time']

    @action(detail=False, methods=['get'])
    def chart_data(self, request):
        """
        Endpoint para obtener datos de citas para gráficos.
        Retorna citas agrupadas por fecha (últimos 7 días) y por tipo.
        """
        today = timezone.now().date()
        week_ago = today - timedelta(days=6)

        # Citas por día (últimos 7 días)
        appointments_by_date = []
        for i in range(7):
            current_date = week_ago + timedelta(days=i)
            count = Appointment.objects.filter(date=current_date).count()
            appointments_by_date.append({
                'date': current_date.isoformat(),
                'count': count
            })

        # Citas por tipo
        appointments_by_type = list(
            Appointment.objects.values('appointment_type')
            .annotate(count=Count('id'))
            .order_by('-count')
        )

        # Citas por estado
        appointments_by_status = list(
            Appointment.objects.values('status')
            .annotate(count=Count('id'))
            .order_by('-count')
        )

        return Response({
            'by_date': appointments_by_date,
            'by_type': appointments_by_type,
            'by_status': appointments_by_status,
        })
