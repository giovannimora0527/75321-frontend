import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';
import { Paciente } from '../model/paciente';

@Injectable({
  providedIn: 'root'
})
export class PacienteService {
  private apiurl=environment.apiUrlAuth;
  private endpoint ='pacientes'

  constructor(private readonly backend:BackendService) { }
  
  listarPacientes():Observable<Paciente[]>{
    return this.backend.get(this.apiurl,this.endpoint,'listar')
  }
  //Implentar Guardar Pacientes
}


  
