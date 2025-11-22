import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';
import { LoginRq } from '../model/login-rq';
import { LoginRs } from '../model/login-rs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private readonly endpoint = 'auth';
  private readonly loginMethod = 'login';

  constructor(private readonly backendService: BackendService) { }

  //Login Requermiento 1
  login(request: LoginRq): Observable<LoginRs> {
    return this.backendService.post<LoginRs>(
      environment.apiUrlAuth,      // http://localhost:8080/clinica/v1
      this.endpoint,               // auth
      this.loginMethod,            // login
      request                      // body { username, password }
    );
  

  }
   recuperarPassword(username: string): Observable<any> {

    const rq = { username };

    return this.backendService.post<any>(
      environment.apiUrlAuth,   // base URL
      this.endpoint,            // /auth
      'recuperar-password',     // /recuperar-password
      rq
    );
  }

}
