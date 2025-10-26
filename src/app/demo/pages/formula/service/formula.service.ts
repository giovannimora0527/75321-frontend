import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';
import { Formula } from '../models/formula';
import { FormulaRq } from '../models/formularq';

@Injectable({
  providedIn: 'root'
})
export class FormulaMedicasService {
   private apiurl=environment.apiUrl;
  private endpoint='recetas'

  constructor(private readonly backend:BackendService) { }

  listarFormulas():Observable<Formula[]>{
    return this.backend.get<Formula[]>(this.apiurl,this.endpoint,'recientes')
  }
  //Enpoint Crear pasamos el Rq y rs
  CrearFormulas(body:FormulaRq):Observable<Formula[]>{
    return this.backend.post<Formula[]>(this.apiurl,this.endpoint,'crear',body)
  }
  //ActualizarFormulas
  ActualizarFormulas(id: number, body: any): Observable<Formula> {
    return this.backend.post<Formula>(
      this.apiurl,
      this.endpoint,
      `actualizar/${id}`,
      body
    );
  }
  
}
