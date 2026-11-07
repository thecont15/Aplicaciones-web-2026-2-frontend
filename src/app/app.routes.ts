import { Routes } from '@angular/router';
import { Shell } from './layout/shell/shell';
import { Vendedores } from './pages/vendedores/vendedores';

export const routes: Routes = [
  {
    path: '',
    component: Shell,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'vendedores' },
      { path: 'vendedores', component: Vendedores },
    ],
  },
  { path: '**', redirectTo: 'vendedores' },
];