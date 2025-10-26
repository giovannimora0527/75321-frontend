import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';
import { Receta } from '../models/receta';

@Injectable({
  providedIn: 'root'
})
export class RecetaService {
  private apiUrl = environment.apiUrl;
  private endpoint = 'receta';

  constructor(private readonly backendService: BackendService) {}

  listarTodasLasRecetas(): Observable<Receta[]> {
    return this.backendService.get(this.apiUrl, this.endpoint, 'listar');
  }
}
