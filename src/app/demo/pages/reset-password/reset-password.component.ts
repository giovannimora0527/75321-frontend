import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { LoginService } from '../login/service/login.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule
  ],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  resetForm!: FormGroup;
  token: string | null = null;
  mostrarPassword = false;
  mostrarPassword2 = false;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly fb: FormBuilder,
    private readonly loginService: LoginService,
    private readonly spinner: NgxSpinnerService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token');

    if (!this.token) {
      Swal.fire('Error', 'Token inválido o faltante.', 'error');
      this.router.navigate(['/login']);
      return;
    }

    this.resetForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    });
  }

  passwordsMatch(): boolean {
    return this.resetForm.get('newPassword')?.value ===
           this.resetForm.get('confirmPassword')?.value;
  }

  togglePassword(field: string) {
    if (field === 'new') this.mostrarPassword = !this.mostrarPassword;
    else this.mostrarPassword2 = !this.mostrarPassword2;
  }

  onSubmit() {
    if (this.resetForm.invalid || !this.passwordsMatch()) {
      Swal.fire('Error', 'Las contraseñas no coinciden o son inválidas.', 'error');
      return;
    }

    this.spinner.show();

    this.loginService.resetPassword(this.token!, this.resetForm.value.newPassword).subscribe({
      next: () => {
        this.spinner.hide();
        Swal.fire('Éxito', 'La contraseña ha sido actualizada.', 'success')
          .then(() => this.router.navigate(['/login']));
      },
      error: (error) => {
        this.spinner.hide();
        Swal.fire(
          'Error',
          error.error?.message || 'Token inválido o expirado.',
          'error'
        );
      }
    });
  }
}
