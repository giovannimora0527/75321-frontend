import { Component, AfterViewInit } from '@angular/core';
import { CitaService } from './service/citas.service';
import { Citas } from './models/citas';
import { CommonModule } from '@angular/common';
// Import Bootstrap JS for tooltips
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

@Component({
  selector: 'app-cita',
  imports: [CommonModule],
  templateUrl: './citas.component.html',
  styleUrl: './citas.component.scss'
})
export class CitaComponent implements AfterViewInit {
  citaList: Citas[] = [];

  constructor(private readonly citaService: CitaService) {
    this.listarTodasLasCitas();
  }

  ngAfterViewInit() {
    // Inicializa el tooltip de Bootstrap
    this.initializeTooltips();
  }

  listarTodasLasCitas() {
    this.citaService.listarCitas().subscribe({
      next: (data) => {
        console.log(data);
        this.citaList = data;
        // Re-initialize tooltips after data is loaded
        setTimeout(() => this.initializeTooltips(), 0);
      },
      error: (error) => {
        console.error('Error fetching citas:', error);
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
