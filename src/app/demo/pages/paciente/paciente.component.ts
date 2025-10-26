import { Component } from '@angular/core';
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

@Component({
  selector: 'app-paciente',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgxSpinnerModule],
  templateUrl: './paciente.component.html',
  styleUrl: './paciente.component.scss'
})
export class PacienteComponent {
  modalInstance: Modal | null = null;
  modoFormulario: string = '';
  titleModal: string = '';
  titleBoton: string = '';
  
  pacienteList: Paciente[] = [];
  
  pacienteListFiltrada: Paciente[] = [];
  
  pacienteSelected: Paciente;
  titleSpinner: string = 'Cargando...';

  filtros = {
    id: '',
    tipoDocumento: '',
    numeroDocumento: '',
    nombres: '',
    apellidos: '',
    fechaNacimiento: '',
    genero: '',
    telefono: '',
    direccion: ''
  };

  form: FormGroup = new FormGroup({
    tipoDocumento: new FormControl(''),
    numeroDocumento: new FormControl(''),
    nombres: new FormControl(''),
    apellidos: new FormControl(''),
    fechaNacimiento: new FormControl(''),
    genero: new FormControl(''),
    telefono: new FormControl(''),
    direccion: new FormControl('')
  });

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
    this.spinner.show();
    this.pacienteService.listarPacientes().subscribe({
      next: (data) => {
        this.spinner.hide();
        this.pacienteList = data;
        // Inicializar la lista filtrada con todos los pacientes
        this.pacienteListFiltrada = [...this.pacienteList];
      },
      error: (error) => {
        this.spinner.hide();
        console.error('Error al cargar pacientes: ', error);
      }
    });
  }

  /**
   * Aplica los filtros a la lista de pacientes
   * Se ejecuta cada vez que cambia un valor en los inputs de filtro
   */
  aplicarFiltros() {
    this.pacienteListFiltrada = this.pacienteList.filter(paciente => {
      // Filtro por ID
      const cumpleId = !this.filtros.id || 
        paciente.id.toString().includes(this.filtros.id);

      // Filtro por Tipo de Documento
      const cumpleTipoDoc = !this.filtros.tipoDocumento || 
        paciente.tipoDocumento === this.filtros.tipoDocumento;

      // Filtro por Número de Documento (búsqueda parcial, case insensitive)
      const cumpleNumDoc = !this.filtros.numeroDocumento || 
        paciente.numeroDocumento.toLowerCase()
          .includes(this.filtros.numeroDocumento.toLowerCase());

      // Filtro por Nombres (búsqueda parcial, case insensitive)
      const cumpleNombres = !this.filtros.nombres || 
        paciente.nombres.toLowerCase()
          .includes(this.filtros.nombres.toLowerCase());

      // Filtro por Apellidos (búsqueda parcial, case insensitive)
      const cumpleApellidos = !this.filtros.apellidos || 
        paciente.apellidos.toLowerCase()
          .includes(this.filtros.apellidos.toLowerCase());

      // Filtro por Fecha de Nacimiento (exacta)
      const cumpleFecha = !this.filtros.fechaNacimiento || 
        this.formatearFecha(paciente.fechaNacimiento) === this.filtros.fechaNacimiento;

      // Filtro por Género
      const cumpleGenero = !this.filtros.genero || 
        paciente.genero === this.filtros.genero;

      // Filtro por Teléfono (búsqueda parcial)
      const cumpleTelefono = !this.filtros.telefono || 
        (paciente.telefono && paciente.telefono.includes(this.filtros.telefono));

      // Filtro por Dirección (búsqueda parcial, case insensitive)
      const cumpleDireccion = !this.filtros.direccion || 
        (paciente.direccion && paciente.direccion.toLowerCase()
          .includes(this.filtros.direccion.toLowerCase()));

      // El paciente debe cumplir TODOS los filtros activos
      return cumpleId && cumpleTipoDoc && cumpleNumDoc && cumpleNombres && 
             cumpleApellidos && cumpleFecha && cumpleGenero && 
             cumpleTelefono && cumpleDireccion;
    });
  }

  /**
   * Formatea una fecha al formato YYYY-MM-DD
   */
  private formatearFecha(fecha: Date | string): string {
    if (!fecha) return '';
    const d = new Date(fecha);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * Limpia todos los filtros y muestra la lista completa
   */
  limpiarFiltros() {
    this.filtros = {
      id: '',
      tipoDocumento: '',
      numeroDocumento: '',
      nombres: '',
      apellidos: '',
      fechaNacimiento: '',
      genero: '',
      telefono: '',
      direccion: ''
    };
    this.pacienteListFiltrada = [...this.pacienteList];
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
          console.error('Error al guardar paciente: ', error);
          Swal.fire('Error', error.error.message || 'Error al guardar', 'error');
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
          console.error('Error al actualizar paciente: ', error);
          Swal.fire('Error', error.error.message || 'Error al actualizar', 'error');
        }
      });
    }
  }
}
