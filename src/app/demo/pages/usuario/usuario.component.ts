import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Usuario } from './model/usuario';
import { UsuarioService } from './service/usuario.service';

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

  //Tiene que existir el metodo en el servicio para luego implentar logica de Negocio
  listarUsuarios() {
    console.log('Entro a cargar usuarios');
    this.usuarioService.buscarporDocumento('9902001008').subscribe({
      next:Usuario=>{
        this.usuariosList=[Usuario];
        this.otroMetodo
      },
      error: err=>console.error('Error al cargar usuarios',err)
    });
  }
  
}