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
  styleUrls: ['./usuario.component.scss']
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
    fechaCreacion:new FormControl(''),
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
      fechaCreacion:['',[Validators.required]],
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
    
    //Establecer fecha actual para nuevo usuario
    this.establecerFechaActual();

    //dejar el formulario en blanco
    this.openModal('C');
  }

  //Metodo para limpiar el formulario
  limpiarFormulario(){
    this.form.reset();
    this.form.markAsPristine();
    this.form.markAsUntouched();
  }

  //Metodo para establecer fecha actual al crear nuevo usuario
  establecerFechaActual(){
    const fechaActual = new Date();
    const fechaFormateada = fechaActual.toISOString().split('T')[0]; // Formato YYYY-MM-DD
    this.form.get('fechaCreacion').setValue(fechaFormateada);
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

  // Espera a que el modal termine de ocultarse (transición completa)
  private waitForModalHidden(modalElement: HTMLElement): Promise<void> {
    return new Promise((resolve) => {
      // Garantiza que resolvemos incluso si no se dispara el evento por alguna razón
      const fallbackTimeout = setTimeout(resolve, 600);

      const handler = () => {
        clearTimeout(fallbackTimeout);
        modalElement.removeEventListener('hidden.bs.modal', handler as any);
        resolve();
      };
      // Bootstrap emite 'hidden.bs.modal' cuando termina la animación de cierre
      modalElement.addEventListener('hidden.bs.modal', handler as any, { once: true });
    });
  }

  //Logica de guardar los Usuarios llamando al service a la api del backend
  guardarUsuario() {
    if (this.form.invalid) {
      Swal.fire('Error', 'Por favor complete todos los campos requeridos', 'error');
      return;
    }

    this.usuarioService.guardarUsuario(this.form.getRawValue()).subscribe({
      next: (data) => {
        console.log(data);
        // Cerrar el modal primero y esperar a que termine la animación para evitar que la alerta quede debajo
        const modalElement = document.getElementById('modalUsuario');
        this.closeModal();
        if (modalElement) {
          this.waitForModalHidden(modalElement).then(() => {
            Swal.fire('Éxito', data.mensaje, 'success');
            this.listarUsuarios();
          });
        } else {
          Swal.fire('Éxito', data.mensaje, 'success');
          this.listarUsuarios();
        }
      },
      error: (error) => {
        console.error('Error al guardar usuario: ', error);
        // Cerrar el modal primero y esperar para mostrar la alerta por encima del backdrop
        const modalElement = document.getElementById('modalUsuario');
        this.closeModal();
        if (modalElement) {
          this.waitForModalHidden(modalElement).then(() => {
            Swal.fire('Error', error?.error?.message ?? 'Ocurrió un error al guardar', 'error');
          });
        } else {
          Swal.fire('Error', error?.error?.message ?? 'Ocurrió un error al guardar', 'error');
        }
      }
      //Falta actualizar Usuarios tanto Logica Backend Y frontend
    });
  }

}