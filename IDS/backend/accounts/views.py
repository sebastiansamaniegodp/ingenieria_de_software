from rest_framework import status, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework_simplejwt.tokens import RefreshToken
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from .serializers import UserRegistrationSerializer, UserSerializer
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import date
from django.db.models import Count, Q


class RegisterView(APIView):
	def post(self, request):
		serializer = UserRegistrationSerializer(data=request.data)
		if serializer.is_valid():
			user = serializer.save()
			data = {
				'id': user.id,
				'email': user.email,
				'first_name': user.first_name,
				'last_name': user.last_name,
				'role': user.role,
			}
			return Response(data, status=status.HTTP_201_CREATED)
		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class BasicLoginView(APIView):
	def post(self, request):
		email = request.data.get('email', '').strip().lower()
		password = request.data.get('password')
		user = authenticate(request, email=email, password=password)
		if user is None:
			return Response({'detail': 'Credenciales inválidas'}, status=status.HTTP_401_UNAUTHORIZED)
		if not user.is_active:
			return Response({'detail': 'Cuenta inactiva'}, status=status.HTTP_403_FORBIDDEN)
		login(request, user)

		# Generate JWT tokens
		refresh = RefreshToken.for_user(user)

		return Response({
			'access': str(refresh.access_token),
			'refresh': str(refresh),
			'user': {
				'id': user.id,
				'email': user.email,
				'first_name': user.first_name,
				'last_name': user.last_name,
				'role': user.role,
			}
		})


class BasicLogoutView(APIView):
	def post(self, request):
		logout(request)
		return Response({'detail': 'Logout ok'})


class UserViewSet(viewsets.ReadOnlyModelViewSet):
	"""
	ViewSet para listar usuarios del sistema.
	Solo permite lectura (GET) para usuarios autenticados.
	Filtrable por rol (role=DOCTOR, role=NURSE, etc.)
	"""
	queryset = get_user_model().objects.all()
	serializer_class = UserSerializer
	permission_classes = [IsAuthenticated]
	filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
	filterset_fields = ['role', 'is_active', 'specialty']
	search_fields = ['first_name', 'last_name', 'email', 'medical_license']
	ordering_fields = ['date_joined', 'last_name', 'first_name']
	ordering = ['-date_joined']


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_stats(request):
	"""
	Endpoint para obtener estadísticas del dashboard.
	Retorna datos agregados de pacientes, citas y personal.
	"""
	from patients.models import Patient
	from appointments.models import Appointment

	today = date.today()
	User = get_user_model()

	# Total de pacientes activos
	total_patients = Patient.objects.filter(status='active').count()

	# Total de citas
	total_appointments = Appointment.objects.count()

	# Citas de hoy
	appointments_today = Appointment.objects.filter(date=today).count()

	# Personal activo (doctores, enfermeras, staff)
	active_staff = User.objects.filter(
		is_active=True,
		role__in=['DOCTOR', 'NURSE', 'STAFF']
	).count()

	# Estadísticas por rol de usuario
	user_role = request.user.role

	stats = {
		'total_patients': total_patients,
		'total_appointments': total_appointments,
		'appointments_today': appointments_today,
		'active_staff': active_staff,
		'bed_occupancy': 0,  # TODO: Implementar cuando exista modelo de camas
		'pending_tasks': 0,  # TODO: Implementar cuando exista modelo de tareas
		'unread_notifications': 0,  # TODO: Implementar cuando exista modelo de notificaciones
	}

	# Agregar estadísticas específicas por rol si es necesario
	if user_role == 'DOCTOR':
		# Citas del doctor
		doctor_appointments_today = Appointment.objects.filter(
			doctor=request.user,
			date=today
		).count()
		stats['my_appointments_today'] = doctor_appointments_today

		# Total de pacientes atendidos por el doctor
		my_patients = Appointment.objects.filter(
			doctor=request.user
		).values('patient').distinct().count()
		stats['my_patients'] = my_patients

	return Response(stats)
