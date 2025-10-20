import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';
import { Paciente } from '../models/paciente';
import { RespuestaRS } from '../models/respuesta-rs';

@Injectable({
  providedIn: 'root'
})
export class PacienteService {
  private apiUrl = environment.apiUrl;
  private endpoint = 'paciente';

  constructor(private readonly backendService: BackendService) {}

  listarPacientes(): Observable<Paciente []> {
    return this.backendService.get(this.apiUrl, this.endpoint, 'all');
  }
  // AGREGAR
  guardarPaciente(paciente: Paciente): Observable<RespuestaRS> {
    return this.backendService.post(this.apiUrl, this.endpoint, 'guardar', paciente);
  }

  // AGREGAR
  actualizarPaciente(paciente: Paciente): Observable<RespuestaRS> {
    return this.backendService.post(this.apiUrl, this.endpoint, 'actualizar', paciente);
  }
}
