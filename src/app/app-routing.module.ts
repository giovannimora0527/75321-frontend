import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './theme/layout/admin/admin.component';
import { FormElementsModule } from './demo/pages/form-elements/form-elements.module';
import { UsuarioComponent } from './demo/pages/usuario/usuario.component';
import { MedicamentosComponent } from './demo/pages/medicamentos/medicamentos.component';
import { CitasComponent } from './demo/pages/citas/citas.component';
import { FormulasMedicasComponent } from './demo/pages/formula-medica/formulas-medicas.component';
import { HistoriasMedicasComponent } from './demo/pages/historia-medica/historias-medicas.component';
import { GestionEspecializacionesComponent } from './demo/pages/gestion-especializacion/gestion-especializaciones.component';


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
       { path: 'usuario', component: UsuarioComponent, data: { title: 'Usuario' }}
    ]
  },
  { path: '**', redirectTo: 'inicio' },

    { path: 'medicamentos',
      component: MedicamentosComponent },

    { path: 'citas',
      component: CitasComponent },

    { path: 'formula-medica',
      component: FormulasMedicasComponent },

    { path: 'historia-medica',
      component: HistoriasMedicasComponent },

    { path: 'gestion-especializacion',
      component: GestionEspecializacionesComponent },






];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
