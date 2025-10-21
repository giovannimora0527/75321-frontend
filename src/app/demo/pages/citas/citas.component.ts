import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Modal } from 'bootstrap';

import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
//Importaciones especificas
import { Cita } from './model/cita';
import { CitasService } from './service/citas.service';

@Component({
  selector: 'app-citas',
  imports: [CommonModule],
  templateUrl: './citas.component.html',
  styleUrl: './citas.component.scss'
})
export class CitasComponent {
  //Variables para manipular el modal
  modalInstance:Modal |null=null;
  modoFormulario:string='';
  titleModal:string='';
  titleBoton='';
  citasList: Cita[] = [];
  citaSelected:Cita;
  fechaActual = new Date();

  //lo que vamos inyectar en el formulario para citas
  form:FormGroup=new FormGroup({

    //lo que se va inyectar en el formulario
    //Crear un campo Vacio
    pacienteDocumento:new FormControl(''),
    pacienteNombre:new FormControl(''),
    medicoId:new FormControl(''),
    medicoNombre:new FormControl(''),
    fechaHora:new FormControl(''),
    estado:new FormControl(''),
    motivo:new FormControl(''),

  })
  constructor(
    private readonly citasService:CitasService,
    private readonly formBuilder:FormBuilder
  ){
    this.listarCitas();
    this.inicializarFormulario();


  }
  //Metodos logica del Negocio

  listarCitas(){
    console.log('Entro a cargar citas');
    this.citasService.listarCitas().subscribe({
      next:(citas:Cita[])=>{
        this.citasList=citas;
      },
      error:(err)=>console.error('Error al cargar citas',err),
    });
  }
  //Logica Para abrir el Modal

  //Inicializamos los campos 
  inicializarFormulario(){
    this.form=this.formBuilder.group({
      pacienteDocumento:['',[Validators.required,Validators.minLength(6),Validators.maxLength(15)]],
      pacienteNombre:['',[Validators.required,Validators.minLength(2),Validators.maxLength(100)]],
      medicoId:['',[Validators.required]],
      medicoNombre:['',[Validators.required,Validators.minLength(2),Validators.maxLength(100)]],
      fechaHora:['',[Validators.required]],
      estado:['',[Validators.required]],
      motivo:['',[Validators.required,Validators.minLength(10),Validators.maxLength(200)]],
    });
  }
  //acceder mas rapido en el template
  get f():{[key:string]:AbstractControl}{
    return this.form.controls;
     }
  //abrir modal y cerrar
  claseModal(){
    if(this.modalInstance){
      this.modalInstance.hide();
    }
  }

  closeModal() {
    if (this.modalInstance) {
      this.modalInstance.hide();
    }
  }

  // Métodos para manejar citas
  abrirNuevaCita() {
    this.modoFormulario = 'crear';
    this.titleModal = 'Nueva Cita';
    this.titleBoton = 'Crear Cita';
    this.citaSelected = new Cita();
    this.form.reset();
    // Aquí puedes abrir el modal
    console.log('Abrir modal para nueva cita');
  }

  abrirEditarCita(cita: Cita) {
    this.modoFormulario = 'editar';
    this.titleModal = 'Editar Cita';
    this.titleBoton = 'Actualizar Cita';
    this.citaSelected = cita;
    this.cargarDatosEnFormulario(cita);
    // Aquí puedes abrir el modal
    console.log('Abrir modal para editar cita:', cita);
  }

  cargarDatosEnFormulario(cita: Cita) {
    this.form.patchValue({
      pacienteDocumento: cita.pacienteDocumento,
      pacienteNombre: cita.pacienteNombre,
      medicoId: cita.medicoId,
      medicoNombre: cita.medicoNombre,
      fechaHora: cita.fechaHora,
      estado: cita.estado,
      motivo: cita.motivo
    });
  }

}
