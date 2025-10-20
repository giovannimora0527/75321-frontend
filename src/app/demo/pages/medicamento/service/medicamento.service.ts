import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';
import { Medicamento } from '../models/medicamento';


@Injectable({
  providedIn: 'root'
})
export class MedicamentoService {
  listarMedicamentos() {
    throw new Error('Method not implemented.');
  }

  private apiUrl = environment.apiUrl;
  private endpoint = 'medicamento';

  constructor(private readonly backendService: BackendService) {}

  listarMedicos(): Observable<Medicamento[]> {
    return this.backendService.get(this.apiUrl, this.endpoint, 'listar');
  }
}

