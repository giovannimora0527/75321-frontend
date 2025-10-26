import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Modal } from 'bootstrap';



import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { Paciente } from './models/paciente';
import { PacienteService } from './service/paciente.service';
@Component({
  selector: 'app-paciente',
  imports: [CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './paciente.component.html',
  styleUrl: './paciente.component.scss'
})
export class PacienteComponent implements OnInit {
  ngOnInit(): void {
    this.listarPacientes();
  }


  modalInstance:Modal |null=null;
  modoFormulario:string='';
  titleModal:string='';
  titleBoton='';
  pacientesList: Paciente[] = [];
  //agregamos los filtros de la tabla
  pacientesFiltrados: Paciente[] = [];
   filtros = {
    id: '',
    paciente: '',
    tipoDocumento: '',
    fechaNacimiento: '',
    telefono: ''
  };
  pacienteSelected:Paciente;
  fechaActual = new Date();

 //Formulario Reactivo es mas escalable angular escucha los cambios

  //Contenedor de los campos del formulario
  form:FormGroup=new FormGroup({

    //lo que se va inyectar en el formulario
    //Crear un campo Vacio
    tipoDocumento:new FormControl(''),
    numeroDocumento:new FormControl(''),
    nombres:new FormControl(''),
    apellidos:new FormControl(''),
    fechaNacimiento:new FormControl(''),
    genero:new FormControl(''),
    telefono:new FormControl(''),
    direccion:new FormControl(''),

  })
  constructor(
    private readonly pacienteService:PacienteService,
    private readonly formBuilder: FormBuilder


  ){
    
    this.inicializarFormulario();

  }

    inicializarFormulario(){
     this.form=this.formBuilder.group({
       tipoDocumento:['',[Validators.required]],
       numeroDocumento:['',[Validators.required,Validators.minLength(6),Validators.maxLength(15)]],
       nombres:['',[Validators.required,Validators.minLength(2),Validators.maxLength(50)]],
       apellidos:['',[Validators.required,Validators.minLength(2),Validators.maxLength(50)]],
       fechaNacimiento:['',[Validators.required]],
       genero:['',[Validators.required]],
       telefono:['',[Validators.required,Validators.minLength(7),Validators.maxLength(15)]],
       direccion:['',[Validators.required,Validators.minLength(10),Validators.maxLength(100)]],
     });

     }
//foma de acceder a los controles en el Html
  get f():{[key:string]:AbstractControl}{
  return this.form.controls;
   }

  // Método para limpiar el formulario
  limpiarFormulario(){
    this.form.reset();
    this.form.markAsPristine();
    this.form.markAsUntouched();
  }

  // Método para abrir nuevo paciente
  abrirNuevoPaciente() {
    this.pacienteSelected = {} as Paciente;
    this.limpiarFormulario();
    this.openModal('C');
  }

  // Método para abrir editar paciente
  abrirEditarPaciente(paciente: Paciente) {
    this.limpiarFormulario();
    this.pacienteSelected = paciente;
    this.openModal('E');
  }

  // Cerrar el modal
  closeModal() {
    if (this.modalInstance) {
      this.modalInstance.hide();
    }
  }

  listarPacientes(){
    console.log('Entro a cargar pacientes');
    this.pacienteService.listarPacientes().subscribe({
      next:(Paciente:Paciente[])=>{
        this.pacientesList=Paciente;
        //Otro metodo si es necesario
        //luego de listar podemos filtrarlos
        this.pacientesFiltrados = [...this.pacientesList];
      },
      error:(err)=>console.error('Error al cargar pacientes',err),
    });
  }
  //Logica del Filtrado de pacientes en la tabla
  aplicarFiltros() {
    const safe = (v: any) => (v === null || v === undefined ? '' : String(v));
    const f = {
      id: this.filtros.id.trim(),
      paciente: this.filtros.paciente.trim().toLowerCase(),
      tipoDocumento: this.filtros.tipoDocumento.trim().toLowerCase(),
      fechaNacimiento: this.filtros.fechaNacimiento.trim().toLowerCase(),
      telefono: this.filtros.telefono.trim().toLowerCase(),
    };

    // Si no hay filtros activos, mostrar todos los pacientes
    const hayFiltrosActivos = Object.values(f).some(valor => valor.length > 0);
    
    if (!hayFiltrosActivos) {
      this.pacientesFiltrados = [...this.pacientesList];
      return;
    }

    this.pacientesFiltrados = this.pacientesList.filter(p => {
      const id = safe(p.id);
      const nombreCompleto = `${safe(p.nombres)} ${safe(p.apellidos)}`.toLowerCase();
      const tipoDoc = safe(p.tipoDocumento).toLowerCase();
      const fechaNac = safe(p.fechaNacimiento).toLowerCase();
      const telefono = safe(p.telefono).toLowerCase();

      return (
        (!f.id || id.includes(f.id)) &&
        (!f.paciente || nombreCompleto.includes(f.paciente)) &&
        (!f.tipoDocumento || tipoDoc.includes(f.tipoDocumento)) &&
        (!f.fechaNacimiento || fechaNac.includes(f.fechaNacimiento)) &&
        (!f.telefono || telefono.includes(f.telefono))
      );
    });
  }
  //Metodo para Limpiar Filtros
  limpiarFiltros() {
    this.filtros = { id: '', paciente: '', tipoDocumento: '', fechaNacimiento: '', telefono: '' };
    this.pacientesFiltrados = [...this.pacientesList];
  }

  // Método para verificar si hay filtros activos
  hayFiltrosActivos(): boolean {
    return Object.values(this.filtros).some(valor => valor.trim().length > 0);
  }


  //Abrir modal
  claseModal(){
    if(this.modalInstance){
      this.modalInstance.hide();
    }
  }

  openModal(modo: string) {
    this.titleModal = modo === 'C' ? 'Crear Paciente' : 'Editar Paciente';
    this.titleBoton = modo === 'C' ? 'Guardar Paciente' : 'Actualizar Paciente';
    this.modoFormulario = modo;
    const modalElement = document.getElementById('modalPaciente');
    if (modalElement) {
      //Verifica si ya existe una instancia del modal
      this.modalInstance ??= new Modal(modalElement);
      this.modalInstance.show();
    }
  }

  
}