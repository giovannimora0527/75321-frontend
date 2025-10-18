import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';
import { Citas } from '../models/citas';

@Injectable({
  providedIn: 'root'
})
export class CitaService {
  private apiUrl = environment.apiUrl;
  private endpoint = 'cita';

  constructor(private readonly backendService: BackendService) {}

  listarCitas(): Observable<Citas[]> {
    return this.backendService.get(this.apiUrl, this.endpoint, 'all');
  }
}
