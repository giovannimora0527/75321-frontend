import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { AuditoriaService } from './service/auditoria.service';
import { Auditoria } from './model/auditoria';

@Component({
  selector: 'app-auditoria',
  standalone: true,
  imports: [CommonModule, NgxSpinnerModule],
  templateUrl: './auditoria.component.html',
  styleUrls: ['./auditoria.component.scss']
})
export class AuditoriaComponent implements OnInit {

  auditorias: Auditoria[] = [];
  isLoading: boolean = false;

  constructor(
    private readonly auditoriaService: AuditoriaService,
    private readonly spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.cargarAuditorias();
  }

  cargarAuditorias(): void {
    this.isLoading = true;
    this.spinner.show();

    this.auditoriaService.listarAuditorias().subscribe({
      next: (data) => {
        this.auditorias = data;
        this.isLoading = false;
        this.spinner.hide();
        console.log('✅ Auditorías cargadas:', data.length);
      },
      error: (error) => {
        this.isLoading = false;
        this.spinner.hide();
        console.error('Error al cargar auditorías:', error);
        Swal.fire({
          title: 'Error',
          text: 'No se pudieron cargar las auditorías',
          icon: 'error'
        });
      }
    });
  }

  formatearFecha(fecha: string): string {
    const date = new Date(fecha);
    return date.toLocaleString('es-CO', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }

  getEstadoClass(auditoria: Auditoria): string {
    if (auditoria.bloqueado) {
      return 'bloqueado';
    }
    if (auditoria.descripcionError.toLowerCase().includes('exitoso')) {
      return 'exitoso';
    }
    return 'fallido';
  }
}
