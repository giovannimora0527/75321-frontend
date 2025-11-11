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

// Importa los objetos necesarios de Bootstrap
import { CommonModule } from '@angular/common';
import { MedicamentoRs } from './model/medicamentoRs';
import { MedicamentosService } from './service/medicamentos.service';


@Component({
  selector: 'app-medicamentos',
  imports: [CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './medicamentos.component.html',
  styleUrls: ['./medicamentos.component.scss']
})
export class MedicamentosComponent {

   //variables para manipular en el modal
   modalInstance:Modal |null=null;
   modoFormulario:string='';
   titleModal:string='';
   titleBoton='';
   medicamentoList: MedicamentoRs[] = [];
   medicamentoSelected:MedicamentoRs;
   fechaActual = new Date();
   isLoading = false;
   //Tabla de Filtros del formulario
   medicamentosFiltrados: MedicamentoRs[] = [];

  filtros = {
  id: '',
  nombre: '',
  presentacion: '',
  cantidad: '',
  fechaVencimiento: '',
};

   //Contenedor de los campos del formulario

   form: FormGroup = new FormGroup({
  // Campos del medicamento
  nombre: new FormControl(''),
  descripcion: new FormControl(''),
  presentacion: new FormControl(''),
  cantidad: new FormControl(''),
  fechaVencimiento: new FormControl('')
});

 constructor(
  private readonly medicamentoService: MedicamentosService,
  private readonly formBuilder: FormBuilder
 ){
  //inyectar servicios
 this.listarMedicamentos();
 this.inicializarFormulario();
 }

 //Logica de Negocio
 //ListarMedicamentos
 listarMedicamentos() {
  console.log('Entro a cargar medicamentos');
  // activamos el spinner
  this.isLoading = true;

  this.medicamentoService.listarMedicamentos().subscribe({
    next: (data: MedicamentoRs[]) => {
      this.medicamentoList = data;
      this.medicamentosFiltrados= [...data]; 
      this.isLoading = false;  //Apagamos el spinner
    },
    error: (err) => {
      this.isLoading = false; // Apagamos spinner también si hay error
      console.error('Error al cargar medicamentos', err);
    },
  });
}
//Guardar medicamento con spinner y sweet alert
guardarMedicamento() {
  if (this.form.valid) {
    this.isLoading = true; //  Activar spinner

    const formValue = this.form.value;

    //  Mapear los datos con camelCase (como espera el backend)
    const medicamentoData = {
      nombre: formValue.nombre,
      descripcion: formValue.descripcion,
      presentacion: formValue.presentacion,
      cantidad: formValue.cantidad,
      fechaVencimiento: formValue.fechaVencimiento
    };

    this.medicamentoService.crearMedicamento(medicamentoData).subscribe({
      next: (response) => {
        this.isLoading = false; //  Desactivar spinner
        Swal.fire({
          title: '¡Éxito!',
          text: 'Medicamento registrado correctamente',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        });
        this.closeModal();
        this.listarMedicamentos(); //  Recargar la lista
      },
      error: (err) => {
        this.isLoading = false; //  Desactivar spinner
        Swal.fire({
          title: 'Error',
          text: 'No se pudo registrar el medicamento',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
        console.error(' Error al crear medicamento', err);
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

// Actualizar medicamento
actualizarMedicamento() {
  if (this.form.valid && this.medicamentoSelected?.id) {
    this.isLoading = true;

    const body = {
      nombre: this.form.value.nombre,
      descripcion: this.form.value.descripcion,
      presentacion: this.form.value.presentacion,
      cantidad: this.form.value.cantidad,
      fechaVencimiento: this.form.value.fechaVencimiento
    };

    this.medicamentoService.actualizarMedicamento(this.medicamentoSelected.id, body).subscribe({
      next: (response) => {
        this.isLoading = false;

        Swal.fire({
          title: '¡Actualizado!',
          text: 'El medicamento fue actualizado correctamente',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        });

        this.closeModal();
        this.listarMedicamentos();
      },
      error: (err) => {
        this.isLoading = false;

        Swal.fire({
          title: 'Error',
          text: 'No se pudo actualizar el medicamento',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });

        console.error(' Error al actualizar medicamento', err);
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
inicializarFormulario() {
  this.form = this.formBuilder.group({
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    descripcion: ['', [Validators.required, Validators.minLength(5)]],
    presentacion: ['', [Validators.required, Validators.minLength(2)]],
    cantidad: [null, [Validators.required, Validators.min(1)]],
    fechaVencimiento: ['', [Validators.required]],
    //nuevo campo
    fechaCompra: ['', [Validators.required]],
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
abrirNuevoMedicamento() {
  this.medicamentoSelected = new MedicamentoRs(); // crea un nuevo objeto vacío
  this.limpiarFormulario(); // limpia los campos del formulario
  this.openModal('C'); // abre el modal en modo “Crear”
}

//Logica para editar los campos en el formulario
abrirEditarMedicamento(medicamento: MedicamentoRs) {
  this.limpiarFormulario(); // Limpia cualquier dato previo
  this.medicamentoSelected = medicamento; // Guarda el medicamento actual

  // Pre-cargamos los valores del medicamento en el formulario
  this.form.patchValue({
    nombre: medicamento.nombre,
    descripcion: medicamento.descripcion,
    presentacion: medicamento.presentacion,
    cantidad: medicamento.cantidad,
    fechaVencimiento: medicamento.fechaVencimiento
  });

  //  Abre el modal en modo edición
  this.openModal('E');
}

//  Método para abrir el modal
openModal(modo: string) {
  // Definir títulos dinámicamente según el modo
  this.titleModal = modo === 'C' ? 'Crear Medicamento' : 'Editar Medicamento';
  this.titleBoton = modo === 'C' ? 'Guardar Medicamento' : 'Actualizar Medicamento';
  this.modoFormulario = modo;

  // Obtener el elemento del modal por su ID
  const modalElement = document.getElementById('modalMedicamento');

  if (modalElement) {
    this.modalInstance ??= new Modal(modalElement);
    this.modalInstance.show();
  }
}
//Usamos Track id luego para la actualizacion
trackById(index: number, item: any) { 
  return item.id; 
}
//Metodo para aplicar los filtros
aplicarFiltros() {
  const { id, nombre, presentacion, cantidad, fechaVencimiento } = this.filtros;

  this.medicamentosFiltrados = this.medicamentoList.filter(m => {
    const matchId = id ? m.id?.toString().includes(id) : true;
    const matchNombre = nombre ? m.nombre?.toLowerCase().includes(nombre.toLowerCase()) : true;
    const matchPresentacion = presentacion ? m.presentacion?.toLowerCase().includes(presentacion.toLowerCase()) : true;
    const matchCantidad = cantidad ? m.cantidad?.toString().includes(cantidad) : true;
    const matchFecha = fechaVencimiento ? (m.fechaVencimiento || '').includes(fechaVencimiento) : true;

    return matchId && matchNombre && matchPresentacion && matchCantidad && matchFecha;
  });
}
//Limpiar los filtros
limpiarFiltros() {
  this.filtros = {
    id: '',
    nombre: '',
    presentacion: '',
    cantidad: '',
    fechaVencimiento: '',
  };
  this.medicamentosFiltrados = [...this.medicamentoList];
}


// Manejamos el envío del formulario
onSubmit() {
  if (this.modoFormulario === 'C') {
    // Crear nuevo medicamento
    this.guardarMedicamento();
  } else if (this.modoFormulario === 'E') {
    // Actualizar medicamento existente
    this.actualizarMedicamento();
  }
}
// Método para cerrar el modal
closeModal() {
  if (this.modalInstance) {
    this.modalInstance.hide();
  }
}



}
