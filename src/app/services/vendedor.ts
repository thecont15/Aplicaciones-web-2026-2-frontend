import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Vendedor, VendedorCreate, VendedorUpdate } from '../models/vendedor.model';

@Injectable({ providedIn: 'root' })
export class VendedorService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/vendedores`;

  listar(): Observable<Vendedor[]> {
    return this.http.get<Vendedor[]>(this.base);
  }

  obtener(id: number): Observable<Vendedor> {
    return this.http.get<Vendedor>(`${this.base}/${id}`);
  }

  crear(datos: VendedorCreate): Observable<Vendedor> {
    return this.http.post<Vendedor>(this.base, datos);
  }

  actualizar(id: number, datos: VendedorUpdate): Observable<Vendedor> {
    return this.http.put<Vendedor>(`${this.base}/${id}`, datos);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}