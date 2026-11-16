import { Routes } from '@angular/router';
import { Shell } from './layout/shell/shell';
import { Productos } from './pages/productos/productos';
import { Vendedores } from './pages/vendedores/vendedores';

export const routes: Routes = [
  {
    path: '',
    component: Shell,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'vendedores' },
      { path: 'vendedores', component: Vendedores },
      { path: 'productos', component: Productos },
    ],
  },
  { path: '**', redirectTo: 'vendedores' },
];