import { Component, AfterViewInit } from '@angular/core';
import { EspecializacionService } from './service/especializacion.service';
import { Especializacion } from './models/especializacion';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import Modal from 'bootstrap/js/dist/modal';

@Component({
  selector: 'app-especializacion',
  imports: [CommonModule, FormsModule, NgxSpinnerModule],
  templateUrl: './especializacion.component.html',
  styleUrl: './especializacion.component.scss'
})
export class EspecializacionComponent implements AfterViewInit {
  especializacionList: Especializacion[] = [];
  especializacionListFiltrada: Especializacion[] = [];
  especializacionSeleccionada: Especializacion | null = null;
  modalCrearInstance: Modal | null = null;
  modalEditarInstance: Modal | null = null;
  titleSpinner: string = 'Cargando...';

  filtros = {
    id: '',
    codigoEspecializacion: '',
    nombre: '',
    descripcion: ''
  };

  nuevaEspecializacion: Especializacion = {
    id: 0,
    nombre: '',
    descripcion: '',
    codigoEspecializacion: ''
  };

  constructor(
    private readonly especializacionService: EspecializacionService,
    private readonly spinner: NgxSpinnerService
  ) {
    this.listarEspecializaciones();
  }

  ngAfterViewInit() {
    this.initializeTooltips();
  }

  listarEspecializaciones() {
    this.spinner.show();
    this.especializacionService.listarEspecializaciones().subscribe({
      next: (data) => {
        this.spinner.hide();
        console.log(data);
        this.especializacionList = data;
        this.especializacionListFiltrada = [...this.especializacionList];
        setTimeout(() => this.initializeTooltips(), 0);
      },
      error: (error) => {
        this.spinner.hide();
        console.error('Error fetching especializaciones:', error);
      }
    });
  }

  /**
   * Aplica los filtros a la lista de especializaciones
   */
  aplicarFiltros() {
    this.especializacionListFiltrada = this.especializacionList.filter((esp) => {
      const cumpleId = !this.filtros.id || esp.id.toString().includes(this.filtros.id);
      const cumpleCodigo = !this.filtros.codigoEspecializacion ||
        esp.codigoEspecializacion.toLowerCase().includes(this.filtros.codigoEspecializacion.toLowerCase());
      const cumpleNombre = !this.filtros.nombre ||
        esp.nombre.toLowerCase().includes(this.filtros.nombre.toLowerCase());
      const cumpleDescripcion = !this.filtros.descripcion ||
        (esp.descripcion && esp.descripcion.toLowerCase().includes(this.filtros.descripcion.toLowerCase()));
      
      return cumpleId && cumpleCodigo && cumpleNombre && cumpleDescripcion;
    });
  }

  /**
   * Limpia todos los filtros
   */
  limpiarFiltros() {
    this.filtros = {
      id: '',
      codigoEspecializacion: '',
      nombre: '',
      descripcion: ''
    };
    this.especializacionListFiltrada = [...this.especializacionList];
  }

  abrirModalCrear() {
    this.limpiarFormulario();
    const modalElement = document.getElementById('modalCrear');
    if (modalElement) {
      this.modalCrearInstance ??= new Modal(modalElement);
      this.modalCrearInstance.show();
    }
  }

  crearEspecializacion() {
    this.spinner.show();
    this.especializacionService.crear(this.nuevaEspecializacion).subscribe({
      next: (data) => {
        this.spinner.hide();
        console.log('Especialización creada:', data);
        this.listarEspecializaciones();
        this.limpiarFormulario();
        this.closeModal('modalCrear');
        
        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: 'La especialización se ha creado con éxito.',
          confirmButtonText: 'OK',
          confirmButtonColor: '#0d6efd'
        });
      },
      error: (error) => {
        this.spinner.hide();
        console.error('Error creando especialización:', error);
        const mensaje = error.error?.message || error.message || 'Error desconocido';
        
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: `Error al crear la especialización: ${mensaje}`,
          confirmButtonText: 'OK',
          confirmButtonColor: '#dc3545'
        });
      }
    });
  }

  seleccionarParaEditar(especializacion: Especializacion) {
    this.especializacionSeleccionada = { ...especializacion };
    
    // Abrir el modal de editar
    const modalElement = document.getElementById('modalEditar');
    if (modalElement) {
      this.modalEditarInstance ??= new Modal(modalElement);
      this.modalEditarInstance.show();
    }
  }

  actualizarEspecializacion() {
    if (!this.especializacionSeleccionada) return;
    
    this.spinner.show();
    this.especializacionService
      .actualizar(this.especializacionSeleccionada.id, this.especializacionSeleccionada)
      .subscribe({
        next: (data) => {
          this.spinner.hide();
          console.log('Especialización actualizada:', data);
          this.listarEspecializaciones();
          this.especializacionSeleccionada = null;
          this.closeModal('modalEditar');
          
          Swal.fire({
            icon: 'success',
            title: 'Éxito',
            text: 'La especialización se ha actualizado con éxito.',
            confirmButtonText: 'OK',
            confirmButtonColor: '#0d6efd'
          });
        },
        error: (error) => {
          this.spinner.hide();
          console.error('Error actualizando especialización:', error);
          const mensaje = error.error?.message || error.message || 'Error desconocido';
          
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: `Error al actualizar la especialización: ${mensaje}`,
            confirmButtonText: 'OK',
            confirmButtonColor: '#dc3545'
          });
        }
      });
  }

  limpiarFormulario() {
    this.nuevaEspecializacion = {
      id: 0,
      nombre: '',
      descripcion: '',
      codigoEspecializacion: ''
    };
  }

  closeModal(modalId: string) {
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
      const modalInstance = modalId === 'modalCrear' ? this.modalCrearInstance : this.modalEditarInstance;
      if (modalInstance) {
        modalInstance.hide();
      }
    }
    
    // Limpiar especializacionSeleccionada si es el modal de editar
    if (modalId === 'modalEditar') {
      this.especializacionSeleccionada = null;
    }
  }

  private initializeTooltips() {
    try {
      const tooltipTriggerList = Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
      tooltipTriggerList.forEach((tooltipTriggerEl) => {
        const bootstrapGlobal = (window as unknown as { 
          bootstrap?: { Tooltip: new(element: Element) => void } 
        }).bootstrap;
        if (bootstrapGlobal) {
          new bootstrapGlobal.Tooltip(tooltipTriggerEl);
        }
      });
    } catch (error) {
      console.warn('Bootstrap tooltips could not be initialized:', error);
    }
  }
}