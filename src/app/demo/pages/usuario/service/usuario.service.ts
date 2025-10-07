import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';
import { Usuario } from '../model/usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  //atributos endpoint y api url
  private apiUrl = environment.apiUrlAuth;
  private endpoint = 'usuarios';

  constructor(private readonly backend: BackendService) {}

  //Definimos el metodo para luego inyectarlo al componente
  //observable es una promesa mejorada
  //El ultimo punto ponemos el nombre de la firma del Service del Backend
listarTodos():Observable<Usuario[]>{
  return this.backend.get(this.apiUrl,this.endpoint,'all')
}

  buscarporDocumento(numDoc:string):Observable<Usuario>{
    //Construimos la url
    return this.backend.get(this.apiUrl,this.endpoint,`buscar-por-documento/${numDoc}`)
  }
}
