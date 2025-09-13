from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import UserRegistrationSerializer
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
		return Response({
			'id': user.id,
			'email': user.email,
			'first_name': user.first_name,
			'last_name': user.last_name,
			'role': user.role,
		})


class BasicLogoutView(APIView):
	def post(self, request):
		logout(request)
		return Response({'detail': 'Logout ok'})

# Create your views here.
