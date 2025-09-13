# Hospital System (Backend Django + Frontend Angular)

## Backend

### Requisitos
- Python 3.12
- PostgreSQL 14+

### Instalación
```bash
python3 -m venv venv
source venv/bin/activate
pip install -r backend/requirements.txt
```

Crear archivo `.env` en `backend/` (ya creado de ejemplo):
```
DJANGO_SECRET_KEY=change-me
DJANGO_DEBUG=1
DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1
POSTGRES_DB=hospital_db
POSTGRES_USER=hospital_user
POSTGRES_PASSWORD=hospital_pass
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
```

### Migraciones
```bash
cd backend
python manage.py makemigrations
python manage.py migrate
```

### Ejecutar servidor
```bash
python manage.py runserver 0.0.0.0:8000
```

Endpoint de registro: `POST /api/auth/register/`
Body JSON:
```json
{
  "email": "user@example.com",
  "password": "Password123",
  "first_name": "Nombre",
  "last_name": "Apellido",
  "role": "PATIENT"
}
```

## Frontend (Angular)

### Instalación
```bash
cd frontend
npm install
```

### Ejecutar
```bash
npx ng serve --port 4200
```

Abrir: http://localhost:4200/register

El formulario envía al backend (http://localhost:8000/api/auth/register/).

## Tests Backend
```bash
cd backend
python manage.py test
```

## Flujo de autenticación básico (sin JWT)
1. Registro crea usuario vía `/api/auth/register/`.
2. Login envía `POST /api/auth/login/ { email, password }`.
3. Backend valida y crea sesión (cookie de sesión de Django) y el frontend guarda el objeto usuario en `localStorage`.
4. Guard en Angular verifica presencia de `user` en `localStorage` para permitir acceso a `/dashboard`.
5. Logout: `POST /api/auth/logout/` y se borra `localStorage.user`.

## Próximos pasos sugeridos
- Mejorar seguridad (CSRF en peticiones, rotación de sesión, expiración front)
- Roles y permisos en endpoints
- Gestión de perfiles médicos
- Citas y agenda
- Historial clínico
- Auditoría y logging
