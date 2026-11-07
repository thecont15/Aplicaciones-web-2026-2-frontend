import { Routes } from '@angular/router';
import { Shell } from './layout/shell/shell';
import { Clientes } from './pages/clientes/clientes';
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
      { path: 'clientes', component: Clientes },
    ],
  },
  { path: '**', redirectTo: 'vendedores' },
];