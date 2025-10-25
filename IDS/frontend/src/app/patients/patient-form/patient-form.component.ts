import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PatientsService } from '../../services/patients.service';
import { Patient } from '../../models/patient.model';

@Component({
  selector: 'app-patient-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './patient-form.component.html',
  styleUrl: './patient-form.component.css'
})
export class PatientFormComponent implements OnInit {
  patient: Partial<Patient> = {
    first_name: '',
    last_name: '',
    email: '',
    age: undefined,
    gender: undefined,
    blood_type: '',
    phone: '',
    address: '',
    status: 'active'
  };

  isEditMode = false;
  patientId: number | null = null;
  loading = false;
  submitting = false;

  constructor(
    private patientsService: PatientsService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.patientId = +params['id'];
        this.loadPatient();
      }
    });
  }

  loadPatient() {
    if (!this.patientId) return;

    this.loading = true;
    this.patientsService.getPatient(this.patientId).subscribe({
      next: (data) => {
        this.patient = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading patient:', error);
        alert('Error al cargar el paciente');
        this.loading = false;
        this.router.navigate(['/patients']);
      }
    });
  }

  onSubmit() {
    this.submitting = true;

    const operation = this.isEditMode && this.patientId
      ? this.patientsService.updatePatient(this.patientId, this.patient)
      : this.patientsService.createPatient(this.patient);

    operation.subscribe({
      next: () => {
        alert(`Paciente ${this.isEditMode ? 'actualizado' : 'creado'} exitosamente`);
        this.router.navigate(['/patients']);
      },
      error: (error) => {
        console.error('Error saving patient:', error);
        alert('Error al guardar el paciente: ' + (error.error?.email?.[0] || error.message));
        this.submitting = false;
      }
    });
  }

  cancel() {
    this.router.navigate(['/patients']);
  }
}
