"""
URL configuration for hospital project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse

def home(request):
    return JsonResponse({
        'message': 'Hospital API',
        'endpoints': {
            'admin': '/admin/',
            'api_auth': '/api/auth/',
            'api_patients': '/api/patients/',
            'api_appointments': '/api/appointments/',
            'api_medical_records': '/api/medical-records/',
            'api_tasks': '/api/tasks/',
            'api_notifications': '/api/notifications/',
            'api_vital_signs': '/api/vital-signs/',
        }
    })

urlpatterns = [
    path('', home, name='home'),
    path('admin/', admin.site.urls),
    path('api/auth/', include('accounts.urls')),
    path('api/patients/', include('patients.urls')),
    path('api/appointments/', include('appointments.urls')),
    path('api/medical-records/', include('medical_records.urls')),
    path('api/tasks/', include('tasks.urls')),
    path('api/notifications/', include('notifications.urls')),
    path('api/vital-signs/', include('vital_signs.urls')),
]
