from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from .models import CustomUser
from rest_framework_simplejwt.tokens import RefreshToken

class ProtectedEndpointsTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = CustomUser.objects.create_user(email='protected@example.com', password='Pass123456')
        refresh = RefreshToken.for_user(self.user)
        self.access = str(refresh.access_token)
        self.refresh = str(refresh)
        self.me_url = reverse('me')
        self.logout_url = reverse('logout')

    def test_me_requires_auth(self):
        r = self.client.get(self.me_url)
        self.assertEqual(r.status_code, status.HTTP_401_UNAUTHORIZED)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access}')
        r2 = self.client.get(self.me_url)
        self.assertEqual(r2.status_code, status.HTTP_200_OK)
        self.assertEqual(r2.data['email'], 'protected@example.com')

    def test_logout_blacklists(self):
        # call logout
        r = self.client.post(self.logout_url, {'refresh': self.refresh}, format='json')
        self.assertEqual(r.status_code, status.HTTP_200_OK)
        # Using blacklisted refresh should fail to get new access
        token_refresh_url = reverse('token_refresh')
        r2 = self.client.post(token_refresh_url, {'refresh': self.refresh}, format='json')
        self.assertEqual(r2.status_code, status.HTTP_401_UNAUTHORIZED)
