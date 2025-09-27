import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BackendService } from 'src/app/services/backend.service';
import { Usuario } from '../model/usuario';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrl = environment.apiUrl;
  private endpoint = "users";

  constructor(private readonly backendService: BackendService) { }

  listarUsuarios(): Observable<Usuario[]> {
     return this.backendService.get(this.apiUrl, this.endpoint, 'all');
  }
}
