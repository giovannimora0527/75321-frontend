import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';
import { AuditoriaRs } from '../model/auditoriaRs';

@Injectable({
  providedIn: 'root'
})
export class AuditoriaService {
  private apiurl=environment.apiUrlAuth;
  private endpoint='auditoria'

  constructor(private readonly backend:BackendService) { }

  //Api filtrar debemos pasarle los parametros
  listarAuditoria(
  username?: string,
  tipo?: string,
  desde?: string,
  hasta?: string
): Observable<AuditoriaRs[]> {

  const params:any = {};

  if (username) params.username = username;
  if (tipo) params.tipo = tipo;
  if (desde) params.desde = desde;
  if (hasta) params.hasta = hasta;

  return this.backend.get<AuditoriaRs[]>(
    this.apiurl,
    this.endpoint,
    'filtrar',
    params
  );
}

}
