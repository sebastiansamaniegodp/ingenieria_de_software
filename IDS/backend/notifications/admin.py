from django.contrib import admin
from .models import Notification


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ['title', 'user', 'type', 'read', 'appointment', 'created_at']
    list_filter = ['type', 'read', 'created_at', 'user']
    search_fields = ['title', 'message', 'user__first_name', 'user__last_name', 'user__email']
    date_hierarchy = 'created_at'
    ordering = ['-created_at']
    readonly_fields = ['created_at']
