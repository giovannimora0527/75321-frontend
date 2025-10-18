import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';
import { Paciente } from '../models/paciente';

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
}
