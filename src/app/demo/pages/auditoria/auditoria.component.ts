import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';   
import { AuditoriaService } from './service/auditoria.service';
import { AuditoriaRs } from './model/auditoriaRs';

@Component({
  selector: 'app-auditoria',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule          // para manejar la vistas
  ],
  templateUrl: './auditoria.component.html',
  styleUrl: './auditoria.component.scss'
})
export class AuditoriaComponent {

  auditoriaList: AuditoriaRs[] = [];
  now: Date = new Date();

  // filtros
  username: string = '';
  tipo: string = '';
  desde: string = '';
  hasta: string = '';

  constructor(private readonly auditoriaService: AuditoriaService) {
    this.listarAuditoria();
  }

  //Logica del negocio
  listarAuditoria() {
    this.auditoriaService.listarAuditoriaFiltros(
      this.username,
      this.tipo,
      this.desde,
      this.hasta
    ).subscribe({
      next: data => this.auditoriaList = data,
      error: err => console.error('Error al cargar auditoría', err),
    });
  }

  aplicarFiltros() {
    this.listarAuditoria();
  }
  //Filtramos segun los parametros

  limpiarFiltros() {
    this.username = '';
    this.tipo = '';
    this.desde = '';
    this.hasta = '';
    this.listarAuditoria();
  }
}

