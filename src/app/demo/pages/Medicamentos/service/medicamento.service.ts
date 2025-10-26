import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';
import { Medicamento } from '../models/medicamento';
import { RespuestaRS } from '../../paciente/models/respuesta-rs';

@Injectable({
  providedIn: 'root'
})
export class MedicamentoService {
  private apiUrl = environment.apiUrl;
  private endpoint = 'medicamento';

  constructor(private readonly backendService: BackendService) {}

  listarMedicamentos(): Observable<Medicamento[]> {
    return this.backendService.get(this.apiUrl, this.endpoint, 'listar');
  }

  guardarMedicamento(medicamento: any): Observable<RespuestaRS> {
    return this.backendService.post(this.apiUrl, this.endpoint, 'guardar', medicamento);
  }

  actualizarMedicamento(medicamento: any): Observable<RespuestaRS> {
    return this.backendService.post(this.apiUrl, this.endpoint, 'actualizar', medicamento);
  }
}
