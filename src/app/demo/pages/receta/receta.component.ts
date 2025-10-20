import { Component, AfterViewInit } from '@angular/core';
import { RecetaService } from './service/receta.service';
import { Receta } from './models/receta';
import { CommonModule } from '@angular/common';
// Import Bootstrap JS for tooltips
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

@Component({
  selector: 'app-receta',
  imports: [CommonModule],
  templateUrl: './receta.component.html',
  styleUrl: './receta.component.scss'
})
export class RecetaComponent implements AfterViewInit {
  recetaList: Receta[] = [];

  constructor(private readonly RecetaService: RecetaService) {
    this.listarTodasLasRecetas();
  }

  ngAfterViewInit() {
    // Inicializa el tooltip de Bootstrap
    this.initializeTooltips();
  }

  listarTodasLasRecetas() {
    this.RecetaService.listarTodasLasRecetas().subscribe({
      next: (data) => {
        console.log(data);
        this.recetaList = data;
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
