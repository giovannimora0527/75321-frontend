import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Modal } from 'bootstrap';
import { medico } from './models/medico';
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
  fechaActual = new Date();
  
  //variables para manipular en el modal
  modalInstance: Modal | null = null;
  modoFormulario: string = '';
  titleModal: string = '';
  titleBoton: string = '';
  medicoSelected: medico = new medico();

  //constructor
  constructor(private readonly medicoService: MedicoService) {
    this.listarMedico();
  }
  //Necesitamos implementar el metodo
  listarMedico() {
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

  //Preparar los datos para el modal
  openModal(modo: string) {
    this.titleModal = modo === 'C' ? 'Crear Médico' : 'Editar Médico';
    this.titleBoton = modo === 'C' ? 'Guardar Médico' : 'Actualizar Médico';
    this.modoFormulario = modo;
    const modalElement = document.getElementById('modalMedico');
    if (modalElement) {
      //Verifica si ya existe una instancia del modal
      this.modalInstance ??= new Modal(modalElement);
      this.modalInstance.show();
    }
  }

  abrirNuevoMedico() {
    this.medicoSelected = new medico();
    this.openModal('C');
  }

  abrirEditarMedico(medico: medico) {
    this.medicoSelected = medico;
    this.openModal('E');
  }

  //Cerrar el modal
  closeModal() {
    if (this.modalInstance) {
      this.modalInstance.hide();
    }
  }

  guardarMedico() {
    if (this.modoFormulario === 'C') {
      console.log('Creando médico:', this.medicoSelected);
      // Aquí iría tu lógica para crear médico
      this.medicoList.push(this.medicoSelected);
    } else {
      console.log('Actualizando médico:', this.medicoSelected);
      // Aquí lógica para actualizar
    }

    // Luego de guardar, cierra el modal
    this.closeModal();
  }
}