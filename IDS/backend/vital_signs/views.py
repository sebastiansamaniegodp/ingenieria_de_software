from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from .models import VitalSign
from .serializers import VitalSignSerializer


class VitalSignViewSet(viewsets.ModelViewSet):
    """
    ViewSet para operaciones CRUD de Signos Vitales.
    """
    queryset = VitalSign.objects.all().select_related('patient', 'recorded_by')
    serializer_class = VitalSignSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['patient', 'recorded_by']
    search_fields = ['patient__first_name', 'patient__last_name', 'notes']
    ordering_fields = ['recorded_at', 'created_at']
    ordering = ['-recorded_at']
