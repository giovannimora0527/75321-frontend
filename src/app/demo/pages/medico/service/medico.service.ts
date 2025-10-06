import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';
import { medico } from '../model/medico';

@Injectable({
  providedIn: 'root'
})
export class MedicoService {
  private apiUrl=environment.apiUrlAuth;
  private endpoint='medico';

  constructor(private readonly backendservice:BackendService) { }

  //Generamos el Metodo llamado al Endpoint
  //aqui en Onservable llamamos al modelo y al contsructor creamos el metodo
  listarMedicos():Observable<medico[]>{
    return this.backendservice.get(this.apiUrl,this.endpoint,'listar');
  }
}
