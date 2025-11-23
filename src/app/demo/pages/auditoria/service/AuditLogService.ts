import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuditLogService {
  urlBase = environment.apiUrl;  // tu URL base del backend
  endpoint: string = 'audit';    // endpoint del módulo de auditoría

  constructor(private readonly backendService: BackendService) {}

  getLogs(
    page: number = 0,
    size: number = 20,
    username?: string,
    event?: string,
    from?: string,
    to?: string
  ): Observable<any> {
    let params: HttpParams = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (username) params = params.set('username', username);
    if (event) params = params.set('event', event);
    if (from) params = params.set('from', from);
    if (to) params = params.set('to', to);

    return this.backendService.get(this.urlBase, this.endpoint, 'logs', params);
  }
}
