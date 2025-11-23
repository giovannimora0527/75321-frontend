import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginService } from '../login/service/login.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['../login/login.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  resetForm: FormGroup;
  token: string = '';
  loading: boolean = false;
  mostrarPassword: boolean = false;
  mostrarConfirm: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private loginService: LoginService
  ) {
    this.resetForm = this.formBuilder.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
      if (!this.token) {
        Swal.fire('Error', 'Token inválido o expirado', 'error');
        this.router.navigate(['/login']);
      }
    });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('newPassword');
    const confirm = form.get('confirmPassword');
    return password && confirm && password.value === confirm.value 
      ? null 
      : { mismatch: true };
  }

  togglePasswordVisibility(field: string) {
    if (field === 'new') {
      this.mostrarPassword = !this.mostrarPassword;
    } else {
      this.mostrarConfirm = !this.mostrarConfirm;
    }
  }

  onSubmit() {
    if (this.resetForm.valid) {
      this.loading = true;
      const newPassword = this.resetForm.get('newPassword')?.value;
      const confirmPassword = this.resetForm.get('confirmPassword')?.value;

      this.loginService.resetPassword(this.token, newPassword, confirmPassword).subscribe({
        next: (response) => {
          this.loading = false;
          if (response.exitoso) {
            Swal.fire({
              title: '¡Éxito!',
              text: 'Tu contraseña ha sido actualizada correctamente',
              icon: 'success',
              confirmButtonText: 'Ir al login'
            }).then(() => {
              this.router.navigate(['/login']);
            });
          } else {
            Swal.fire({
              title: 'Error',
              text: response.mensaje || 'No se pudo actualizar la contraseña',
              icon: 'error'
            });
          }
        },
        error: (error) => {
          this.loading = false;
          Swal.fire({
            title: 'Error',
            text: error.error?.mensaje || 'No se pudo actualizar la contraseña',
            icon: 'error'
          });
        }
      });
    } else {
      Swal.fire('Error', 'Por favor completa todos los campos correctamente', 'warning');
    }
  }
}
