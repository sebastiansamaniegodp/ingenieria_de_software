from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from .models import CustomUser

class BasicLoginTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = CustomUser.objects.create_user(email='basic@example.com', password='Passw0rd123')
        self.url = reverse('basic_login')

    def test_login_success(self):
        resp = self.client.post(self.url, {'email': 'basic@example.com', 'password': 'Passw0rd123'}, format='json')
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(resp.data['email'], 'basic@example.com')

    def test_login_invalid(self):
        resp = self.client.post(self.url, {'email': 'basic@example.com', 'password': 'wrong'}, format='json')
        self.assertEqual(resp.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertIn('detail', resp.data)
