from django.urls import path
from .views import RegisterView, BasicLoginView, BasicLogoutView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', BasicLoginView.as_view(), name='basic_login'),
    path('logout/', BasicLogoutView.as_view(), name='basic_logout'),
]