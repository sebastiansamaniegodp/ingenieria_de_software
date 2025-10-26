from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.utils import timezone


class UserManager(BaseUserManager):
	def create_user(self, email, password=None, role='PATIENT', **extra_fields):
		if not email:
			raise ValueError('El email es obligatorio')
		email = self.normalize_email(email).lower()
		user = self.model(email=email, role=role, **extra_fields)
		user.set_password(password)
		user.save(using=self._db)
		return user

	def create_superuser(self, email, password=None, **extra_fields):
		extra_fields.setdefault('is_staff', True)
		extra_fields.setdefault('is_superuser', True)
		extra_fields.setdefault('is_active', True)
		if extra_fields.get('is_staff') is not True:
			raise ValueError('Superuser must have is_staff=True.')
		if extra_fields.get('is_superuser') is not True:
			raise ValueError('Superuser must have is_superuser=True.')
		return self.create_user(email, password, role='ADMIN', **extra_fields)


class CustomUser(AbstractBaseUser, PermissionsMixin):
	class Roles(models.TextChoices):
		ADMIN = 'ADMIN', 'Administrador'
		DOCTOR = 'DOCTOR', 'Doctor'
		NURSE = 'NURSE', 'Enfermería'
		STAFF = 'STAFF', 'Personal'
		PATIENT = 'PATIENT', 'Paciente'

	class Specialties(models.TextChoices):
		CARDIOLOGY = 'CARDIOLOGY', 'Cardiología'
		DERMATOLOGY = 'DERMATOLOGY', 'Dermatología'
		PEDIATRICS = 'PEDIATRICS', 'Pediatría'
		NEUROLOGY = 'NEUROLOGY', 'Neurología'
		ORTHOPEDICS = 'ORTHOPEDICS', 'Ortopedia'
		GYNECOLOGY = 'GYNECOLOGY', 'Ginecología'
		PSYCHIATRY = 'PSYCHIATRY', 'Psiquiatría'
		GENERAL = 'GENERAL', 'Medicina General'
		SURGERY = 'SURGERY', 'Cirugía'
		EMERGENCY = 'EMERGENCY', 'Emergencias'

	email = models.EmailField(unique=True, max_length=255)
	first_name = models.CharField(max_length=100, blank=True)
	last_name = models.CharField(max_length=100, blank=True)
	role = models.CharField(max_length=20, choices=Roles.choices, default=Roles.PATIENT)
	is_active = models.BooleanField(default=True)
	is_staff = models.BooleanField(default=False)
	date_joined = models.DateTimeField(default=timezone.now)

	# Campos específicos para doctores
	specialty = models.CharField(max_length=50, choices=Specialties.choices, null=True, blank=True)
	medical_license = models.CharField(max_length=50, unique=True, null=True, blank=True)
	work_schedule = models.JSONField(null=True, blank=True, help_text='Horario de trabajo en formato JSON')

	USERNAME_FIELD = 'email'
	REQUIRED_FIELDS = []

	objects = UserManager()

	def __str__(self):
		return self.email

	class Meta:
		verbose_name = 'Usuario'
		verbose_name_plural = 'Usuarios'

# Create your models here.
