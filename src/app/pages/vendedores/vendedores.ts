import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Vendedor, VendedorCreate } from '../../models/vendedor.model';
import { VendedorService } from '../../services/vendedor';

@Component({
  imports: [FormsModule],
  selector: 'app-vendedores',
  styleUrl: './vendedores.css',
  templateUrl: './vendedores.html',
})
export class Vendedores implements OnInit {
  private readonly vendedorService = inject(VendedorService);

  filas: Vendedor[] = [];
  mensaje = '';
  idFiltro = '';
  popupAbierto = false;
  guardando = false;
  modo: 'crear' | 'editar' = 'crear';
  vendedorEditandoId: number | null = null;
  formulario: VendedorCreate = this.nuevoFormulario();

  ngOnInit(): void {
    this.cargarVendedores();
  }

  cargarVendedores(): void {
    this.vendedorService.listar().subscribe({
      next: (vendedores) => {
        this.filas = vendedores;
        this.mensaje = '';
      },
      error: (error: HttpErrorResponse) => {
        this.mensaje = this.mensajeError(error);
      },
    });
  }

  buscarPorId(): void {
    const id = Number(this.idFiltro);
    if (!Number.isInteger(id) || id < 1) {
      this.mensaje = 'Ingresa un ID válido.';
      return;
    }

    this.vendedorService.obtener(id).subscribe({
      next: (vendedor) => {
        this.filas = [vendedor];
        this.mensaje = '';
      },
      error: (error: HttpErrorResponse) => {
        this.filas = [];
        this.mensaje = this.mensajeError(error);
      },
    });
  }

  limpiarFiltro(): void {
    this.idFiltro = '';
    this.cargarVendedores();
  }

  abrirCrear(): void {
    this.modo = 'crear';
    this.vendedorEditandoId = null;
    this.formulario = this.nuevoFormulario();
    this.popupAbierto = true;
  }

  abrirEditar(vendedor: Vendedor): void {
    this.modo = 'editar';
    this.vendedorEditandoId = vendedor.id;
    this.formulario = {
      nombre: vendedor.nombre,
      apellido: vendedor.apellido,
      email: vendedor.email,
      telefono: vendedor.telefono,
      activo: vendedor.activo,
    };
    this.popupAbierto = true;
  }

  cerrarPopup(): void {
    if (!this.guardando) {
      this.popupAbierto = false;
    }
  }

  guardar(): void {
    let solicitud: Observable<Vendedor>;
    if (this.modo === 'crear') {
      solicitud = this.vendedorService.crear(this.formulario);
    } else {
      const vendedorId = this.vendedorEditandoId;
      if (vendedorId === null) {
        this.mensaje = 'No se encontró el vendedor que se desea editar.';
        return;
      }

      solicitud = this.vendedorService.actualizar(vendedorId, this.formulario);
    }

    this.guardando = true;
    solicitud.subscribe({
      next: () => {
        this.guardando = false;
        this.popupAbierto = false;
        this.mensaje =
          this.modo === 'crear'
            ? 'Vendedor creado correctamente.'
            : 'Vendedor actualizado correctamente.';
        this.cargarVendedores();
      },
      error: (error: HttpErrorResponse) => {
        this.guardando = false;
        this.mensaje = this.mensajeError(error);
      },
    });
  }

  eliminar(vendedor: Vendedor): void {
    this.vendedorService.eliminar(vendedor.id).subscribe({
      next: () => {
        this.mensaje = 'Vendedor eliminado correctamente.';
        this.cargarVendedores();
      },
      error: (error: HttpErrorResponse) => {
        this.mensaje = this.mensajeError(error);
      },
    });
  }

  private nuevoFormulario(): VendedorCreate {
    return {
      nombre: '',
      apellido: '',
      email: '',
      telefono: null,
      activo: true,
    };
  }

  private mensajeError(error: HttpErrorResponse): string {
    const detalle = error.error?.detail;
    return typeof detalle === 'string'
      ? detalle
      : `No se pudo completar la solicitud (${error.status}).`;
  }
}
