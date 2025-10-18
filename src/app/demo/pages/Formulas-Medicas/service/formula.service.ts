import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';
import { Formula } from '../models/formula';

@Injectable({
  providedIn: 'root'
})
export class RecetaService {
  private apiUrl = environment.apiUrl;
  private endpoint = 'receta';

  constructor(private readonly backendService: BackendService) {}

  listarTodasLasRecetas(): Observable<Formula[]> {
    return this.backendService.get(this.apiUrl, this.endpoint, 'all');
  }
}
