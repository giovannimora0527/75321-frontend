import { Component, AfterViewInit } from '@angular/core';
import { RecetaService } from './service/Formula.service';
import { Formula } from './models/formula';
import { CommonModule } from '@angular/common';
// Import Bootstrap JS for tooltips
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

@Component({
  selector: 'app-formula',
  imports: [CommonModule],
  templateUrl: './formula.component.html',
  styleUrl: './formula.component.scss'
})
export class FormulaComponent implements AfterViewInit {
  formulaList: Formula[] = [];

  constructor(private readonly recetaService: RecetaService) {
    this.listarTodasLasRecetas();
  }

  ngAfterViewInit() {
    // Inicializa el tooltip de Bootstrap
    this.initializeTooltips();
  }

  listarTodasLasRecetas() {
    this.recetaService.listarTodasLasRecetas().subscribe({
      next: (data) => {
        console.log(data);
        this.formulaList = data;
        // Re-initialize tooltips after data is loaded
        setTimeout(() => this.initializeTooltips(), 0);
      },
      error: (error) => {
        console.error('Error fetching formula:', error);
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
