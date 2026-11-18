import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Inventario, InventarioCreate, InventarioUpdate } from '../models/inventario.model';

@Injectable({ providedIn: 'root' })
export class InventarioService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/inventarios`;

  listar(): Observable<Inventario[]> {
    return this.http.get<Inventario[]>(this.base);
  }

  obtener(id: string): Observable<Inventario> {
    return this.http.get<Inventario>(`${this.base}/${id}`);
  }

  crear(datos: InventarioCreate): Observable<Inventario> {
    return this.http.post<Inventario>(this.base, datos);
  }

  actualizar(id: string, datos: InventarioUpdate): Observable<Inventario> {
    return this.http.put<Inventario>(`${this.base}/${id}`, datos);
  }

  eliminar(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
