import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';
import { LoginRs } from '../models/login-rs';
import { LoginRq } from '../models/login-rq';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  urlBase = environment.apiUrl;
  endpoint: string = 'auth';

  constructor(private readonly backendService: BackendService) {}

  /**
   * Login del usuario (ya existente)
   */
  loginUsuario(loginForm: LoginRq): Observable<LoginRs> {
    return this.backendService.post(this.urlBase, this.endpoint, 'login', loginForm);
  }

  /**
   * Reset Password (ya existente)
   */
  resetPassword(token: string, newPassword: string, confirmPassword: string): Observable<any> {
    return this.backendService.post(this.urlBase, this.endpoint, 'reset-password', {
      token,
      newPassword,
      confirmPassword
    });
  }

  /**
   * NUEVO - Solicitar contraseña temporal
   */
  solicitarPasswordTemporal(username: string): Observable<any> {
    return this.backendService.post(this.urlBase, this.endpoint, 'solicitar-password-temporal', { 
      username 
    });
  }

  /**
   * NUEVO - Cambiar contraseña (después de usar temporal)
   */
  cambiarPassword(username: string, nuevaPassword: string): Observable<any> {
    return this.backendService.post(this.urlBase, this.endpoint, 'cambiar-password', {
      username,
      nuevaPassword
    });
  }

  /**
   * NUEVO - Obtener info de bloqueo
   */
  obtenerInfoBloqueo(username: string): Observable<any> {
    return this.backendService.get(this.urlBase, this.endpoint, `info-bloqueo/${username}`);
  }
}
