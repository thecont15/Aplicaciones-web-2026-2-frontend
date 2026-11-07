import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../environments/environment';
import { InventarioService } from './inventario';

describe('InventarioService', () => {
  let service: InventarioService;
  let http: HttpTestingController;
  const url = `${environment.apiUrl}/inventarios`;
  const id = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(InventarioService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('lista con GET /inventarios', () => {
    service.listar().subscribe();
    const req = http.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('obtiene por UUID con GET /inventarios/{id}', () => {
    service.obtener(id).subscribe();
    const req = http.expectOne(`${url}/${id}`);
    expect(req.request.method).toBe('GET');
    req.flush({});
  });

  it('crea con POST /inventarios', () => {
    const datos = {
      sku: 'SKU-01',
      nombre_producto: 'Teclado',
      precio: 25.5,
    };
    service.crear(datos).subscribe();
    const req = http.expectOne(url);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(datos);
    req.flush({});
  });

  it('actualiza con PUT /inventarios/{id}', () => {
    service.actualizar(id, { cantidad: 5 }).subscribe();
    const req = http.expectOne(`${url}/${id}`);
    expect(req.request.method).toBe('PUT');
    req.flush({});
  });

  it('elimina con DELETE /inventarios/{id}', () => {
    service.eliminar(id).subscribe();
    const req = http.expectOne(`${url}/${id}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
