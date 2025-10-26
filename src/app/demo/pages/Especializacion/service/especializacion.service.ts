import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';
import { Especializacion } from '../models/especializacion';

@Injectable({
  providedIn: 'root'
})
export class EspecializacionService {
  private apiUrl = environment.apiUrl;
  private endpoint = 'especializacion';

  constructor(private readonly backendService: BackendService) {}

  listarEspecializaciones(): Observable<Especializacion[]> {
    return this.backendService.get<Especializacion[]>(
      this.apiUrl,
      this.endpoint,
      'listar'
    );
  }

  buscarPorCodigo(codigo: string): Observable<Especializacion> {
    return this.backendService.get<Especializacion>(
      this.apiUrl,
      this.endpoint,
      `buscar-por-codigo?codigo=${codigo}`
    );
  }

  crear(especializacion: Especializacion): Observable<Especializacion> {
    return this.backendService.post<Especializacion>(
      this.apiUrl,
      this.endpoint,
      'crear',
      especializacion
    );
  }

  actualizar(id: number, especializacion: Especializacion): Observable<Especializacion> {
    return this.backendService.put<Especializacion>(
      this.apiUrl,
      this.endpoint,
      `actualizar/${id}`,
      especializacion
    );
  }
}
