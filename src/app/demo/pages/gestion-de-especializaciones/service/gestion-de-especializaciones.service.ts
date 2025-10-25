import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';
import { EspecializacionRq } from '../model/especializacionRq';
import { EspecializacionRs } from '../model/especializacionRs';
@Injectable({
  providedIn: 'root'
})
export class GestionDeEspecializacionesService {
  private apiUrl = environment.apiUrlAuth; 
  private endpoint = 'especializaciones';

  constructor(private readonly backend: BackendService) { }

  //Listar Espcializaciones desde el backend
  listarEspecializaciones(): Observable<EspecializacionRs[]> {
    return this.backend.get<EspecializacionRs[]>(this.apiUrl, this.endpoint, 'listar');
  }
  // Crear especialización
  crearEspecializacion(body: EspecializacionRq): Observable<EspecializacionRs> {
    return this.backend.post<EspecializacionRs>(this.apiUrl, this.endpoint, 'crear', body);
  }

  // Actualizar especialización
  actualizarEspecializacion(id: number, body: EspecializacionRq): Observable<EspecializacionRs> {
    return this.backend.post<EspecializacionRs>(this.apiUrl, this.endpoint, `actualizar/${id}`, body);
  }
}
