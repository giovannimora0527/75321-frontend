import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';
import { MedicamentoRq } from '../models/medicamentoRq';
import { MedicamentoRs } from '../models/medicamentoRs';
@Injectable({
  providedIn: 'root'
})
export class MedicamentoService {
  private apiurl=environment.apiUrl;
  private endpoint='medicamentos'

  constructor(private readonly backend:BackendService) { }

  //Listar meidcamento service del backend no cambiar
  listarMedicamentos(): Observable<MedicamentoRs[]> {
    return this.backend.get<MedicamentoRs[]>(this.apiurl, this.endpoint, 'listar');
  }
  // Crear medicamentos del backend post
  crearMedicamento(body: MedicamentoRq): Observable<MedicamentoRs> {
    return this.backend.post<MedicamentoRs>(this.apiurl, this.endpoint, 'crear', body);
  }
  //Actualizar Medicamento
  actualizarMedicamento(id: number, body: MedicamentoRq): Observable<MedicamentoRs> {
    return this.backend.post<MedicamentoRs>(this.apiurl, this.endpoint, `actualizar/${id}`, body);
  }
  
}
