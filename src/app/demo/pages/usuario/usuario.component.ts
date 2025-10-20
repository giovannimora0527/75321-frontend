import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../../services/UsuarioService';
import { Usuario } from '../../../models/usuario';

@Component({
  selector: 'app-usuario',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './usuario.component.html',
  styleUrl: './usuario.component.scss'
})
export class UsuarioComponent implements OnInit {
  usuarios: Usuario[] = [];
  usuarioSeleccionado: Usuario = {
    id: 0,
    username: '',
    password: '',
    rol: '',
    numeroDocumento: '',
    activo: false
  };
  filtro: string = '';

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.usuarioService.listar().subscribe({
      next: (data) => {
        this.usuarios = data;
        console.log('Usuarios cargados:', data);
      },
      error: (err) => console.error('Error al cargar usuarios', err)
    });
  }

  guardar(): void {
    if (this.usuarioSeleccionado.id && this.usuarioSeleccionado.id > 0) {
      // Actualizar
      this.usuarioService.actualizar(this.usuarioSeleccionado).subscribe({
        next: () => {
          this.cargarUsuarios();
          this.limpiarFormulario();
          alert('Usuario actualizado correctamente');
        },
        error: (err) => console.error('Error al actualizar usuario', err)
      });
    } else {
      // Guardar nuevo
      this.usuarioService.guardar(this.usuarioSeleccionado).subscribe({
        next: () => {
          this.cargarUsuarios();
          this.limpiarFormulario();
          alert('Usuario guardado correctamente');
        },
        error: (err) => console.error('Error al guardar usuario', err)
      });
    }
  }

  editar(usuario: Usuario): void {
    this.usuarioSeleccionado = { ...usuario };
  }

  eliminar(id: number): void {
    if (confirm('¿Estás seguro de eliminar este usuario?')) {
      this.usuarioService.eliminar(id).subscribe({
        next: () => {
          this.cargarUsuarios();
          alert('Usuario eliminado correctamente');
        },
        error: (err) => console.error('Error al eliminar usuario', err)
      });
    }
  }

  filtrar(): Usuario[] {
    if (!this.filtro) return this.usuarios;
    return this.usuarios.filter(u =>
      Object.values(u).some(valor =>
        String(valor).toLowerCase().includes(this.filtro.toLowerCase())
      )
    );
  }

  limpiarFormulario(): void {
    this.usuarioSeleccionado = {
      id: 0,
      username: '',
      password: '',
      rol: '',
      numeroDocumento: '',
      activo: false
    };
  }
}