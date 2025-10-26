import { Component, AfterViewInit } from '@angular/core';
import { MedicamentoService } from './service/medicamento.service';
import { Medicamento } from './models/medicamento';
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
  selector: 'app-medicamento',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgxSpinnerModule],
  templateUrl: './medicamento.component.html',
  styleUrl: './medicamento.component.scss'
})
export class MedicamentoComponent implements AfterViewInit {
  modalInstance: Modal | null = null;
  modoFormulario: string = '';
  titleModal: string = '';
  titleBoton: string = '';
  
  // Lista original de medicamentos (sin modificar)
  medicamentoList: Medicamento[] = [];
  
  // Lista filtrada que se muestra en la tabla
  medicamentoListFiltrada: Medicamento[] = [];
  
  medicamentoSelected: Medicamento;
  titleSpinner: string = 'Cargando...';
  
  // Objeto que contiene todos los filtros
  filtros = {
    id: '',
    nombre: '',
    descripcion: '',
    presentacion: '',
    fechaCompra: '',
    fechaVence: '',
    fechaCreacionRegistro: '',
    fechaModificacionRegistro: ''
  };
  
  form: FormGroup = new FormGroup({
    nombre: new FormControl(''),
    descripcion: new FormControl(''),
    presentacion: new FormControl(''),
    fechaCompra: new FormControl(''),
    fechaVence: new FormControl('')
  });
  
  constructor(
    private readonly medicamentoService: MedicamentoService,
    private readonly formBuilder: FormBuilder,
    private readonly spinner: NgxSpinnerService
  ) {
    this.medicamentoSelected = new Medicamento();
    this.listarMedicamentos();
    this.inicializarFormulario();
  }
  
  ngAfterViewInit() {
    this.initializeTooltips();
  }
  
