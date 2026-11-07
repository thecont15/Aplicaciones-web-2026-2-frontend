import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { environment } from '../../environments/environment';
import { ClienteService } from './cliente';

describe('ClienteService', () => {
  let service: ClienteService;
  let http: HttpTestingController;
  const url = `${environment.apiUrl}/clientes`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ClienteService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('lista con GET /clientes', () => {
    service.listar().subscribe();
    const req = http.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('obtiene con GET /clientes/{id}', () => {
    service.obtener(3).subscribe();
    const req = http.expectOne(`${url}/3`);
    expect(req.request.method).toBe('GET');
    req.flush({});
  });

  it('crea con POST /clientes', () => {
    service
      .crear({ nombre: 'Ana', apellido: 'Gómez', email: 'ana@example.com' })
      .subscribe();
    const req = http.expectOne(url);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      nombre: 'Ana',
      apellido: 'Gómez',
      email: 'ana@example.com',
    });
    req.flush({});
  });

  it('actualiza con PUT /clientes/{id}', () => {
    service.actualizar(3, { telefono: '3001234567' }).subscribe();
    const req = http.expectOne(`${url}/3`);
    expect(req.request.method).toBe('PUT');
    req.flush({});
  });

  it('elimina con DELETE /clientes/{id}', () => {
    service.eliminar(3).subscribe();
    const req = http.expectOne(`${url}/3`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});

