import { Routes } from '@angular/router';
import { RegisterComponent } from './auth/register/register.component';
import { LoginComponent } from './auth/login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PatientsListComponent } from './patients/patients-list/patients-list.component';
import { PatientFormComponent } from './patients/patient-form/patient-form.component';
import { AppointmentsListComponent } from './appointments/appointments-list/appointments-list.component';
import { AppointmentFormComponent } from './appointments/appointment-form/appointment-form.component';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'patients', component: PatientsListComponent, canActivate: [authGuard] },
  { path: 'patients/new', component: PatientFormComponent, canActivate: [authGuard] },
  { path: 'patients/edit/:id', component: PatientFormComponent, canActivate: [authGuard] },
  { path: 'appointments', component: AppointmentsListComponent, canActivate: [authGuard] },
  { path: 'appointments/new', component: AppointmentFormComponent, canActivate: [authGuard] },
  { path: 'appointments/edit/:id', component: AppointmentFormComponent, canActivate: [authGuard] },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: 'dashboard' }
];
