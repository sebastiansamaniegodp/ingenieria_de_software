from rest_framework import status, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from .serializers import UserRegistrationSerializer, UserSerializer
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth import get_user_model


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
