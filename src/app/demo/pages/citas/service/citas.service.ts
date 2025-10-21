import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';
import { Cita } from '../model/cita';

@Injectable({
  providedIn: 'root'
})
export class CitasService {
  private apiurl=environment.apiUrlAuth;
  private endpoint='citas'

  constructor(private readonly backend:BackendService) { }

  //Listar Por citas mas recientes
  listarCitas():Observable<Cita[]>{
    return this.backend.get<Cita[]>(this.apiurl,this.endpoint,'recientes');
  }


}
