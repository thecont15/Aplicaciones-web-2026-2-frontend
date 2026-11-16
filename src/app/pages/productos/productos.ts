import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto, ProductoCreate } from '../../models/producto.model';
import { ProductoService } from '../../services/producto';

@Component({
  imports: [FormsModule],
  selector: 'app-productos',
  styleUrl: './productos.css',
  templateUrl: './productos.html',
})
export class Productos implements OnInit {
  private readonly productoService = inject(ProductoService);

  readonly filas = signal<Producto[]>([]);
  readonly mensaje = signal('');
  readonly popupAbierto = signal(false);
  readonly guardando = signal(false);
  readonly errorPopup = signal('');
  readonly modo = signal<'crear' | 'editar'>('crear');
  idFiltro = '';
  productoEditandoId: number | null = null;
  formulario: ProductoCreate = this.nuevoFormulario();

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos(mensajeExito = ''): void {
    this.productoService.listar().subscribe({
      next: (productos) => {
        this.filas.set(productos);
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

    this.productoService.obtener(id).subscribe({
      next: (producto) => {
        this.filas.set([producto]);
        this.mensaje.set('');
      },
      error: (error: HttpErrorResponse) => {
        this.filas.set([]);
        this.mensaje.set(
          error.status === 404
            ? `No se encontró un producto con el ID ${id}.`
            : this.mensajeError(error),
        );
      },
    });
  }

  limpiarFiltro(): void {
    this.idFiltro = '';
    this.cargarProductos();
  }

  abrirCrear(): void {
    this.modo.set('crear');
    this.productoEditandoId = null;
    this.formulario = this.nuevoFormulario();
    this.errorPopup.set('');
    this.popupAbierto.set(true);
  }

  abrirEditar(producto: Producto): void {
    this.modo.set('editar');
    this.productoEditandoId = producto.id;
    this.formulario = {
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: producto.precio,
      stock: producto.stock,
      activo: producto.activo,
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
    let solicitud: Observable<Producto>;
    const modoActual = this.modo();
    const datos: ProductoCreate = {
      ...this.formulario,
      descripcion: this.formulario.descripcion?.trim() || null,
    };
    if (modoActual === 'crear') {
      solicitud = this.productoService.crear(datos);
    } else {
      const productoId = this.productoEditandoId;
      if (productoId === null) {
        this.mensaje.set('No se encontró el producto que se desea editar.');
        return;
      }

      solicitud = this.productoService.actualizar(productoId, datos);
    }

    this.guardando.set(true);
    this.errorPopup.set('');
    solicitud.subscribe({
      next: () => {
        this.guardando.set(false);
        this.popupAbierto.set(false);
        this.cargarProductos(
          modoActual === 'crear'
            ? 'Producto creado correctamente.'
            : 'Producto actualizado correctamente.',
        );
      },
      error: (error: HttpErrorResponse) => {
        this.guardando.set(false);
        this.errorPopup.set(this.mensajeError(error));
      },
    });
  }

  eliminar(producto: Producto): void {
    this.productoService.eliminar(producto.id).subscribe({
      next: () => {
        this.cargarProductos('Producto eliminado correctamente.');
      },
      error: (error: HttpErrorResponse) => {
        this.mensaje.set(this.mensajeError(error));
      },
    });
  }

  private nuevoFormulario(): ProductoCreate {
    return {
      nombre: '',
      descripcion: null,
      precio: 0.01,
      stock: 0,
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
