import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';
import { AuditoriaRs } from '../model/auditoriaRs';
import { AuditoriaPage } from '../model/auditoria-page';

@Injectable({
  providedIn: 'root'
})
export class AuditoriaService {
  private apiurl=environment.apiUrlAuth;
  private endpoint='auditoria'

  constructor(private readonly backend:BackendService) { }

  //Api filtrar debemos pasarle los parametros
  listarAuditoriaFiltros(username?: string, tipo?: string, desde?: string, hasta?: string) {
  let params: any = {};

  if (username) params.username = username;
  if (tipo) params.tipo = tipo;
  if (desde) params.desde = desde;
  if (hasta) params.hasta = hasta;

  return this.backend.get<AuditoriaRs[]>(this.apiurl, this.endpoint, 'filtrar', params);
}
// Nuevo método: filtros + paginación
listarAuditoriaPage(
  username?: string,
  tipo?: string,
  desde?: string,
  hasta?: string,
  page: number = 0,
  size: number = 5
) {
  const params: any = {
    page,
    size
  };

  if (username) params.username = username;
  if (tipo) params.tipo = tipo;
  if (desde) params.desde = desde;
  if (hasta) params.hasta = hasta;

  // GET http://.../auditoria/filtrar-page?username=...&page=...&size=...
  return this.backend.get<AuditoriaPage>(
    this.apiurl,
    this.endpoint,
    'filtrar-page',
    params
  );


}

}
