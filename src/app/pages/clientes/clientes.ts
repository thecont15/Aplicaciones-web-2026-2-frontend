import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cliente, ClienteCreate } from '../../models/cliente.model';
import { ClienteService } from '../../services/cliente';

@Component({
  imports: [FormsModule],
  selector: 'app-clientes',
  styleUrl: './clientes.css',
  templateUrl: './clientes.html',
})
export class Clientes implements OnInit {
  private readonly clienteService = inject(ClienteService);

  readonly filas = signal<Cliente[]>([]);
  readonly mensaje = signal('');
  readonly popupAbierto = signal(false);
  readonly guardando = signal(false);
  readonly errorPopup = signal('');
  readonly modo = signal<'crear' | 'editar'>('crear');
  idFiltro = '';
  clienteEditandoId: number | null = null;
  formulario: ClienteCreate = this.nuevoFormulario();

  ngOnInit(): void {
    this.cargarClientes();
  }

  cargarClientes(mensajeExito = ''): void {
    this.clienteService.listar().subscribe({
      next: (clientes) => {
        this.filas.set(clientes);
        this.mensaje.set(mensajeExito);
      },
      error: (error: HttpErrorResponse) => {
        this.filas.set([]);
        this.mensaje.set(this.mensajeError(error));
      },
    });
  }

  buscarPorId(): void {
    const id = Number(this.idFiltro);
    if (!Number.isInteger(id) || id < 1) {
      this.mensaje.set('Ingresa un ID válido.');
      return;
    }

    this.clienteService.obtener(id).subscribe({
      next: (cliente) => {
        this.filas.set([cliente]);
        this.mensaje.set('');
      },
      error: (error: HttpErrorResponse) => {
        this.filas.set([]);
        this.mensaje.set(
          error.status === 404
            ? `No se encontró un cliente con el ID ${id}.`
            : this.mensajeError(error),
        );
      },
    });
  }

  limpiarFiltro(): void {
    this.idFiltro = '';
    this.cargarClientes();
  }

  abrirCrear(): void {
    this.modo.set('crear');
    this.clienteEditandoId = null;
    this.formulario = this.nuevoFormulario();
    this.errorPopup.set('');
    this.popupAbierto.set(true);
  }

  abrirEditar(cliente: Cliente): void {
    this.modo.set('editar');
    this.clienteEditandoId = cliente.id;
    this.formulario = {
      nombre: cliente.nombre,
      apellido: cliente.apellido,
      email: cliente.email,
      telefono: cliente.telefono,
      activo: cliente.activo,
    };
    this.errorPopup.set('');
    this.popupAbierto.set(true);
  }

  cerrarPopup(): void {
    if (!this.guardando()) {
      this.popupAbierto.set(false);
    }
  }

  guardar(): void {
    let solicitud: Observable<Cliente>;
    const modoActual = this.modo();
    const datos: ClienteCreate = {
      ...this.formulario,
      telefono: this.formulario.telefono?.trim() || null,
    };
    if (modoActual === 'crear') {
      solicitud = this.clienteService.crear(datos);
    } else {
      const clienteId = this.clienteEditandoId;
      if (clienteId === null) {
        this.mensaje.set('No se encontró el cliente que se desea editar.');
        return;
      }

      solicitud = this.clienteService.actualizar(clienteId, datos);
    }

    this.guardando.set(true);
    this.errorPopup.set('');
    solicitud.subscribe({
      next: () => {
        this.guardando.set(false);
        this.popupAbierto.set(false);
        this.cargarClientes(
          modoActual === 'crear'
            ? 'Cliente creado correctamente.'
            : 'Cliente actualizado correctamente.',
        );
      },
      error: (error: HttpErrorResponse) => {
        this.guardando.set(false);
        this.errorPopup.set(this.mensajeError(error));
      },
    });
  }

  eliminar(cliente: Cliente): void {
    this.clienteService.eliminar(cliente.id).subscribe({
      next: () => {
        this.cargarClientes('Cliente eliminado correctamente.');
      },
      error: (error: HttpErrorResponse) => {
        this.mensaje.set(this.mensajeError(error));
      },
    });
  }

  private nuevoFormulario(): ClienteCreate {
    return {
      nombre: '',
      apellido: '',
      email: '',
      telefono: null,
      activo: true,
    };
  }

  private mensajeError(error: HttpErrorResponse): string {
    if (error.status === 0) {
      return 'No hubo conexión con el servidor. Verifica que la API esté encendida.';
    }
    const detalle = error.error?.detail;
    if (typeof detalle === 'string') {
      return detalle;
    }
    if (Array.isArray(detalle)) {
      return detalle
        .map((e: { loc?: unknown[]; msg?: string }) => `${e.loc?.at(-1) ?? 'campo'}: ${e.msg ?? 'inválido'}`)
        .join(' · ');
    }
    return `No se pudo completar la solicitud (${error.status}).`;
  }
}

