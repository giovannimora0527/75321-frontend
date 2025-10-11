import { Component } from '@angular/core';
import { Modal } from 'bootstrap';

//Importamos lo neceario para los formularios
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';

// Importa los objetos necesarios de Bootstrap
import { CommonModule } from '@angular/common';
import { Formula } from './model/formula';
import { FormulaMedicasService } from './service/formula-medicas.service';

@Component({
  selector: 'app-formulas-medicas',
  imports: [CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './formulas-medicas.component.html',
  styleUrl: './formulas-medicas.component.scss'
})
export class FormulasMedicasComponent {

  //variables para manipular en el modal
  modalInstance:Modal |null=null;
  modoFormulario:string='';
  titleModal:string='';
  titleBoton='';
  formulaList: Formula[] = [];
  formulaSelected:Formula;
  fechaActual = new Date();

    //Contenedor de los campos del formulario
    form:FormGroup=new FormGroup({

      //lo que se va inyectar en el formulario
      //Crear un campo Vacio
      username:new FormControl(''),
      password:new FormControl(''),
      rol:new FormControl(''),
      fechaCreacion:new FormControl(''),
      activo:new FormControl(''),
  
    })

    constructor(
      private readonly formulaService: FormulaMedicasService,
      private readonly formBuilder: FormBuilder
    ){
      this.ListarFormulas();

    }

    //Logica De negocio
    ListarFormulas(){
      console.log('Entro a cargar usuarios');
    this.formulaService.listarFormulas().subscribe({
      next: (formula:Formula[]) => {
        this.formulaList = formula;
        
      },
      error: (err) => console.error('Error al cargar Formulas', err),
    });
    }



    //Logica del formulario
    //Valida los cambios de Manera asincrona
    
abrirNuevaFormula() { /* lógica para abrir modal o formulario */ }
abrirEditarFormula(formula: any) { /* lógica para editar */ }
trackById(index: number, item: any) { return item.id; }
  

}