import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { medico } from './model/medico';
import { MedicoService } from './service/medico.service';

@Component({
  selector: 'app-medico',
  imports: [CommonModule],
  templateUrl: './medico.component.html',
  styleUrl: './medico.component.scss'
})
export class MedicoComponent {
  //Listar Medicos
  medicoList: medico[] = [];

  //constrcutor
  constructor(private readonly medicoService: MedicoService) {
    this.listarMedico();
  }
  //Necesitamos implementar el metodo
  listarMedico(){
    this.medicoService.listarMedicos().subscribe({
      next: (data) => {
        console.log(data);
        this.medicoList = data;
      },
      error: (error) => {
        console.error('Error al cargar medicos', error);
      }
    });
  }
}