from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import RegisterView, BasicLoginView, BasicLogoutView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', BasicLoginView.as_view(), name='basic_login'),
    path('logout/', BasicLogoutView.as_view(), name='basic_logout'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]