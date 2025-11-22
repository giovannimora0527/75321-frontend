import { Component } from "@angular/core";
import { AuditoriaPage } from "./model/auditoria-page";
import { AuditoriaRs } from "./model/auditoriaRs";
import { AuditoriaService } from "./service/auditoria.service";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

@Component({
  selector: 'app-auditoria',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './auditoria.component.html',
  styleUrls: ['./auditoria.component.scss']

  
})
export class AuditoriaComponent {

  // lista que usamos en la tabla
  auditoriaList: AuditoriaRs[] = [];

  // objeto con info de paginación
  auditoriaPage: AuditoriaPage = new AuditoriaPage();

  now: Date = new Date();

  // filtros
  username: string = '';
  tipo: string = '';
  desde: string = '';
  hasta: string = '';

  // estado de paginación (0-based como Spring)
  page: number = 0;
  size: number = 5; // cantidad de registros por página

  constructor(private readonly auditoriaService: AuditoriaService) {
    this.listarAuditoria();   // carga inicial página 0
  }

  // ===== LÓGICA DEL NEGOCIO =====

  listarAuditoria(pagina: number = 0) {
    this.page = pagina;

    this.auditoriaService
      .listarAuditoriaPage(
        this.username,
        this.tipo,
        this.desde,
        this.hasta,
        this.page,
        this.size
      )
      .subscribe({
        next: data => {
          // data es el JSON de la página
          this.auditoriaPage = new AuditoriaPage(data);
          this.auditoriaList = this.auditoriaPage.content;
        },
        error: err => console.error('Error al cargar auditoría', err),
      });
  }

  aplicarFiltros() {
    // cada vez que filtro, vuelvo a la página 0
    this.listarAuditoria(0);
  }

  limpiarFiltros() {
    this.username = '';
    this.tipo = '';
    this.desde = '';
    this.hasta = '';
    this.listarAuditoria(0);
  }

  // ===== NAVEGACIÓN DE PÁGINAS =====

  paginaAnterior() {
    if (this.page > 0) {
      this.listarAuditoria(this.page - 1);
    }
  }

  paginaSiguiente() {
    if (this.page + 1 < this.auditoriaPage.totalPages) {
      this.listarAuditoria(this.page + 1);
    }
  }
}

