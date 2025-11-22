import { Component } from '@angular/core';
import { AuditoriaService } from './service/auditoria.service';
import { AuditoriaRs } from './model/auditoriaRs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-auditoria',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './auditoria.component.html',
  styleUrl: './auditoria.component.scss'
})
export class AuditoriaComponent {

  //Guardamos en un array
  auditoriaList: AuditoriaRs[] = [];
  //Necesitamos la fecha actual
  fechaActual = new Date();

  
  //Construimos el constructor
  constructor(
    private readonly auditoriaService:AuditoriaService
  ){
    this.listarAuditoria();
  }
  //Logica del Negocio
  listarAuditoria(){
    this.auditoriaService.listarAuditoria().subscribe({
      next: (auditoriaRs: AuditoriaRs[]) => {
        this.auditoriaList = auditoriaRs;
        console.log('Logs de auditoría cargados:', auditoriaRs);
      },
      error: (err) => {
        console.error('Error al cargar auditoría', err);
      }
    });
  }

}
