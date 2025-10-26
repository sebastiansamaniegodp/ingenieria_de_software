from rest_framework import viewsets, filters, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Notification
from .serializers import NotificationSerializer


class NotificationViewSet(viewsets.ModelViewSet):
    """
    ViewSet para operaciones CRUD de Notificaciones.
    """
    queryset = Notification.objects.all().select_related('user', 'appointment')
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['user', 'type', 'read']
    search_fields = ['title', 'message']
    ordering_fields = ['created_at', 'read']
    ordering = ['-created_at']

    @action(detail=True, methods=['post'])
    def mark_as_read(self, request, pk=None):
        """
        Marca una notificación como leída.
        """
        notification = self.get_object()
        notification.read = True
        notification.save()
        serializer = self.get_serializer(notification)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def mark_all_as_read(self, request):
        """
        Marca todas las notificaciones del usuario como leídas.
        """
        user_id = request.data.get('user_id')
        if not user_id:
            return Response(
                {'error': 'user_id es requerido'},
                status=status.HTTP_400_BAD_REQUEST
            )

        updated = Notification.objects.filter(user_id=user_id, read=False).update(read=True)
        return Response({'updated': updated})
