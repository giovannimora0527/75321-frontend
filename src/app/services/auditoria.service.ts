import { Injectable } from '@angular/core';
import { BackendService } from './backend.service';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuditoriaService {
  urlBase = environment.apiUrl;
  endpoint = 'auditoria';

  constructor(private backendService: BackendService) {}

  getLogs(filtros: any, page: number = 0, size: number = 10): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (filtros.username) params = params.set('username', filtros.username);
    if (filtros.tipo) params = params.set('tipo', filtros.tipo);
    if (filtros.fechaInicio) params = params.set('fechaInicio', filtros.fechaInicio);
    if (filtros.fechaFin) params = params.set('fechaFin', filtros.fechaFin);

    // Usamos el método GET genérico de tu BackendService
    // Nota: Tu BackendService.get requiere 4 argumentos (url, endpoint, service, params)
    // Para llamar a la raíz del endpoint '/auditoria', pasamos un string vacío '' como 'service'
    return this.backendService.get(this.urlBase, this.endpoint, '', params);
  }
}