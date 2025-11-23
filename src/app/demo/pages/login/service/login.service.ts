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

  loginUsuario(loginForm: LoginRq): Observable<LoginRs> {
    return this.backendService.post(this.urlBase, this.endpoint, 'login', loginForm);
  }

  recuperarContrasena(email: string): Observable<any> {
  return this.backendService.post(this.urlBase, this.endpoint, 'request-password-reset', { username: email });
}
resetPassword(token: string, newPassword: string): Observable<any> {
  return this.backendService.post(this.urlBase, this.endpoint, 'reset-password', { token, newPassword });
}


}
