import { Component } from '@angular/core';
import {
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';

@Component({
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  selector: 'app-shell',
  styleUrl: './shell.css',
  templateUrl: './shell.html',
})
export class Shell {
  readonly menu = [
    { ruta: '/vendedores', etiqueta: 'Vendedores' },
    { ruta: '/productos', etiqueta: 'Productos' },
  ];
}
