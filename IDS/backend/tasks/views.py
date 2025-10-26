from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from .models import Task
from .serializers import TaskSerializer


class TaskViewSet(viewsets.ModelViewSet):
    """
    ViewSet para operaciones CRUD de Tareas.
    """
    queryset = Task.objects.all().select_related('assigned_to', 'patient', 'appointment')
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'priority', 'assigned_to', 'patient', 'appointment']
    search_fields = ['title', 'description', 'assigned_to__first_name', 'assigned_to__last_name']
    ordering_fields = ['priority', 'due_date', 'created_at', 'status']
    ordering = ['-priority', 'due_date']
