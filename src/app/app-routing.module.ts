import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
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
       { path: 'paciente', component: PacienteComponent, data: { title: 'Paciente' }}
          
    ]
  },
  { path: '**', redirectTo: 'inicio' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
