import { Component, AfterViewInit } from '@angular/core';
import { Paciente } from './models/paciente';
import { PacienteService } from './service/paciente.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

@Component({
  selector: 'app-paciente',
  imports: [CommonModule, FormsModule],
  templateUrl: './paciente.component.html',
  styleUrl: './paciente.component.scss'
})
export class PacienteComponent implements AfterViewInit {
  pacienteList: Paciente[] = [];
  pacienteListOriginal: Paciente[] = [];
  pacienteModal: Paciente = {};

  modoFormulario: 'N' | 'E' = 'N'; // Nuevo o Editar
  titleModal = 'Nuevo Paciente';
  titleBoton = 'Guardar';

  filters = {
    id: '',
    usuarioID: '',
    tipoDocumento: '',
    numeroDocumento: '',
    nombres: '',
    apellidos: '',
    fechaNacimiento: '',
    genero: '',
    telefono: '',
    direccion: ''
  };

  constructor(private readonly PacienteService: PacienteService) {
    this.listarPacietes();
  }

  ngAfterViewInit() {
    this.initializeTooltips();
  }

  listarPacietes() {
    this.PacienteService.listarPacientes().subscribe({
      next: (data) => {
        this.pacienteList = data;
        this.pacienteListOriginal = [...data];
        setTimeout(() => this.initializeTooltips(), 0);
      },
      error: (error) => {
        console.error('Error cargando pacientes:', error);
      }
    });
  }

  abrirNuevoPaciente() {
    this.pacienteModal = {};
    this.titleModal = 'Nuevo Paciente';
    this.titleBoton = 'Guardar';
    this.modoFormulario = 'N';
    setTimeout(() => {
      const modal = new (window as any).bootstrap.Modal(document.getElementById('modalPaciente'));
      modal.show();
    }, 100);
  }

  abrirEditarPaciente(paciente: Paciente) {
    this.pacienteModal = { ...paciente };
    this.titleModal = 'Editar Paciente';
    this.titleBoton = 'Actualizar';
    this.modoFormulario = 'E';
    setTimeout(() => {
      const modal = new (window as any).bootstrap.Modal(document.getElementById('modalPaciente'));
      modal.show();
    }, 100);
  }

  cerrarModal() {
    const modal = (window as any).bootstrap.Modal.getInstance(document.getElementById('modalPaciente'));
    if (modal) modal.hide();
    this.pacienteModal = {};
  }

  guardarModalPaciente() {
    if (this.modoFormulario === 'E' && this.pacienteModal.id != null) {
      this.PacienteService.actualizarPaciente(this.pacienteModal.id, this.pacienteModal).subscribe({
        next: () => {
          this.listarPacietes();
          this.cerrarModal();
        },
        error: (error) => {
          console.error('Error actualizando paciente:', error);
          alert('Error actualizando paciente');
        }
      });
    } else {
      this.PacienteService.guardarPaciente(this.pacienteModal).subscribe({
        next: () => {
          this.listarPacietes();
          this.cerrarModal();
        },
        error: (error) => {
          console.error('Error guardando paciente:', error);
          alert('Error guardando paciente');
        }
      });
    }
  }

  applyFilters() {
    this.pacienteList = this.pacienteListOriginal.filter((paciente) => {
      return (!this.filters.id || paciente.id?.toString().includes(this.filters.id)) &&
        (!this.filters.usuarioID || paciente.usuarioID?.toString().includes(this.filters.usuarioID)) &&
        (!this.filters.tipoDocumento || (paciente.tipoDocumento || '').toLowerCase().includes(this.filters.tipoDocumento.toLowerCase())) &&
        (!this.filters.numeroDocumento || (paciente.numeroDocumento || '').toLowerCase().includes(this.filters.numeroDocumento.toLowerCase())) &&
        (!this.filters.nombres || (paciente.nombres || '').toLowerCase().includes(this.filters.nombres.toLowerCase())) &&
        (!this.filters.apellidos || (paciente.apellidos || '').toLowerCase().includes(this.filters.apellidos.toLowerCase())) &&
        (!this.filters.fechaNacimiento || (paciente.fechaNacimiento || '').toLowerCase().includes(this.filters.fechaNacimiento.toLowerCase())) &&
        (!this.filters.genero || (paciente.genero || '').toLowerCase().includes(this.filters.genero.toLowerCase())) &&
        (!this.filters.telefono || (paciente.telefono || '').toString().includes(this.filters.telefono)) &&
        (!this.filters.direccion || (paciente.direccion || '').toLowerCase().includes(this.filters.direccion.toLowerCase()));
    });
  }

  private initializeTooltips() {
    try {
      const tooltipTriggerList = Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
      tooltipTriggerList.forEach((tooltipTriggerEl) => {
        const bootstrapGlobal = (window as any).bootstrap;
        if (bootstrapGlobal) {
          new bootstrapGlobal.Tooltip(tooltipTriggerEl);
        }
      });
    } catch (error) {
      console.warn('No se pudieron inicializar tooltips:', error);
    }
  }
}
