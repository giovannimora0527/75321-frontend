/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, AfterViewInit } from '@angular/core';
import { EspecializacionService } from './service/especializacion.service';
import { Especializacion } from './models/especializacion';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

@Component({
  selector: 'app-especializacion',
  imports: [CommonModule, FormsModule],
  templateUrl: './especializacion.component.html',
  styleUrl: './especializacion.component.scss'
})
export class EspecializacionComponent implements AfterViewInit {
  especializacionList: Especializacion[] = [];
  especializacionSeleccionada: Especializacion | null = null;
  modoEdicion: boolean = false;

  // Formulario
  nuevaEspecializacion: Especializacion = {
    id: 0,
    nombre: '',
    descripcion: '',
    codigoEspecializacion: ''
  };

  constructor(private readonly especializacionService: EspecializacionService) {
    this.listarEspecializaciones();
  }

  ngAfterViewInit() {
    this.initializeTooltips();
  }

  listarEspecializaciones() {
    this.especializacionService.listarEspecializaciones().subscribe({
      next: (data) => {
        console.log(data);
        this.especializacionList = data;
        setTimeout(() => this.initializeTooltips(), 0);
      },
      error: (error) => {
        console.error('Error fetching especializaciones:', error);
      }
    });
  }

  crearEspecializacion() {
    this.especializacionService.crear(this.nuevaEspecializacion).subscribe({
      next: (data) => {
        console.log('Especialización creada:', data);
        this.listarEspecializaciones();
        this.limpiarFormulario();

        // PRIMERO cerrar el modal
        this.cerrarModal('modalCrear');

        // LUEGO limpiar todos los backdrops
        this.limpiarBackdrops();

        // FINALMENTE mostrar el SweetAlert
        setTimeout(() => {
          Swal.fire({
            icon: 'success',
            title: 'Éxito',
            text: 'La especialización se ha creado con éxito.',
            confirmButtonText: 'OK',
            confirmButtonColor: '#0d6efd'
          });
        }, 300);
      },
      error: (error) => {
        console.error('Error creando especialización:', error);
        const mensaje = error.error?.message || error.message || 'Error desconocido';

        // Cerrar modal y limpiar backdrop
        this.cerrarModal('modalCrear');
        this.limpiarBackdrops();

        setTimeout(() => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: `Error al crear la especialización: ${mensaje}`,
            confirmButtonText: 'OK',
            confirmButtonColor: '#dc3545'
          });
        }, 300);
      }
    });
  }

  seleccionarParaEditar(especializacion: Especializacion) {
    this.especializacionSeleccionada = { ...especializacion };
    this.modoEdicion = true;
  }

  actualizarEspecializacion() {
    if (this.especializacionSeleccionada) {
      this.especializacionService
        .actualizar(this.especializacionSeleccionada.id, this.especializacionSeleccionada)
        .subscribe({
          next: (data) => {
            console.log('Especialización actualizada:', data);
            this.listarEspecializaciones();
            this.modoEdicion = false;
            this.especializacionSeleccionada = null;

            // PRIMERO cerrar el modal
            this.cerrarModal('modalEditar');

            // LUEGO limpiar todos los backdrops
            this.limpiarBackdrops();

            // FINALMENTE mostrar el SweetAlert
            setTimeout(() => {
              Swal.fire({
                icon: 'success',
                title: 'Éxito',
                text: 'La especialización se ha actualizado con éxito.',
                confirmButtonText: 'OK',
                confirmButtonColor: '#0d6efd'
              });
            }, 300);
          },
          error: (error) => {
            console.error('Error actualizando especialización:', error);
            const mensaje = error.error?.message || error.message || 'Error desconocido';

            // Cerrar modal y limpiar backdrop
            this.cerrarModal('modalEditar');
            this.limpiarBackdrops();

            setTimeout(() => {
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: `Error al actualizar la especialización: ${mensaje}`,
                confirmButtonText: 'OK',
                confirmButtonColor: '#dc3545'
              });
            }, 300);
          }
        });
    }
  }

  limpiarFormulario() {
    this.nuevaEspecializacion = {
      id: 0,
      nombre: '',
      descripcion: '',
      codigoEspecializacion: ''
    };
  }

  cerrarModal(modalId: string) {
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
      const bootstrapGlobal = (window as any).bootstrap;
      if (bootstrapGlobal) {
        const modal = bootstrapGlobal.Modal.getInstance(modalElement);
        if (modal) {
          modal.hide();
        }
      }
    }
  }

  /**
   * Limpia TODOS los backdrops y estilos de modales
   */
  limpiarBackdrops() {
    // Eliminar TODOS los backdrops del DOM
    const allBackdrops = document.querySelectorAll('.modal-backdrop');
    allBackdrops.forEach(backdrop => {
      backdrop.remove();
    });

    // Ocultar todos los modales
    const allModals = document.querySelectorAll('.modal');
    allModals.forEach(modal => {
      modal.classList.remove('show');
      (modal as HTMLElement).style.display = 'none';
      modal.setAttribute('aria-hidden', 'true');
      modal.removeAttribute('aria-modal');
    });

    // Limpiar estilos del body
    document.body.classList.remove('modal-open');
    document.body.style.removeProperty('padding-right');
    document.body.style.removeProperty('overflow');
    document.body.removeAttribute('data-bs-overflow');
    document.body.removeAttribute('data-bs-padding-right');
  }

  private initializeTooltips() {
    try {
      const tooltipTriggerList = Array.from(
        document.querySelectorAll('[data-bs-toggle="tooltip"]')
      );
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
