import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './theme/layout/admin/admin.component';
import { UsuarioComponent } from './demo/pages/usuario/usuario.component';
import { MedicoComponent } from './demo/pages/medico/medico.component';
import { PacienteComponent } from './demo/pages/paciente/paciente.component';
import { MedicamentoComponent } from './demo/pages/Medicamentos/medicamento.component';
import { CitaComponent } from './demo/pages/Citas/citas.component';
import { FormulaComponent } from './demo/pages/Formulas-Medicas/formula.component';

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
    children: [      
       { path: 'usuario', component: UsuarioComponent, data: { title: 'Usuario' }},
       { path: 'medico', component: MedicoComponent, data: { title: 'Medico' }},
       { path: 'paciente', component: PacienteComponent, data: { title: 'Paciente' }}, 
       { path: 'Medicamentos', component: MedicamentoComponent, data: { title: 'Medicamento' }}, 
       { path: 'Citas', component: CitaComponent, data: { title: 'Cita' }}, 
       { path: 'Formulas-Medicas', component: FormulaComponent, data: { title: 'Formula' }} 
    ]
  },
  { path: '**', redirectTo: 'inicio' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
