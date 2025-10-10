import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Modal } from 'bootstrap';
import Swal from 'sweetalert2';
import { Usuario } from './model/usuario';
import { UsuarioService } from './service/usuario.service';

//Importamos lo neceario para los formularios
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';

// Importa los objetos necesarios de Bootstrap
import { delay, map, Observable, of } from 'rxjs';

//Importamos lo que vamos usar
@Component({
  selector: 'app-usuario',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './usuario.component.html',
  styleUrl: './usuario.component.scss'
})
export class UsuarioComponent {
  //variables para manipular en el modal
  modalInstance:Modal |null=null;
  modoFormulario:string='';
  titleModal:string='';
  titleBoton='';
  usuariosList: Usuario[] = [];
  usuarioSelected:Usuario;

  //Formulario Reactivo es mas escalable angular escucha los cambios

  //Contenedor de los campos del formulario
  form:FormGroup=new FormGroup({

    //lo que se va inyectar en el formulario
    //Crear un campo Vacio
    username:new FormControl(''),
    password:new FormControl(''),
    rol:new FormControl(''),
    activo:new FormControl(''),

  })
  //Inyetcamos als dependencias y prepara el estado inicial lo primero que se ejecuta
  constructor(
    private readonly usuarioService: UsuarioService,
    private readonly formBuilder: FormBuilder
  ){
    //Se ejectuan los metodos
    this.listarUsuarios();
    this.inicializarFormulario();
  }

  //Valida los cambios de Manera asincrona
  inicializarFormulario(){
    this.form=this.formBuilder.group({
      username:['',[Validators.required,Validators.minLength(4),Validators.maxLength(12)]],
      password: ['', [Validators.required, Validators.minLength(8)], [this.passwordAsyncValidator]],
      rol:['',[Validators.required]],
      activo:['',[Validators.required]],
  });
}
//foma de acceder a los controles en el Html
get f():{[key:string]:AbstractControl}{
  return this.form.controls;
}

//Validamos de manera asicronica la contraseña
passwordAsyncValidator(control: AbstractControl): Observable<ValidationErrors | null> {
  const contrasenasProhibidas = ['12345678', 'password', 'admin'];

  return of(contrasenasProhibidas.includes(control.value)).pipe(
    delay(800), // simulamos llamada a servidor
    map((invalida) => (invalida ? { passwordProhibida: true } : null))
  );
}


  otroMetodo() {
    console.log('Usuarios cargados: ', this.usuariosList);
  }

  //Tiene que existir el metodo en el servicio para luego implentar logica de Negocio
  listarUsuarios() {
    console.log('Entro a cargar usuarios');
    this.usuarioService.listarTodos().subscribe({
      next: (usuarios: Usuario[]) => {
        this.usuariosList = usuarios;
        this.otroMetodo();
      },
      error: (err) => console.error('Error al cargar usuarios', err),
    });
  }
  //Este metodo es para abrir el modal
  claseModal(){
    if(this.modalInstance){
      this.modalInstance.hide();
    }
  }

  //Preparar los datos para el modal
  openModal(modo: string) {
    this.titleModal = modo === 'C' ? 'Crear Usuario' : 'Editar Usuario';
    this.titleBoton = modo === 'C' ? 'Guardar Usuario' : 'Actualizar Usuario';
    this.modoFormulario = modo;
    const modalElement = document.getElementById('modalUsuario');
    if (modalElement) {
      //Verifica si ya existe una instancia del modal
      this.modalInstance ??= new Modal(modalElement);
      this.modalInstance.show();
    }
  }

  //metodo para abrir el modal
  abrirNuevoUsuario() {
    this.usuarioSelected = new Usuario();
    //Cargamos los datos del usuario
    //Dejar el formulario en blanco
    this.limpiarFormulario();

    //dejar el formulario en blanco
    this.openModal('C');
  }

  //Metodo para limpiar el formulario
  limpiarFormulario(){
    this.form.reset();
    this.form.markAsPristine();
    this.form.markAsUntouched();
  }

  abrirEditarUsuario(usuario: Usuario) {
    //limpiamos el formulario de primeras
    this.limpiarFormulario();
    this.usuarioSelected = usuario;
    this.openModal('E');
  }

  //Cerrar el modal
  closeModal() {
    if (this.modalInstance) {
      this.modalInstance.hide();
    }
  }

  //Logica de guardar los Usuarios llamando al service a la api del backend
  guardarUsuario() {
    if (this.form.invalid) {
      Swal.fire('Error', 'Por favor complete todos los campos requeridos', 'error');
      return;
    }
    
    // Solo lógica para crear usuarios
    this.form.get('activo').setValue(true);
    this.usuarioService.guardarUsuario(this.form.getRawValue()).subscribe({
      next: (data) => {
        console.log(data);
        // Cerrar el modal primero
        this.closeModal();
        // Luego mostrar la alerta
        Swal.fire('Éxito', data.mensaje, 'success');
        // Actualizar la lista de usuarios
        this.listarUsuarios();
      },
      error: (error) => {
        console.error('Error al guardar usuario: ', error);
        // Cerrar el modal primero
        this.closeModal();
        // Luego mostrar la alerta de error
        Swal.fire('Error', error.error.message, 'error');
      }
      //Falta actualizar Usuarios tanto Logica Backend Y frontend
    });
  }

}