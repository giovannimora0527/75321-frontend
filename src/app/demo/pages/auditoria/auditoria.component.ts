import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { AuditoriaService } from 'src/app/services/auditoria.service'; // Ajusta la ruta si es necesario
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-auditoria',
  standalone: true,
 imports: [
    CommonModule, 
    SharedModule, // <--- ESTO SOLUCIONA EL ERROR DE <app-card>
    FormsModule, 
    ReactiveFormsModule, 
    NgxSpinnerModule
  ],
  templateUrl: './auditoria.component.html',
  styleUrls: ['./auditoria.component.scss']
})

export class AuditoriaComponent implements OnInit {
  logs: any[] = [];
  filterForm: FormGroup;
  totalElements: number = 0;
  currentPage: number = 0;
  pageSize: number = 10;

  constructor(
    private auditoriaService: AuditoriaService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService
  ) {
    this.filterForm = this.fb.group({
      username: [''],
      tipo: [''],
      fechaInicio: [''],
      fechaFin: ['']
    });
  }

  ngOnInit(): void {
    this.buscarLogs();
  }

  buscarLogs() {
    this.spinner.show();
    const filtros = this.filterForm.value;
    
    this.auditoriaService.getLogs(filtros, this.currentPage, this.pageSize).subscribe({
      next: (resp: any) => {
        this.logs = resp.content;
        this.totalElements = resp.totalElements;
        this.spinner.hide();
      },
      error: (err) => {
        console.error(err);
        this.spinner.hide();
      }
    });
  }

  cambiarPagina(delta: number) {
    this.currentPage += delta;
    if (this.currentPage < 0) this.currentPage = 0;
    this.buscarLogs();
  }
  
  limpiar() {
    this.filterForm.reset();
    this.currentPage = 0;
    this.buscarLogs();
  }
}