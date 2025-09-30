import { Component } from '@angular/core';
import { UsuarioService } from './service/usuario.service';
import { Usuario } from './model/usuario';
import { CommonModule } from '@angular/common';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuario',
  imports: [CommonModule],
  templateUrl: './usuario.component.html',
  styleUrl: './usuario.component.scss'
})
export class UsuarioComponent {
  usuariosList: Usuario[] = [];

  constructor(private readonly usuarioService: UsuarioService) {
    this.listarUsuarios();
  }

  otroMetodo() {
    console.log('Usuarios cargados: ', this.usuariosList);
  }

  listarUsuarios() {
    console.log('Entro a cargar usuarios');
    this.usuarioService.listarUsuarios().subscribe({
      next: (data) => {
        this.usuariosList = data;
        this.otroMetodo();
      },
      error: (error) => {
        console.error('Error al cargar usuarios: ', error);
      }
    });
  }

  probarBoton(usuario: Usuario) {  
    Swal.fire("Titulo", "Este es mi contenido", "success"); 
    console.log(usuario);
  }

  guardarUsuario() {
    Swal.fire("Guardar", "Guardando usuario", "success"); 
  }

}
