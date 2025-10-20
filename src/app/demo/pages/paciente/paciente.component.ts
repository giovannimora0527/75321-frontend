import { Component, ViewChild } from '@angular/core';
import { PacienteService } from './service/paciente.service';
import { Paciente } from './models/paciente';
import { CommonModule } from '@angular/common';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
  AbstractControl,
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import Swal from 'sweetalert2';
import Modal from 'bootstrap/js/dist/modal';

// Importaciones de PrimeNG
import { TableModule } from 'primeng/table';
import { Table } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-paciente',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    ReactiveFormsModule, 
    NgxSpinnerModule,
    TableModule,
    DropdownModule,
    InputTextModule,
    ButtonModule
  ],
  templateUrl: './paciente.component.html',
  styleUrl: './paciente.component.scss'
})
export class PacienteComponent {
  @ViewChild('dt') dt: Table | undefined;

  modalInstance: Modal | null = null;
  modoFormulario: string = '';
  titleModal: string = '';
  titleBoton: string = '';
  pacienteList: Paciente[] = [];
  pacienteSelected: Paciente;
  titleSpinner: string = 'Cargando...';
  loading: boolean = false;

  tiposDocumento = [
    { label: 'CC', value: 'CC' },
    { label: 'TI', value: 'TI' },
    { label: 'CE', value: 'CE' },
    { label: 'PAS', value: 'PAS' }
  ];

  generos = [
    { label: 'Masculino', value: 'M' },
    { label: 'Femenino', value: 'F' }
  ];

  form: FormGroup;

  constructor(
    private readonly pacienteService: PacienteService,
    private readonly formBuilder: FormBuilder,
    private readonly spinner: NgxSpinnerService
  ) {
    this.listarPacientes();
    this.inicializarFormulario();
  }

  inicializarFormulario() {
    this.form = this.formBuilder.group({
      tipoDocumento: ['', [Validators.required]],
      numeroDocumento: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]],
      nombres: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      apellidos: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      fechaNacimiento: ['', [Validators.required]],
      genero: ['', [Validators.required]],
      telefono: ['', [Validators.minLength(7), Validators.maxLength(20)]],
      direccion: ['', [Validators.maxLength(255)]]
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  listarPacientes() {
    this.loading = true;
    this.spinner.show();
    this.pacienteService.listarPacientes().subscribe({
      next: (data) => {
        this.loading = false;
        this.spinner.hide();
        this.pacienteList = data;
      },
      error: (error) => {
        this.loading = false;
        this.spinner.hide();
        console.error('Error al cargar pacientes: ', error);
      }
    });
  }

  limpiarFiltros() {
    if (this.dt) {
      this.dt.clear();
    }
  }

  private formatearFecha(fecha: Date | string): string {
    if (!fecha) return '';
    const d = new Date(fecha);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  closeModal() {
    this.limpiarFormulario();
    this.pacienteSelected = new Paciente();
    if (this.modalInstance) {
      this.modalInstance.hide();
    }
  }

  openModal(modo: string) {
    this.titleModal = modo === 'C' ? 'Crear Paciente' : 'Editar Paciente';
    this.titleBoton = modo === 'C' ? 'Guardar Paciente' : 'Actualizar Paciente';
    this.modoFormulario = modo;
    const modalElement = document.getElementById('modalCrearPaciente');
    if (modalElement) {
      this.modalInstance ??= new Modal(modalElement);
      this.modalInstance.show();
    }
  }

  abrirNuevoPaciente() {
    this.pacienteSelected = new Paciente();
    this.limpiarFormulario();
    this.openModal('C');
  }

  limpiarFormulario() {
    this.form.reset();
    this.form.markAsPristine();
    this.form.markAsUntouched();
  }

  abrirEditarPaciente(paciente: Paciente) {
    this.pacienteSelected = paciente;
    this.form.patchValue({
      tipoDocumento: paciente.tipoDocumento,
      numeroDocumento: paciente.numeroDocumento,
      nombres: paciente.nombres,
      apellidos: paciente.apellidos,
      fechaNacimiento: this.formatearFecha(paciente.fechaNacimiento),
      genero: paciente.genero,
      telefono: paciente.telefono,
      direccion: paciente.direccion
    });
    this.openModal('E');
  }

  guardarPaciente() {
    this.spinner.show();
    if (this.form.invalid) {
      this.spinner.hide();
      Swal.fire('Error', 'Por favor complete todos los campos requeridos', 'error');
      return;
    }

    if (this.modoFormulario === 'C') {
      this.pacienteService.guardarPaciente(this.form.getRawValue()).subscribe({
        next: (data) => {
          this.spinner.hide();
          Swal.fire('Éxito', data.mensaje, 'success');
          this.closeModal();
          this.listarPacientes();
        },
        error: (error) => {
          this.spinner.hide();
          Swal.fire('Error', error.error?.message || 'Error al guardar', 'error');
        }
      });
    } else {
      const pacienteActualizar = { ...this.pacienteSelected, ...this.form.value };
      this.pacienteService.actualizarPaciente(pacienteActualizar).subscribe({
        next: (data) => {
          this.spinner.hide();
          Swal.fire('Éxito', data.mensaje, 'success');
          this.closeModal();
          this.listarPacientes();
        },
        error: (error) => {
          this.spinner.hide();
          Swal.fire('Error', error.error?.message || 'Error al actualizar', 'error');
        }
      });
    }
  }
}
