from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from .models import CustomUser
from rest_framework import status

class JWTAuthTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = CustomUser.objects.create_user(email='login@example.com', password='StrongPass123')
        self.token_url = reverse('token_obtain_pair')

    def test_obtain_token(self):
        resp = self.client.post(self.token_url, {'email': 'login@example.com', 'password': 'StrongPass123'}, format='json')
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertIn('access', resp.data)
        self.assertIn('refresh', resp.data)
        self.assertIn('user', resp.data)
