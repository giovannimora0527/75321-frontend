import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './theme/layout/admin/admin.component';
import { UsuarioComponent } from './demo/pages/usuario/usuario.component';
import { MedicamentosComponent } from './demo/pages/medicamentos/medicamentos.component';
import { CitasComponent } from './demo/pages/citas/citas.component';
import { FormulasMedicasComponent } from './demo/pages/formula-medica/formulas-medicas.component';
import { HistoriasMedicasComponent } from './demo/pages/historia-medica/historias-medicas.component';
import { GestionEspecializacionesComponent } from './demo/pages/gestion-especializacion/gestion-especializaciones.component';

export const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: '',
        redirectTo: 'usuario',
        pathMatch: 'full'
      },
      { 
        path: 'usuario', 
        component: UsuarioComponent,
        data: { title: 'Gestión de Usuarios' }
      },
      { 
        path: 'medicamentos', 
        component: MedicamentosComponent,
        data: { title: 'Medicamentos' }
      },
      { 
        path: 'citas', 
        component: CitasComponent,
        data: { title: 'Citas' }
      },
      { 
        path: 'formula-medica', 
        component: FormulasMedicasComponent,
        data: { title: 'Fórmulas Médicas' }
      },
      { 
        path: 'historia-medica', 
        component: HistoriasMedicasComponent,
        data: { title: 'Historia Médica' }
      },
      { 
        path: 'gestion-especializacion', 
        component: GestionEspecializacionesComponent,
        data: { title: 'Especializaciones' }
      }
    ]
  },
  { 
    path: '**', 
    redirectTo: 'usuario' 
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}