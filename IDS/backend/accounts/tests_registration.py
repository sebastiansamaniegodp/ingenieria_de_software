from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from .models import CustomUser

class RegistrationTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.url = reverse('register')

    def test_successful_registration(self):
        payload = {
            'email': 'test@example.com',
            'password': 'SuperSecret123',
            'first_name': 'Test',
            'last_name': 'User',
            'role': 'PATIENT'
        }
        response = self.client.post(self.url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(CustomUser.objects.filter(email='test@example.com').exists())

    def test_duplicate_email(self):
        CustomUser.objects.create_user(email='test@example.com', password='abc12345')
        payload = {
            'email': 'test@example.com',
            'password': 'AnotherSecret123',
        }
        response = self.client.post(self.url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('email', response.data)
