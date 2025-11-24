import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { PacienteService } from './service/paciente.service';
import { Paciente } from './models/paciente';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-paciente',
  standalone: true,
  imports: [CommonModule, SharedModule, ReactiveFormsModule],
  templateUrl: './paciente.component.html',
  styleUrl: './paciente.component.scss'
})
export class PacienteComponent implements OnInit {
  pacientes: Paciente[] = [];
  pacienteForm: FormGroup;

  constructor(
    private pacienteService: PacienteService,
    private fb: FormBuilder
  ) {
    this.pacienteForm = this.fb.group({
      nombres: ['', Validators.required],
      apellidos: ['', Validators.required],
      numeroDocumento: ['', Validators.required],
      fechaNacimiento: ['', Validators.required],
      telefono: [''],
      direccion: ['']
    });
  }

  ngOnInit() {
    this.listarPacientes();
  }

  listarPacientes() {
    this.pacienteService.listarPacientes().subscribe({
      next: (data) => {
        this.pacientes = data;
      },
      error: (err) => console.error('Error al listar', err)
    });
  }

  guardarPaciente() {
    if (this.pacienteForm.invalid) {
      Swal.fire('Error', 'Complete los campos obligatorios', 'warning');
      return;
    }

    this.pacienteService.guardarPaciente(this.pacienteForm.value).subscribe({
      next: () => {
        Swal.fire('Éxito', 'Paciente registrado correctamente', 'success');
        this.pacienteForm.reset();
        this.listarPacientes(); // Recargar la tabla
      },
      error: (err) => {
        Swal.fire('Error', 'No se pudo guardar el paciente', 'error');
        console.error(err);
      }
    });
  }
}