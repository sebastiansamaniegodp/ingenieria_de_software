from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from .models import MedicalRecord
from .serializers import MedicalRecordSerializer


class MedicalRecordViewSet(viewsets.ModelViewSet):
    """
    ViewSet para operaciones CRUD de Registros Médicos.
    """
    queryset = MedicalRecord.objects.all().select_related('patient', 'doctor')
    serializer_class = MedicalRecordSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'record_type', 'patient', 'doctor', 'date']
    search_fields = ['title', 'description', 'patient__first_name', 'patient__last_name']
    ordering_fields = ['date', 'created_at']
    ordering = ['-date', '-created_at']
