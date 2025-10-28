import { Component } from '@angular/core';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';

import { CommonModule } from '@angular/common';
// Importa los objetos necesarios de Bootstrap
import Modal from 'bootstrap/js/dist/modal';

import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Formula } from './models/formula';
import { FormulaService } from './service/formula.service';

@Component({
  selector: 'app-formula',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgxSpinnerModule],
  templateUrl: './formula.component.html',
  styleUrl: './formula.component.scss'
})
export class FormulaComponent {
  modalInstance: Modal | null = null;
  modoFormulario: string = '';
  titleModal: string = '';
  titleBoton: string = '';
  formulaSelected: Formula;
  busqueda: string = '';

  formulaList: Formula[] = [];
  formulaListFiltered: Formula[] = [];
  titleSpinner: string = 'Cargando ...';

  /**
   * Formulario para crear/editar formulas medicas.
   */
  form: FormGroup = new FormGroup({
    citaId: new FormControl(null, [Validators.required]),
    medicamentoId: new FormControl(null, [Validators.required]),
    dosis: new FormControl('', [Validators.required]),
    indicaciones: new FormControl('', [Validators.required])
  });

  constructor(
    private readonly formulaService: FormulaService,
    private readonly formBuilder: FormBuilder,
    private readonly spinner: NgxSpinnerService
  ) {
    this.listarFormulas();
  }

  listarFormulas() {
    this.formulaService.listarRecetas().subscribe({
      next: (data) => {
        this.formulaList = data;
        this.formulaListFiltered = this.formulaList;
      },
      error: (error) => {
        console.error('Error fetching formulas:', error);
      }
    });
  }

  filtrarFormulas() {
    if (this.busqueda === '') {
      this.formulaListFiltered = this.formulaList;
      return;
    }
    console.log(this.busqueda);

    this.formulaListFiltered = this.formulaList.filter((formula) => {
      const busquedaLower = this.busqueda.toLowerCase();

      // Filtrar por dosis
      const dosisCumple = formula.dosis && formula.dosis.toLowerCase().includes(busquedaLower);

      // Filtrar por indicaciones
      const indicacionesCumple = formula.indicaciones && formula.indicaciones.toLowerCase().includes(busquedaLower);

      // Filtrar por número de documento del paciente
      const numeroDocumentoCumple =
        formula.cita?.paciente?.numeroDocmento && formula.cita.paciente.numeroDocmento.toLowerCase().includes(busquedaLower);

      // Filtrar por nombres del paciente
      const nombresCumple = formula.cita?.paciente?.nombres && formula.cita.paciente.nombres.toLowerCase().includes(busquedaLower);

      // Filtrar por apellidos del paciente
      const apellidosCumple = formula.cita?.paciente?.apellidos && formula.cita.paciente.apellidos.toLowerCase().includes(busquedaLower);

      // Filtrar por apellidos del paciente
      const fechasCumple = formula.cita?.fechaHora && formula.cita.fechaHora.toLowerCase().includes(busquedaLower);


      // Retorna true si cualquiera de los criterios se cumple
      return dosisCumple || indicacionesCumple || numeroDocumentoCumple || nombresCumple || apellidosCumple || fechasCumple;
    });
  }

  /**
   * Siempre va igual.
   */
  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  /**
   * Funcion para cerrar el modal.
   */
  closeModal() {
    this.limpiarFormulario();
    this.formulaSelected = new Formula();
    if (this.modalInstance) {
      this.modalInstance.hide();
    }
  }

  /**
   * Abre el modal para crear o editar un usuario.
   * @param modo 'C' para crear, 'E' para editar
   */
  openModal(modo: string) {
    this.titleModal = modo === 'C' ? 'Crear Usuario' : 'Editar Usuario';
    this.titleBoton = modo === 'C' ? 'Guardar Usuario' : 'Actualizar Usuario';
    this.modoFormulario = modo;
    const modalElement = document.getElementById('modalCrearUsuario');
    if (modalElement) {
      // Verificar si ya existe una instancia del modal
      this.modalInstance ??= new Modal(modalElement);
      this.modalInstance.show();
    }
  }

  /**
   * Abre el modal para crear una nueva formula.
   */
  abrirNuevoFormula() {
    this.formulaSelected = new Formula();
    // Dejamos el formulario en blanco
    this.limpiarFormulario();
    this.openModal('C');
  }

  /**
   * Limpia los campos del formulario.
   */
  limpiarFormulario() {
    this.form.reset();
    this.form.markAsPristine();
    this.form.markAsUntouched();
  }

  /**
   * Abre editar modal
   * @param formula
   */
  abrirEditarFormula(formula: Formula) {
    this.formulaSelected = formula;
    this.openModal('E');
  }

  guardarFormula() {}
}
