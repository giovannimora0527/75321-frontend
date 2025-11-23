import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-logout',
  template: ''
})
export class LogoutComponent {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.logout();
  }

  logout(): void {
    Swal.fire({
      title: '¿Cerrar sesión?',
      text: '¿Deseas cerrar tu sesión?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, cerrar sesión',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.authService.logout();
        Swal.fire({
          icon: 'success',
          title: 'Sesión cerrada',
          text: 'Hasta luego!',
          timer: 1500
        });
        this.router.navigate(['/pages/login']);
      } else {
        this.router.navigate(['/inicio']);
      }
    });
  }
}
