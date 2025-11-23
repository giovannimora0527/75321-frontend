import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, AbstractControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { LoginService } from './service/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgxSpinnerModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm: FormGroup;
  cambiarPasswordForm: FormGroup;
  mostrarPassword: boolean = false;
  isLoading: boolean = false;
  titleSpinner: string = 'Autenticando...';
  
  // NUEVO - Estados de bloqueo
  usuarioBloqueado: boolean = false;
  minutosRestantes: number = 0;
  intentosRestantes: number = 3;
  
  // NUEVO - Estados de cambio de contraseña
  mostrarCambioPassword: boolean = false;
  usuarioTemporal: string = '';

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly spinner: NgxSpinnerService,
    private readonly loginService: LoginService,
    private readonly router: Router
  ) {
    this.inicializarFormulario();
  }

  inicializarFormulario() {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      recordarSesion: [false]
    });

    // NUEVO - Formulario de cambio de contraseña
    this.cambiarPasswordForm = this.formBuilder.group({
      nuevaPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmarPassword: ['', [Validators.required]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.loginForm.controls;
  }

  get fc(): { [key: string]: AbstractControl } {
    return this.cambiarPasswordForm.controls;
  }

  toggleMostrarPassword() {
    this.mostrarPassword = !this.mostrarPassword;
  }

  /**
   * Validador personalizado para confirmar contraseña
   */
  passwordMatchValidator(group: FormGroup): { [key: string]: boolean } | null {
    const nueva = group.get('nuevaPassword')?.value;
    const confirmar = group.get('confirmarPassword')?.value;
    return nueva === confirmar ? null : { passwordMismatch: true };
  }

  /**
   * LOGIN - Actualizado con manejo de bloqueo y contraseñas temporales
   */
  onLogin() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.spinner.show();

      const loginData = {
        username: this.f['username'].value.toLowerCase(),
        password: this.f['password'].value,
        recordarSesion: this.f['recordarSesion'].value
      };

      console.log('Datos de login:', loginData);

      this.loginService.loginUsuario(loginData).subscribe({
        next: (response) => {
          console.log('Respuesta del servidor:', response);
          this.isLoading = false;
          this.spinner.hide();

          // Verificar si el login fue exitoso
          if (response.status === 200) {
            localStorage.setItem('currentUser', JSON.stringify(response));
            localStorage.setItem('token', response.token || '');

            // NUEVO - Verificar si requiere cambio de contraseña
            if (response.requiereCambioPassword || response.usandoPasswordTemporal) {
              this.usuarioTemporal = response.usuario;
              this.mostrarCambioPassword = true;
              
              Swal.fire({
                title: 'Contraseña Temporal',
                text: 'Debes cambiar tu contraseña para continuar',
                icon: 'warning',
                confirmButtonText: 'Cambiar Ahora'
              });
            } else {
              Swal.fire({
                title: 'Éxito',
                text: 'Inicio de sesión exitoso',
                icon: 'success',
                timer: 1500,
                showConfirmButton: false
              }).then(() => {
                this.router.navigate(['/inicio']);
              });
            }
          }
        },
        error: (error) => {
          this.spinner.hide();
          this.isLoading = false;
          console.error('Error en la autenticación:', error);

          // NUEVO - Manejar usuario bloqueado
          if (error.status === 403 || error.error?.blocked) {
            this.usuarioBloqueado = true;
            this.minutosRestantes = error.error?.minutosRestantes || 5;

            Swal.fire({
              title: 'Cuenta Bloqueada',
              html: `Tu cuenta está bloqueada por <strong>${this.minutosRestantes} minutos</strong> debido a múltiples intentos fallidos.<br><br>Por seguridad, intenta nuevamente más tarde.`,
              icon: 'error',
              confirmButtonText: 'Entendido'
            });

            this.iniciarContadorBloqueo();
          }
          // NUEVO - Manejar credenciales incorrectas con intentos restantes
          else if (error.status === 401) {
            this.intentosRestantes = error.error?.intentosRestantes || 3;

            let mensaje = error.error?.error || 'Usuario o contraseña incorrectos';
            if (this.intentosRestantes < 3) {
              mensaje += `<br><br>Te quedan <strong>${this.intentosRestantes} intentos</strong> antes de que tu cuenta sea bloqueada.`;
            }

            Swal.fire({
              title: ' Error de Login',
              html: mensaje,
              icon: 'error'
            });
          }
          // Error genérico
          else {
            Swal.fire({
              title: 'Error',
              text: 'Ups! Algo salió mal durante el inicio de sesión.',
              icon: 'error'
            });
          }
        }
      });
    } else {
      this.spinner.hide();
      this.isLoading = false;
      this.loginForm.markAllAsTouched();
      Swal.fire({
        title: 'Error',
        text: 'Por favor complete todos los campos requeridos',
        icon: 'error'
      });
    }
  }

  /**
   * NUEVO - Solicitar contraseña temporal
   */
  onSolicitarPasswordTemporal(event: Event) {
    event.preventDefault();

    Swal.fire({
      title: '🔑 Solicitar Contraseña Temporal',
      text: 'Ingrese su nombre de usuario',
      input: 'text',
      inputPlaceholder: 'usuario',
      showCancelButton: true,
      confirmButtonText: 'Solicitar',
      cancelButtonText: 'Cancelar',
      showLoaderOnConfirm: true,
      preConfirm: (username) => {
        if (!username) {
          Swal.showValidationMessage('El nombre de usuario es requerido');
          return false;
        }

        return this.loginService.solicitarPasswordTemporal(username.toLowerCase())
          .toPromise()
          .then(response => {
            return response;
          })
          .catch(error => {
            Swal.showValidationMessage(`Error: ${error.error?.mensaje || 'No se pudo procesar la solicitud'}`);
          });
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Solicitud Enviada',
          html: 'Si el usuario existe, recibirás un correo con la <strong>contraseña temporal</strong>.<br><br>Revisa tu bandeja de entrada.',
          icon: 'success'
        });
      }
    });
  }

  /**
   * NUEVO - Cambiar contraseña después de usar temporal
   */
  onCambiarPassword() {
    if (this.cambiarPasswordForm.invalid) {
      this.cambiarPasswordForm.markAllAsTouched();
      Swal.fire({
        title: 'Error',
        text: 'Por favor complete correctamente el formulario',
        icon: 'error'
      });
      return;
    }

    this.isLoading = true;
    this.spinner.show();

    const nuevaPassword = this.fc['nuevaPassword'].value;

    this.loginService.cambiarPassword(this.usuarioTemporal, nuevaPassword).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.spinner.hide();

        Swal.fire({
          title: '✅ Contraseña Actualizada',
          text: 'Tu contraseña ha sido cambiada exitosamente',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        }).then(() => {
          this.mostrarCambioPassword = false;
          this.router.navigate(['/inicio']);
        });
      },
      error: (error) => {
        this.isLoading = false;
        this.spinner.hide();
        console.error('Error al cambiar contraseña:', error);

        Swal.fire({
          title: 'Error',
          text: error.error?.mensaje || 'No se pudo cambiar la contraseña',
          icon: 'error'
        });
      }
    });
  }

  /**
   * Cancelar cambio de contraseña
   */
  onCancelarCambioPassword() {
    this.mostrarCambioPassword = false;
    this.cambiarPasswordForm.reset();
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    
    Swal.fire({
      title: 'Cancelado',
      text: 'Debes cambiar tu contraseña temporal para acceder al sistema',
      icon: 'info'
    });
  }

  /**
   * NUEVO - Contador regresivo de bloqueo
   */
  private iniciarContadorBloqueo() {
    const interval = setInterval(() => {
      this.minutosRestantes--;

      if (this.minutosRestantes <= 0) {
        this.usuarioBloqueado = false;
        clearInterval(interval);

        Swal.fire({
          title: 'Cuenta Desbloqueada',
          text: 'Puedes intentar iniciar sesión nuevamente',
          icon: 'info',
          timer: 3000
        });
      }
    }, 60000); // Cada minuto
  }

  /**
   * Forgot Password (ya existente)
   */
  onForgotPassword(event: Event) {
    event.preventDefault();
    Swal.fire({
      title: 'Recuperar contraseña',
      text: 'Ingrese su correo electrónico para recuperar su contraseña',
      input: 'email',
      inputAttributes: {
        autocapitalize: 'off',
        placeholder: 'correo@ejemplo.com'
      },
      showCancelButton: true,
      confirmButtonText: 'Enviar',
      cancelButtonText: 'Cancelar',
      showLoaderOnConfirm: true,
      preConfirm: (email) => {
        if (!email) {
          Swal.showValidationMessage('El correo electrónico es requerido');
          return false;
        }

        return new Promise((resolve) => {
          setTimeout(() => {
            console.log('Enviar email de recuperación a:', email);
            resolve(true);
          }, 1000);
        });
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Email enviado',
          text: 'Se ha enviado un enlace de recuperación a su correo electrónico',
          icon: 'success'
        });
      }
    });
  }
}
