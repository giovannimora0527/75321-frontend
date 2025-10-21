import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CitasComponent } from './demo/pages/citas/citas.component';
import { FormulasMedicasComponent } from './demo/pages/formulas-medicas/formulas-medicas.component';
import { GestionDeEspecializacionesComponent } from './demo/pages/gestion-de-especializaciones/gestion-de-especializaciones.component';
import { HistoriasMedicasComponent } from './demo/pages/historias-medicas/historias-medicas.component';
import { MedicamentosComponent } from './demo/pages/medicamentos/medicamentos.component';
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
       { path: 'medicamentos', component: MedicamentosComponent, data: { title: 'Medicamentos' }},
       { path: 'citas', component: CitasComponent, data: { title: 'Citas' }},
       { path: 'formulas-medicas', component: FormulasMedicasComponent, data: { title: 'Fórmulas Médicas' }},
       { path: 'historias-medicas', component: HistoriasMedicasComponent, data: { title: 'Historias Médicas' }},
       { path: 'especializaciones', component: GestionDeEspecializacionesComponent, data: { title: 'Gestión de Especializaciones' }}

          
    ]
  },
  { path: '**', redirectTo: 'inicio' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
