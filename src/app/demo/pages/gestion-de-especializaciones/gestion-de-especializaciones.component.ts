import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Modal } from 'bootstrap';
import Swal from 'sweetalert2';

//objetos
import { CommonModule } from '@angular/common';
import { EspecializacionRs } from './model/especializacionRs';
import { GestionDeEspecializacionesService } from './service/gestion-de-especializaciones.service';
@Component({
  selector: 'app-gestion-de-especializaciones',
  imports: [CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './gestion-de-especializaciones.component.html',
  styleUrl: './gestion-de-especializaciones.component.scss'
})
export class GestionDeEspecializacionesComponent {

  // variables para manipular en el modal
  modalInstance: Modal | null = null;
  modoFormulario: string = '';
  titleModal: string = '';
  titleBoton: string = '';

  especializacionList: EspecializacionRs[] = [];
  especializacionSelected!: EspecializacionRs;

  fechaActual = new Date();
  isLoading = false;
  //luego si es necesario implementamos los filtros

  // Contenedor de los campos del formulario
  form: FormGroup = new FormGroup({
  // Campos de la especialización
  nombre: new FormControl(''),
  descripcion: new FormControl(''),
  codigoEspecializacion: new FormControl('')
});
 
 //Constructor para inyectar
 constructor(
  private readonly especializacionService: GestionDeEspecializacionesService,
  private readonly formBuilder: FormBuilder
 ){
  //inyectar servicos
  this.listarEspecializaciones();
  this.inicializarFormulario();
 }
 //Logica de Negocio
listarEspecializaciones() {
  console.log(' Entró a cargar especializaciones');

  // Activamos el spinner
  this.isLoading = true;

  this.especializacionService.listarEspecializaciones().subscribe({
    next: (data: EspecializacionRs[]) => {
      this.especializacionList = data;
      this.isLoading = false; // Apagamos el spinner
    },
    error: (err) => {
      this.isLoading = false; // Apagamos el spinner si hay error
      console.error(' Error al cargar especializaciones', err);
    }
  });
}
//guardarEspecializacion 
guardarEspecializacion() {
  if (this.form.valid) {
    this.isLoading = true; // Activar spinner

    const formValue = this.form.value;

    //  Mapeo de datos (camelCase como espera el backend)
    const especializacionData = {
      nombre: formValue.nombre,
      descripcion: formValue.descripcion,
      codigoEspecializacion: formValue.codigoEspecializacion
    };

    // Llamar al servicio
    this.especializacionService.crearEspecializacion(especializacionData).subscribe({
      next: (response) => {
        this.isLoading = false; // Desactivar spinner
        Swal.fire({
          title: '¡Éxito!',
          text: 'Especialización registrada correctamente',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        });
        this.closeModal();
        this.listarEspecializaciones(); // Recargar la lista
      },
      error: (err) => {
        this.isLoading = false; // Desactivar spinner
        Swal.fire({
          title: 'Error',
          text: 'No se pudo registrar la especialización',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
        console.error(' Error al crear especialización', err);
      }
    });
  } else {
    // Validaciones del formulario
    Swal.fire({
      title: 'Formulario incompleto',
      text: 'Por favor completa todos los campos requeridos',
      icon: 'warning',
      confirmButtonText: 'Aceptar'
    });
  }
}
 //actualizar especializacion
 // Actualizar especialización
actualizarEspecializacion() {
  if (this.form.valid && this.especializacionSelected?.id) {
    this.isLoading = true; // Activar spinner

    const body = {
      nombre: this.form.value.nombre,
      descripcion: this.form.value.descripcion,
      codigoEspecializacion: this.form.value.codigoEspecializacion
    };

    this.especializacionService.actualizarEspecializacion(this.especializacionSelected.id, body).subscribe({
      next: (response) => {
        this.isLoading = false; // Desactivar spinner

        Swal.fire({
          title: '¡Actualizado!',
          text: 'La especialización fue actualizada correctamente',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        });

        this.closeModal();           // Cerrar el modal
        this.listarEspecializaciones(); // Refrescar la tabla
      },
      error: (err) => {
        this.isLoading = false; // Desactivar spinner

        Swal.fire({
          title: 'Error',
          text: 'No se pudo actualizar la especialización',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });

        console.error(' Error al actualizar especialización', err);
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

//Logica del Formulario
inicializarFormulario() {
  this.form = this.formBuilder.group({
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    descripcion: ['', [Validators.required, Validators.minLength(5)]],
    codigoEspecializacion: ['', [Validators.required, Validators.minLength(4)]]
  });
}
//acceder al formulario
   get f(): {[key: string]: AbstractControl} {
  return this.form.controls;
  }
  //Limpiar el formulario
 limpiarFormulario(){
  this.form.reset();
  this.form.markAsPristine();
  this.form.markAsUntouched();
}
abrirNuevaEspecializacion() {
  this.especializacionSelected = new EspecializacionRs(); // crea un objeto vacío
  this.limpiarFormulario(); // limpia los campos del formulario
  this.openModal('C'); // abre el modal en modo "Crear"
}

// Lógica para editar los campos en el formulario
abrirEditarEspecializacion(especializacion: EspecializacionRs) {
  this.limpiarFormulario(); // Limpia cualquier dato previo
  this.especializacionSelected = especializacion; // Guarda la especialización actual

  // Pre-cargamos los valores de la especialización en el formulario
  this.form.patchValue({
    nombre: especializacion.nombre,
    descripcion: especializacion.descripcion,
    codigoEspecializacion: especializacion.codigoEspecializacion
  });

  // Abre el modal en modo edición
  this.openModal('E');
}

// Método para abrir el modal
openModal(modo: string) {
  // Definir títulos dinámicamente según el modo
  this.titleModal = modo === 'C' ? 'Crear Especialización' : 'Editar Especialización';
  this.titleBoton = modo === 'C' ? 'Guardar Especialización' : 'Actualizar Especialización';
  this.modoFormulario = modo;

  // Obtener el elemento del modal por su ID
  const modalElement = document.getElementById('modalEspecializacion');

  if (modalElement) {
    this.modalInstance ??= new Modal(modalElement);
    this.modalInstance.show();
  }
}
  //Usamos Track id luego para la actualizacion
  trackById(index: number, item: any) { 
  return item.id; 
  }
  // Manejamos el envío del formulario
onSubmit() {
  if (this.modoFormulario === 'C') {
    // Crear nueva especialización
    this.guardarEspecializacion();
  } else if (this.modoFormulario === 'E') {
    // Actualizar especialización existente
    this.actualizarEspecializacion();
  }
}

// Método para cerrar el modal
closeModal() {
  if (this.modalInstance) {
    this.modalInstance.hide();
  }
}




}
