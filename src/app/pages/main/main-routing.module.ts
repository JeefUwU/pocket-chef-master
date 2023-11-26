import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainPage } from './main.page';

const routes: Routes = [
  {
    path: '',
    component: MainPage,
    children: [
      {
        path: 'home',
        loadChildren: () => import('./misrecetas/home.module').then( m => m.HomePageModule)
      },
      {
        path: 'profile',
        loadChildren: () => import('./perfil/profile.module').then( m => m.ProfilePageModule)
      },
      {
        path: 'recetas',
        loadChildren: () => import('./recetas/recetas.module').then( m => m.RecetasPageModule)
      },
      {
        path: 'calendario2',
        loadChildren: () => import('./calendario2/calendario2.module').then( m => m.Calendario2PageModule)
      },
    ]
  },
 
 
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainPageRoutingModule {}
