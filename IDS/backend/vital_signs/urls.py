from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import VitalSignViewSet

router = DefaultRouter()
router.register(r'', VitalSignViewSet, basename='vital-sign')

urlpatterns = [
    path('', include(router.urls)),
]
