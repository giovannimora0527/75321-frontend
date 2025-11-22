import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { lastValueFrom } from 'rxjs';
import Swal from 'sweetalert2';
import { LoginRq } from './model/login-rq';
import { LoginService } from './service/login.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgxSpinnerModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  //Logica del formulario 
  loginForm: FormGroup;
  mostrarPassword: boolean = false;
  isLoading: boolean = false;
  titleSpinner: string = 'Autenticando...';

  //inyectamos logica dels ervicio para manejar formulario y spinner
  constructor(
    private readonly loginService:LoginService,
    private readonly formBuilder: FormBuilder,
    private readonly spinner: NgxSpinnerService,
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
  }

  get f(): { [key: string]: AbstractControl } {
    return this.loginForm.controls;
  }

  toggleMostrarPassword() {
    this.mostrarPassword = !this.mostrarPassword;
  }

  onLogin() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.spinner.show();

      // SOLUCIÓN: Solo enviamos lo que LoginRq espera (username y password)
      const loginData: LoginRq = {
        username: this.f['username'].value,
        password: this.f['password'].value
        // No enviamos 'recordarSesion' aquí porque no está en el modelo LoginRq
      };

      // Si necesitas usar 'recordarSesion' para lógica local:
      // const recordar = this.f['recordarSesion'].value;

      this.loginService.login(loginData).subscribe({
        next: (response) => {
          console.log('Respuesta:', response);
          // Accedemos al token. TypeScript sabe que response es LoginRs
          if (response && response.token) {
             localStorage.setItem("token", response.token);
          }
          
          this.isLoading = false;
          this.spinner.hide();
          
          Swal.fire({
            title: 'Éxito',
            text: 'Inicio de sesión exitoso',
            icon: 'success'
          }).then(() => {
            this.router.navigate(['/inicio']);
          });
        },
        error: (error: any) => { // Tipamos error como 'any' para evitar "Object is of type unknown"
          this.spinner.hide();
          this.isLoading = false;
          console.error('Error:', error);
          
          const mensaje = error.error?.message || 'Usuario o contraseña incorrectos';
          
          Swal.fire({
            title: 'Error',
            text: mensaje,
            icon: 'error'
          });
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
      Swal.fire({
        title: 'Error',
        text: 'Por favor complete todos los campos requeridos',
        icon: 'error'
      });
    }
  }
  //Logica para recuperar contraseña

  onForgotPassword(event: Event) {
    event.preventDefault();

    Swal.fire({
      title: 'Recuperar contraseña',
      text: 'Ingrese su nombre de usuario para recuperar su contraseña',
      input: 'text',
      inputAttributes: {
        autocapitalize: 'off',
        placeholder: 'nombre.usuario'
      },
      showCancelButton: true,
      confirmButtonText: 'Enviar',
      cancelButtonText: 'Cancelar',
      showLoaderOnConfirm: true,
      preConfirm: async (username) => {
        if (!username) {
          Swal.showValidationMessage('El usuario es requerido');
          return false;
        }

        try {
          await lastValueFrom(this.loginService.recuperarPassword(username));
          return true;
        } catch (error) {
          console.warn('Error controlado:', error);
          return true;
        }
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Solicitud Procesada',
          text: 'Si el usuario es válido, recibirá una nueva contraseña en su correo.',
          icon: 'success'
        });
      }
    });
  }

}
