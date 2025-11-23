import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, AbstractControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { LoginService } from './service/login.service';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service'; // Ajusta la ruta

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgxSpinnerModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})

export class LoginComponent {
  loginForm: FormGroup;
  mostrarPassword: boolean = false;
  isLoading: boolean = false;
  titleSpinner: string = 'Autenticando...';

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly spinner: NgxSpinnerService,
    private readonly loginService: LoginService,
    private readonly router: Router,
    private readonly authService: AuthService // <-- Agregar AuthService
  ) {
    this.inicializarFormulario();
  }
 
  inicializarFormulario() {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      recordarSesion: [false]
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.loginForm.controls;
  }

  toggleMostrarPassword() {
    this.mostrarPassword = !this.mostrarPassword;
  }

  onLogin() {
    if (!this.loginForm.valid) {
      this.loginForm.markAllAsTouched();
      Swal.fire('Error', 'Por favor complete todos los campos requeridos', 'error');
      return;
    }

    this.isLoading = true;
    this.spinner.show();

    const loginData = {
      username: this.f['username'].value,
      password: this.f['password'].value,
      recordarSesion: this.f['recordarSesion'].value
    };

    this.loginService.loginUsuario(loginData).subscribe({
      next: (response: any) => {
        console.log('Respuesta del backend:', response); // <-- Agregar esto
        this.spinner.hide();
        this.isLoading = false;

        if (response.bloqueadoHasta) {
          let desbloqueaEn = new Date(response.bloqueadoHasta).getTime();
          let tiempoRestante = Math.floor((desbloqueaEn - Date.now()) / 1000);
          if (tiempoRestante < 0) tiempoRestante = 0;

          Swal.fire({
            title: 'Usuario bloqueado',
            html: `Tu cuenta está bloqueada temporalmente.<br>
                   Podrás volver a intentar en <strong id="timer">${tiempoRestante}</strong> segundos.`,
            icon: 'warning',
            didOpen: () => {
              const timerElement = Swal.getHtmlContainer()?.querySelector('#timer');
              const interval = setInterval(() => {
                if (timerElement) {
                  timerElement.textContent = tiempoRestante.toString();
                  tiempoRestante--;
                  if (tiempoRestante < 0) clearInterval(interval);
                }
              }, 1000);
            }
          });
          return;
        }

        if (response.token) {
          // ✅ USAR AuthService para guardar token, usuario y roles
          this.authService.login(response, response.usuario);
          
          Swal.fire('Éxito', 'Inicio de sesión exitoso', 'success').then(() => {
            this.router.navigate(['/inicio']);
          });
        } else {
          Swal.fire('Error', response.mensaje || 'Ups! Algo salió mal durante el inicio de sesión.', 'error');
        }
      },
      error: (error) => {
        this.spinner.hide();
        this.isLoading = false;
        Swal.fire('Error', 'Ups! Algo salió mal durante el inicio de sesión.', 'error');
      }
    });
  }

  onForgotPassword(event: Event) {
    event.preventDefault();
    Swal.fire({
      title: 'Recuperar contraseña',
      text: 'Ingrese su correo electrónico para recuperar su contraseña',
      input: 'email',
      inputAttributes: { autocapitalize: 'off', placeholder: 'correo@ejemplo.com' },
      showCancelButton: true,
      confirmButtonText: 'Enviar',
      cancelButtonText: 'Cancelar',
      showLoaderOnConfirm: true,
      preConfirm: (email) => {
        if (!email) {
          Swal.showValidationMessage('El correo electrónico es requerido');
          return false;
        }
        return this.loginService.recuperarContrasena(email).toPromise()
          .catch(err => Swal.showValidationMessage(`Error: ${err.error?.message || 'No se pudo enviar el correo'}`));
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire('Correo enviado', 'Si el correo existe, se ha enviado un enlace de recuperación.', 'success');
      }
    });
  }

  
  

}