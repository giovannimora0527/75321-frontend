import { Component } from '@angular/core';
import { Modal } from 'bootstrap';
import Swal from 'sweetalert2';

//Importamos lo neceario para los formularios
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

// Importa los objetos necesarios de Bootstrap
import { CommonModule } from '@angular/common';
import { Formula } from './model/formula';
import { FormulaMedicasService } from './service/formula-medicas.service';

@Component({
  selector: 'app-formulas-medicas',
  imports: [CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './formulas-medicas.component.html',
  styleUrl: './formulas-medicas.component.scss'
})
export class FormulasMedicasComponent {

  //variables para manipular en el modal
  modalInstance:Modal |null=null;
  modoFormulario:string='';
  titleModal:string='';
  titleBoton='';
  formulaList: Formula[] = [];
  formulaSelected:Formula;
  fechaActual = new Date();
  isLoading = false;

    //Contenedor de los campos del formulario
    form:FormGroup=new FormGroup({

      //lo que se va inyectar en el formulario
      //Crear un campo Vacio
      citaid:new FormControl(''),
      medicamentoid:new FormControl(''),
      medicamentoNombre:new FormControl(''),
      dosis:new FormControl(''),
      indicaciones:new FormControl(''),
      fechaCreacionRegistro:new FormControl(''),
  
    })

    constructor(
      private readonly formulaService: FormulaMedicasService,
      private readonly formBuilder: FormBuilder
    ){
      this.ListarFormulas();
      this.inicializarFormulario();
    }

    //Logica De negocio
    ListarFormulas(){
      console.log('Entro a cargar usuarios');
    this.formulaService.listarFormulas().subscribe({
      next: (formula:Formula[]) => {
        this.formulaList = formula;
        
      },
      error: (err) => console.error('Error al cargar Formulas', err),
    });
    }

    //Logica de guardar  formula con sweet Alert
    guardarFormula() {
      if (this.form.valid) {
        this.isLoading = true; // ✅ Activar spinner
        
        const formValue = this.form.value;
    
        // 🔹 Mapear con camel case
        const formulaData = {
          citaId: this.form.value.citaid,
          medicamentoId: this.form.value.medicamentoid,
          dosis: this.form.value.dosis,
          indicaciones: this.form.value.indicaciones
        };
    
        this.formulaService.CrearFormulas(formulaData).subscribe({
          next: (response) => {
            this.isLoading = false; // ✅ Desactivar spinner
            //  Alerta de éxito
            Swal.fire({
              title: '¡Éxito!',
              text: 'Fórmula creada correctamente',
              icon: 'success',
              confirmButtonText: 'Aceptar'
            });
            this.closeModal();
            this.ListarFormulas();
          },
          error: (err) => {
            this.isLoading = false; //  Desactivar spinner
            //  Alerta de error
            Swal.fire({
              title: 'Error',
              text: 'No se pudo crear la fórmula',
              icon: 'error',
              confirmButtonText: 'Aceptar'
            });
            console.error('❌ Error al crear fórmula', err);
          }
        });
      } else {
        // Alerta de validación
        Swal.fire({
          title: 'Formulario incompleto',
          text: 'Por favor completa todos los campos requeridos',
          icon: 'warning',
          confirmButtonText: 'Aceptar'
        });
      }
    }
    //Metodo para actualizar la formula necesitamos el service.ts
    actualizarFormula() {
      if (this.form.valid && this.formulaSelected?.id) {
        this.isLoading = true;
    
        const body = {
          citaId: this.form.value.citaid,
          medicamentoId: this.form.value.medicamentoid,
          dosis: this.form.value.dosis,
          indicaciones: this.form.value.indicaciones
        };
    
        this.formulaService.ActualizarFormulas(this.formulaSelected.id, body).subscribe({
          next: (response) => {
            this.isLoading = false;
    
            Swal.fire({
              title: '¡Actualizado!',
              text: 'La fórmula fue actualizada correctamente',
              icon: 'success',
              confirmButtonText: 'Aceptar'
            });
    
            this.closeModal();
            this.ListarFormulas(); // Refrescamos lista
          },
          error: (err) => {
            this.isLoading = false;
    
            Swal.fire({
              title: 'Error',
              text: 'No se pudo actualizar la fórmula',
              icon: 'error',
              confirmButtonText: 'Aceptar'
            });
    
            console.error('❌ Error al actualizar fórmula', err);
          }
        });
      } else {
        Swal.fire({
          title: 'Formulario incompleto',
          text: 'Por favor completa todos los campos requeridos',
          icon: 'warning',
          confirmButtonText: 'Aceptar'
        });
      }
    }
    




    //Logica del formulario
    //Valida los cambios de Manera asincrona
    inicializarFormulario(){
      this.form = this.formBuilder.group({
        citaid: ['', [Validators.required]],
        medicamentoid: ['', [Validators.required]],
        medicamentoNombre: ['', [Validators.required, Validators.minLength(2)]],
        dosis: ['', [Validators.required, Validators.minLength(2)]],
        indicaciones: ['', [Validators.required, Validators.minLength(5)]],
        fechaCreacionRegistro: ['', [Validators.required]]
      });
    }
    //accder al formulario
    get f(): {[key: string]: AbstractControl} {
      return this.form.controls;
    }
    //Limpiar el formulario
    limpiarFormulario(){
      this.form.reset();
      this.form.markAsPristine();
      this.form.markAsUntouched();
    }
    //Implemenatcion de los metodos del modal
    abrirNuevaFormula() {
      this.formulaSelected = new Formula();
      this.limpiarFormulario();
      this.openModal('C');
    }
    
    abrirEditarFormula(formula: Formula) {
      this.limpiarFormulario();
      this.formulaSelected = formula;
      //Recordar que el codigo se ejecuta secuencial
      //Precargar los valores del cual vamos a editar
      this.form.patchValue({
        citaid: formula.citaid,
        medicamentoid: formula.medicamentoid,
        medicamentoNombre: formula.medicamentoNombre,
        dosis: formula.dosis,
        indicaciones: formula.indicaciones,
        fechaCreacionRegistro: formula.fechaCreacionRegistro
      });

      this.openModal('E');
    }

    // Método para abrir el modal
    openModal(modo: string) {
      this.titleModal = modo === 'C' ? 'Crear Fórmula' : 'Editar Fórmula';
      this.titleBoton = modo === 'C' ? 'Guardar Fórmula' : 'Actualizar Fórmula';
      this.modoFormulario = modo;
      const modalElement = document.getElementById('modalFormula');
      if (modalElement) {
        this.modalInstance ??= new Modal(modalElement);
        this.modalInstance.show();
      }
    }
    //Usamos Track id luego para la actualizacion
    trackById(index: number, item: any) { 
      return item.id; 
    }
    //Manejamos el envio del formulario
    onSubmit() {
      if (this.modoFormulario === 'C') {
        this.guardarFormula();  // 
      } else if (this.modoFormulario === 'E') {
        this.actualizarFormula();  //
      }
    }

    // Método para cerrar el modal
    closeModal() {
      if (this.modalInstance) {
        this.modalInstance.hide();
      }
    }

}