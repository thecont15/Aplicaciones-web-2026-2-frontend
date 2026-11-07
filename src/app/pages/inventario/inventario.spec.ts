import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InventarioPage } from './inventario';

describe('InventarioPage', () => {
  let component: InventarioPage;
  let fixture: ComponentFixture<InventarioPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventarioPage],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(InventarioPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
