import { Component, OnInit, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { Inventario, InventarioCreate } from '../../models/inventario.model';
import { InventarioService } from '../../services/inventario';

@Component({
  imports: [DecimalPipe, FormsModule],
  selector: 'app-inventario',
  styleUrl: './inventario.css',
  templateUrl: './inventario.html',
})
export class InventarioPage implements OnInit {
  private readonly inventarioService = inject(InventarioService);

  readonly filas = signal<Inventario[]>([]);
  readonly mensaje = signal('');
  readonly popupAbierto = signal(false);
  readonly guardando = signal(false);
  readonly errorPopup = signal('');
  readonly modo = signal<'crear' | 'editar'>('crear');
  idFiltro = '';
  inventarioEditandoId: string | null = null;
  formulario: InventarioCreate = this.nuevoFormulario();

  ngOnInit(): void {
    this.cargarInventarios();
  }

  cargarInventarios(mensajeExito = ''): void {
    this.inventarioService.listar().subscribe({
      next: (inventarios) => {
        this.filas.set(inventarios);
        this.mensaje.set(mensajeExito);
      },
      error: (error: HttpErrorResponse) => {
        this.filas.set([]);
        this.mensaje.set(this.mensajeError(error));
      },
    });
  }

  buscarPorId(): void {
    const id = this.idFiltro.trim();
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
      this.mensaje.set('Ingresa un UUID válido.');
      return;
    }

    this.inventarioService.obtener(id).subscribe({
      next: (inventario) => {
        this.filas.set([inventario]);
        this.mensaje.set('');
      },
      error: (error: HttpErrorResponse) => {
        this.filas.set([]);
        this.mensaje.set(
          error.status === 404
            ? `No se encontró un registro de inventario con el ID ${id}.`
            : this.mensajeError(error),
        );
      },
    });
  }

  limpiarFiltro(): void {
    this.idFiltro = '';
    this.cargarInventarios();
  }

  abrirCrear(): void {
    this.modo.set('crear');
    this.inventarioEditandoId = null;
    this.formulario = this.nuevoFormulario();
    this.errorPopup.set('');
    this.popupAbierto.set(true);
  }

  abrirEditar(inventario: Inventario): void {
    this.modo.set('editar');
    this.inventarioEditandoId = inventario.id;
    this.formulario = {
      sku: inventario.sku,
      nombre_producto: inventario.nombre_producto,
      descripcion: inventario.descripcion,
      categoria: inventario.categoria,
      precio: inventario.precio,
      cantidad: inventario.cantidad,
      stock_minimo: inventario.stock_minimo,
      activo: inventario.activo,
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
    const modoActual = this.modo();
    const datos: InventarioCreate = {
      ...this.formulario,
      sku: this.formulario.sku.trim(),
      nombre_producto: this.formulario.nombre_producto.trim(),
      descripcion: this.formulario.descripcion?.trim() || null,
      categoria: this.formulario.categoria?.trim() || null,
    };
    let solicitud: Observable<Inventario>;

    if (modoActual === 'crear') {
      solicitud = this.inventarioService.crear(datos);
    } else {
      const inventarioId = this.inventarioEditandoId;
      if (inventarioId === null) {
        this.mensaje.set('No se encontró el registro que se desea editar.');
        return;
      }

      solicitud = this.inventarioService.actualizar(inventarioId, datos);
    }

    this.guardando.set(true);
    this.errorPopup.set('');
    solicitud.subscribe({
      next: () => {
        this.guardando.set(false);
        this.popupAbierto.set(false);
        this.cargarInventarios(
          modoActual === 'crear'
            ? 'Registro de inventario creado correctamente.'
            : 'Registro de inventario actualizado correctamente.',
        );
      },
      error: (error: HttpErrorResponse) => {
        this.guardando.set(false);
        this.errorPopup.set(this.mensajeError(error));
      },
    });
  }

  eliminar(inventario: Inventario): void {
    this.inventarioService.eliminar(inventario.id).subscribe({
      next: () => {
        this.cargarInventarios('Registro de inventario eliminado correctamente.');
      },
      error: (error: HttpErrorResponse) => {
        this.mensaje.set(this.mensajeError(error));
      },
    });
  }

  private nuevoFormulario(): InventarioCreate {
    return {
      sku: '',
      nombre_producto: '',
      descripcion: null,
      categoria: null,
      precio: 0,
      cantidad: 0,
      stock_minimo: 0,
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
        .map(
          (e: { loc?: unknown[]; msg?: string }) =>
            `${e.loc?.at(-1) ?? 'campo'}: ${e.msg ?? 'inválido'}`,
        )
        .join(' · ');
    }
    return `No se pudo completar la solicitud (${error.status}).`;
  }
}