  inicializarFormulario() {
    this.form = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      descripcion: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(500)]],
      presentacion: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      fechaCompra: ['', [Validators.required]],
      fechaVence: ['', [Validators.required]]
    });
  }
  
  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }
  
  listarMedicamentos() {
    this.spinner.show();
    this.medicamentoService.listarMedicamentos().subscribe({
      next: (data) => {
        this.spinner.hide();
        this.medicamentoList = data;
        // Inicializar la lista filtrada con todos los medicamentos
        this.medicamentoListFiltrada = [...this.medicamentoList];
      },
      error: (error) => {
        this.spinner.hide();
        console.error('Error al cargar medicamentos: ', error);
      }
    });
  }
  
  /**
   * Aplica los filtros a la lista de medicamentos
   * Se ejecuta cada vez que cambia un valor en los inputs de filtro
   */
  aplicarFiltros() {
    this.medicamentoListFiltrada = this.medicamentoList.filter(medicamento => {
      // Filtro por ID
      const cumpleId = !this.filtros.id || 
        medicamento.id.toString().includes(this.filtros.id);
      
      // Filtro por Nombre (búsqueda parcial, case insensitive)
      const cumpleNombre = !this.filtros.nombre || 
        medicamento.nombre.toLowerCase().includes(this.filtros.nombre.toLowerCase());
      
      // Filtro por Descripción (búsqueda parcial, case insensitive)
      const cumpleDescripcion = !this.filtros.descripcion || 
        medicamento.descripcion.toLowerCase().includes(this.filtros.descripcion.toLowerCase());
      
      // Filtro por Presentación (búsqueda parcial, case insensitive)
      const cumplePresentacion = !this.filtros.presentacion || 
        medicamento.presentacion.toLowerCase().includes(this.filtros.presentacion.toLowerCase());
      
      // Filtro por Fecha de Compra (exacta)
      const cumpleFechaCompra = !this.filtros.fechaCompra || 
        this.formatearFecha(medicamento.fechaCompra) === this.filtros.fechaCompra;
      
      // Filtro por Fecha de Vencimiento (exacta)
      const cumpleFechaVence = !this.filtros.fechaVence || 
        this.formatearFecha(medicamento.fechaVence) === this.filtros.fechaVence;
      
      // Filtro por Fecha de Creación (exacta)
      const cumpleFechaCreacion = !this.filtros.fechaCreacionRegistro || 
        this.formatearFecha(medicamento.fechaCreacionRegistro) === this.filtros.fechaCreacionRegistro;
      
      // Filtro por Fecha de Modificación (exacta)
      const cumpleFechaModificacion = !this.filtros.fechaModificacionRegistro || 
        (medicamento.fechaModificacionRegistro && 
         this.formatearFecha(medicamento.fechaModificacionRegistro) === this.filtros.fechaModificacionRegistro);
      
      // El medicamento debe cumplir TODOS los filtros activos
      return cumpleId && cumpleNombre && cumpleDescripcion && cumplePresentacion && 
             cumpleFechaCompra && cumpleFechaVence && cumpleFechaCreacion && cumpleFechaModificacion;
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
      nombre: '',
      descripcion: '',
      presentacion: '',
      fechaCompra: '',
      fechaVence: '',
      fechaCreacionRegistro: '',
      fechaModificacionRegistro: ''
    };
    this.medicamentoListFiltrada = [...this.medicamentoList];
  }
  
  closeModal() {
    this.limpiarFormulario();
    this.medicamentoSelected = new Medicamento();
    if (this.modalInstance) {
      this.modalInstance.hide();
    }
  }
  
  openModal(modo: string) {
    this.titleModal = modo === 'C' ? 'Crear Medicamento' : 'Editar Medicamento';
    this.titleBoton = modo === 'C' ? 'Guardar Medicamento' : 'Actualizar Medicamento';
    this.modoFormulario = modo;
    const modalElement = document.getElementById('modalCrearMedicamento');
    if (modalElement) {
      this.modalInstance ??= new Modal(modalElement);
      this.modalInstance.show();
    }
  }
  
  abrirNuevoMedicamento() {
    this.medicamentoSelected = new Medicamento();
    this.limpiarFormulario();
    this.openModal('C');
  }
  
  limpiarFormulario() {
    this.form.reset();
    this.form.markAsPristine();
    this.form.markAsUntouched();
  }
  
  abrirEditarMedicamento(medicamento: Medicamento) {
    this.medicamentoSelected = medicamento;
    this.form.patchValue({
      nombre: medicamento.nombre,
      descripcion: medicamento.descripcion,
      presentacion: medicamento.presentacion,
      fechaCompra: this.formatearFecha(medicamento.fechaCompra),
      fechaVence: this.formatearFecha(medicamento.fechaVence)
    });
    this.openModal('E');
  }
  
  guardarMedicamento() {
    this.spinner.show();
    if (this.form.invalid) {
      this.spinner.hide();
      Swal.fire('Error', 'Por favor complete todos los campos requeridos', 'error');
      return;
    }
    
    if (this.modoFormulario === 'C') {
      this.medicamentoService.guardarMedicamento(this.form.getRawValue()).subscribe({
        next: (data) => {
          this.spinner.hide();
          Swal.fire('Éxito', data.mensaje, 'success');
          this.closeModal();
          this.listarMedicamentos();
        },
        error: (error) => {
          this.spinner.hide();
          console.error('Error al guardar medicamento: ', error);
          Swal.fire('Error', error.error.message || 'Error al guardar', 'error');
        }
      });
    } else {
      const medicamentoActualizar = { 
        id: this.medicamentoSelected.id,
        ...this.form.value 
      };
      this.medicamentoService.actualizarMedicamento(medicamentoActualizar).subscribe({
        next: (data) => {
          this.spinner.hide();
          Swal.fire('Éxito', data.mensaje, 'success');
          this.closeModal();
          this.listarMedicamentos();
        },
        error: (error) => {
          this.spinner.hide();
          console.error('Error al actualizar medicamento: ', error);
          Swal.fire('Error', error.error.message || 'Error al actualizar', 'error');
        }
      });
    }
  }
  
  /**
   * Initialize Bootstrap tooltips
   */
  private initializeTooltips() {
    try {
      const tooltipTriggerList = Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
      tooltipTriggerList.forEach((tooltipTriggerEl) => {
        const bootstrapGlobal = (window as unknown as { bootstrap?: { Tooltip: new(element: Element) => void } }).bootstrap;
        if (bootstrapGlobal) {
          new bootstrapGlobal.Tooltip(tooltipTriggerEl);
        }
      });
    } catch (error) {
      console.warn('Bootstrap tooltips could not be initialized:', error);
    }
  }
}