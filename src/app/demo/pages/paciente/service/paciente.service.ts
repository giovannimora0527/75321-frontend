import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Paciente } from './../models/paciente';
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class PacienteService {
  private apiUrl = environment.apiUrl;  // Ej: http://localhost:8000/clinica/v1
  private endpoint = 'paciente';

  constructor(private readonly backendService: BackendService) { }

  listarPacientes(): Observable<Paciente[]> {
    return this.backendService.get(this.apiUrl, this.endpoint, 'listar');
  }

  guardarPaciente(paciente: Paciente): Observable<Paciente> {
    // POST sin path adicional, solo url + endpoint
    return this.backendService.post(this.apiUrl, this.endpoint, '', paciente);
  }

  actualizarPaciente(id: number, paciente: Paciente): Observable<Paciente> {
    // PUT con path el id del paciente
    return this.backendService.put(this.apiUrl, this.endpoint, id.toString(), paciente);
  }

  buscarPacientePorDocumento(numeroDoc: string): Observable<Paciente> {
    return this.backendService.get(this.apiUrl, this.endpoint, numeroDoc);
  }
}
