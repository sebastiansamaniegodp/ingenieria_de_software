import { Routes } from '@angular/router';
import { RegisterComponent } from './auth/register/register.component';
import { LoginComponent } from './auth/login/login.component';
import { LayoutComponent } from './shared/layout/layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PatientsListComponent } from './patients/patients-list/patients-list.component';
import { PatientFormComponent } from './patients/patient-form/patient-form.component';
import { AppointmentsListComponent } from './appointments/appointments-list/appointments-list.component';
import { AppointmentFormComponent } from './appointments/appointment-form/appointment-form.component';
import { TaskManagementComponent } from './features/task-management/task-management.component';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'patients', component: PatientsListComponent },
      { path: 'patients/new', component: PatientFormComponent },
      { path: 'patients/edit/:id', component: PatientFormComponent },
      { path: 'appointments', component: AppointmentsListComponent },
      { path: 'appointments/new', component: AppointmentFormComponent },
      { path: 'appointments/edit/:id', component: AppointmentFormComponent },
      { path: 'tasks', component: TaskManagementComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: 'dashboard' }
];
