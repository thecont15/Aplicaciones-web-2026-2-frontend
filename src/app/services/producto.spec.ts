import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { environment } from '../../environments/environment';
import { ProductoService } from './producto';

describe('ProductoService', () => {
  let service: ProductoService;
  let http: HttpTestingController;
  const url = `${environment.apiUrl}/productos`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ProductoService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('lista con GET /productos', () => {
    service.listar().subscribe();
    const req = http.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('obtiene con GET /productos/{id}', () => {
    service.obtener(3).subscribe();
    const req = http.expectOne(`${url}/3`);
    expect(req.request.method).toBe('GET');
    req.flush({});
  });

  it('crea con POST /productos', () => {
    service.crear({ nombre: 'Mouse', precio: 10 }).subscribe();
    const req = http.expectOne(url);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ nombre: 'Mouse', precio: 10 });
    req.flush({});
  });

  it('actualiza con PUT /productos/{id}', () => {
    service.actualizar(3, { stock: 5 }).subscribe();
    const req = http.expectOne(`${url}/3`);
    expect(req.request.method).toBe('PUT');
    req.flush({});
  });

  it('elimina con DELETE /productos/{id}', () => {
    service.eliminar(3).subscribe();
    const req = http.expectOne(`${url}/3`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
