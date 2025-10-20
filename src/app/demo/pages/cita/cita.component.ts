import { Component, AfterViewInit } from '@angular/core';
import { CitaService } from './service/cita.service';
import { Cita } from './models/cita';
import { CommonModule } from '@angular/common';
// Import Bootstrap JS for tooltips
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

@Component({
  selector: 'app-cita',
  imports: [CommonModule],
  templateUrl: './cita.component.html',
  styleUrl: './cita.component.scss'
})
export class MedicamentoComponent implements AfterViewInit {
  citaList: Cita[] = [];


  constructor(private readonly citaService: CitaService) {
    this.listarMedicamentos();
  }

  ngAfterViewInit() {
    // Inicializa el tooltip de Bootstrap
    this.initializeTooltips();
  }

  listarMedicamentos() {
    this.citaService.listarMedicos().subscribe({
      next: (data) => {
        console.log(data);
        this.citaList = data;
        // Re-initialize tooltips after data is loaded
        setTimeout(() => this.initializeTooltips(), 0);
      },
      error: (error) => {
        console.error('Error fetching medicos:', error);
      }
    });
  }

  /**
   * Initialize Bootstrap tooltips
   */
  private initializeTooltips() {
    try {
      const tooltipTriggerList = Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
      tooltipTriggerList.forEach((tooltipTriggerEl) => {
        // Safe way to access Bootstrap's Tooltip constructor
        const bootstrapGlobal = (window as unknown as { bootstrap?: { Tooltip: new(element: Element) => void } }).bootstrap;
        if (bootstrapGlobal) {
          new bootstrapGlobal.Tooltip(tooltipTriggerEl);
        }
      });
    } catch (error) {
      console.warn('Bootstrap tooltips could not be initialized:', error);
    }
  }
}
