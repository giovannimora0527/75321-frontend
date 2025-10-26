import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CitasComponent } from './demo/pages/cita/cita.component';
import { FormulaComponent } from './demo/pages/formula/formula.component';
import { EspecializacionComponent } from './demo/pages/especializacion/especializacion.component';
import { HistoriaComponent } from './demo/pages/historia/historia.component';
import { MedicamentoComponent } from './demo/pages/medicamento/medicamento.component';
import { MedicoComponent } from './demo/pages/medico/medico.component';
import { PacienteComponent } from './demo/pages/paciente/paciente.component';
import { UsuarioComponent } from './demo/pages/usuario/usuario.component';
import { AdminComponent } from './theme/layout/admin/admin.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'inicio',
    pathMatch: 'full'
  },  
  {
    path: 'inicio',
    component: AdminComponent,
    data: { title: 'Inicio' },
    //Agregamos rutas Hijas en app-roouting
    children: [      
       { path: 'usuario', component: UsuarioComponent, data: { title: 'Usuario' }} ,
       { path: 'medico', component: MedicoComponent, data: { title: 'Medico' }},
       { path: 'paciente', component: PacienteComponent, data: { title: 'Paciente' }},
       { path: 'medicamentos', component: MedicamentoComponent, data: { title: 'Medicamentos' }},
       { path: 'citas', component: CitasComponent, data: { title: 'Citas' }},
       { path: 'formulas-medicas', component: FormulaComponent, data: { title: 'Fórmulas Médicas' }},
       { path: 'historias-medicas', component: HistoriaComponent, data: { title: 'Historias Médicas' }},
       { path: 'especializaciones', component: EspecializacionComponent, data: { title: 'Gestión de Especializaciones' }}

          
    ]
  },
  { path: '**', redirectTo: 'inicio' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
