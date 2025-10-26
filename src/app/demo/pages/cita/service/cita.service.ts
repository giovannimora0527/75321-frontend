import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';
import { Cita } from '../models/cita';


@Injectable({
  providedIn: 'root'
})
export class CitaService {
  listarMedicamentos() {
    throw new Error('Method not implemented.');
  }

  private apiUrl = environment.apiUrl;
  private endpoint = 'cita';

  constructor(private readonly backendService: BackendService) {}

  listarMedicos(): Observable<Cita[]> {
    return this.backendService.get(this.apiUrl, this.endpoint, 'listar');
  }
}
