import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Modal } from 'bootstrap';
import Swal from 'sweetalert2';
import { Usuario } from './model/usuario';
import { UsuarioService } from './service/usuario.service';

@Component({
  selector: 'app-usuario',
  imports: [CommonModule],
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


  constructor(private readonly usuarioService: UsuarioService) {
    this.listarUsuarios();
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

  abrirNuevoUsuario() {
    this.usuarioSelected = new Usuario();
    //Cargamos los datos del usuario

    //dejar el formulario en blanco
    this.openModal('C');
  }

  abrirEditarUsuario(usuario: Usuario) {
    this.usuarioSelected = usuario;
    this.openModal('E');
  }

  //Cerrar el modal
  closeModal() {
    if (this.modalInstance) {
      this.modalInstance.hide();
    }
  }

  guardarUsuario() {
    if (this.modoFormulario === 'C') {
      console.log('Creando usuario:', this.usuarioSelected);
      // Aquí iría tu lógica para crear usuario (por ejemplo una petición HTTP)
      this.usuariosList.push(this.usuarioSelected);
      Swal.fire('Guardar Usuario', 'Usuario guardado con éxito', 'success');
    } else {
      console.log('Actualizando usuario:', this.usuarioSelected);
      // Aquí lógica para actualizar
      Swal.fire('Actualizar Usuario', 'Usuario actualizado con éxito', 'success');
    }

    // Luego de guardar, cierra el modal
    this.closeModal();
  }

}