import { Injectable } from '@angular/core';
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';
import { Formula } from '../models/formula';
import { Observable } from 'rxjs';
import { RespuestaRS } from '../../usuario/model/respuesta-rs';

@Injectable({
  providedIn: 'root'
})
export class FormulaService {
  private apiUrl = environment.apiUrl;
  private endpoint = 'receta';

  constructor(private readonly backendService: BackendService) {}

  listarRecetas(): Observable<Formula[]> {
    return this.backendService.get(this.apiUrl, this.endpoint, 'listar');
  }

  guardarReceta(formula: Formula): Observable<RespuestaRS> {   
    return this.backendService.post(this.apiUrl, this.endpoint, 'guardar', formula);
  } 

  actualizarReceta(formula: Formula): Observable<RespuestaRS> {   
    return this.backendService.post(this.apiUrl, this.endpoint, 'actualizar', formula);
  } 
}
