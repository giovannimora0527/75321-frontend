import { Component, AfterViewInit } from '@angular/core';
import { RecetaService } from './service/formula.service';
import { Formula } from './models/formula';
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
  selector: 'app-formula',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgxSpinnerModule],
  templateUrl: './formula.component.html',
  styleUrl: './formula.component.scss'
})
export class FormulaComponent implements AfterViewInit {
  modalInstance: Modal | null = null;
  modoFormulario: string = '';
  titleModal: string = '';
  titleBoton: string = '';
  
  // Lista original de fórmulas médicas (sin modificar)
  formulaList: Formula[] = [];
  
  // Lista filtrada que se muestra en la tabla
  formulaListFiltrada: Formula[] = [];
  
  formulaSelected: Formula;
  titleSpinner: string = 'Cargando...';
  
  // Objeto que contiene todos los filtros
  filtros = {
    id: '',
    citaId: '',
    medicamentoId: '',
    dosis: '',
    indicaciones: '',
    fechaCreacionRegistro: ''
  };
  
  form: FormGroup = new FormGroup({
    citaId: new FormControl(''),
    medicamentoId: new FormControl(''),
    dosis: new FormControl(''),
    indicaciones: new FormControl('')
  });
  
  constructor(
    private readonly recetaService: RecetaService,
    private readonly formBuilder: FormBuilder,
    private readonly spinner: NgxSpinnerService
  ) {
    this.formulaSelected = new Formula();
    this.listarTodasLasRecetas();
    this.inicializarFormulario();
  }
  
  ngAfterViewInit() {
    this.initializeTooltips();
  }
  
  inicializarFormulario() {
    this.form = this.formBuilder.group({
      citaId: ['', [Validators.required]],
      medicamentoId: ['', [Validators.required]],
      dosis: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(255)]],
      indicaciones: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(500)]]
    });
  }
  
  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }
  
  listarTodasLasRecetas() {
    this.spinner.show();
    this.recetaService.listarTodasLasRecetas().subscribe({
      next: (data) => {
        this.spinner.hide();
        this.formulaList = data;
        // Inicializar la lista filtrada con todas las fórmulas
        this.formulaListFiltrada = [...this.formulaList];
      },
      error: (error) => {
        this.spinner.hide();
        console.error('Error al cargar fórmulas médicas: ', error);
      }
    });
  }
  
  /**
   * Aplica los filtros a la lista de fórmulas médicas
   * Se ejecuta cada vez que cambia un valor en los inputs de filtro
   */
  aplicarFiltros() {
    this.formulaListFiltrada = this.formulaList.filter(formula => {
      // Filtro por ID
      const cumpleId = !this.filtros.id || 
        formula.id.toString().includes(this.filtros.id);
      
      // Filtro por Cita ID
      const cumpleCitaId = !this.filtros.citaId || 
        formula.cita.id.toString().includes(this.filtros.citaId);
      
      // Filtro por Medicamento ID
      const cumpleMedicamentoId = !this.filtros.medicamentoId || 
        formula.medicamento.id.toString().includes(this.filtros.medicamentoId);
      
      // Filtro por Dosis (búsqueda parcial, case insensitive)
      const cumpleDosis = !this.filtros.dosis || 
        formula.dosis.toLowerCase().includes(this.filtros.dosis.toLowerCase());
      
      // Filtro por Indicaciones (búsqueda parcial, case insensitive)
      const cumpleIndicaciones = !this.filtros.indicaciones || 
        formula.indicaciones.toLowerCase().includes(this.filtros.indicaciones.toLowerCase());
      
      // Filtro por Fecha de Creación (exacta)
      const cumpleFecha = !this.filtros.fechaCreacionRegistro || 
        this.formatearFecha(formula.fechaCreacionRegistro) === this.filtros.fechaCreacionRegistro;
      
      // La fórmula debe cumplir TODOS los filtros activos
      return cumpleId && cumpleCitaId && cumpleMedicamentoId && cumpleDosis && 
             cumpleIndicaciones && cumpleFecha;
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
      citaId: '',
      medicamentoId: '',
      dosis: '',
      indicaciones: '',
      fechaCreacionRegistro: ''
    };
    this.formulaListFiltrada = [...this.formulaList];
  }
  
  closeModal() {
    this.limpiarFormulario();
    this.formulaSelected = new Formula();
    if (this.modalInstance) {
      this.modalInstance.hide();
    }
  }
  
  openModal(modo: string) {
    this.titleModal = modo === 'C' ? 'Crear Fórmula Médica' : 'Editar Fórmula Médica';
    this.titleBoton = modo === 'C' ? 'Guardar Fórmula' : 'Actualizar Fórmula';
    this.modoFormulario = modo;
    const modalElement = document.getElementById('modalCrearFormula');
    if (modalElement) {
      this.modalInstance ??= new Modal(modalElement);
      this.modalInstance.show();
    }
  }
  
  abrirNuevaFormula() {
    this.formulaSelected = new Formula();
    this.limpiarFormulario();
    this.openModal('C');
  }
  
  limpiarFormulario() {
    this.form.reset();
    this.form.markAsPristine();
    this.form.markAsUntouched();
  }
  
  abrirEditarFormula(formula: Formula) {
    this.formulaSelected = formula;
    this.form.patchValue({
      citaId: formula.cita.id,
      medicamentoId: formula.medicamento.id,
      dosis: formula.dosis,
      indicaciones: formula.indicaciones
    });
    this.openModal('E');
  }
  
  guardarFormula() {
    this.spinner.show();
    if (this.form.invalid) {
      this.spinner.hide();
      Swal.fire('Error', 'Por favor complete todos los campos requeridos', 'error');
      return;
    }
    
    if (this.modoFormulario === 'C') {
      this.recetaService.guardarReceta(this.form.getRawValue()).subscribe({
        next: (data) => {
          this.spinner.hide();
          Swal.fire('Éxito', data.mensaje, 'success');
          this.closeModal();
          this.listarTodasLasRecetas();
        },
        error: (error) => {
          this.spinner.hide();
          console.error('Error al guardar fórmula médica: ', error);
          Swal.fire('Error', error.error.message || 'Error al guardar', 'error');
        }
      });
    } else {
      const formulaActualizar = { 
        id: this.formulaSelected.id,
        ...this.form.value 
      };
      this.recetaService.actualizarReceta(formulaActualizar).subscribe({
        next: (data) => {
          this.spinner.hide();
          Swal.fire('Éxito', data.mensaje, 'success');
          this.closeModal();
          this.listarTodasLasRecetas();
        },
        error: (error) => {
          this.spinner.hide();
          console.error('Error al actualizar fórmula médica: ', error);
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
