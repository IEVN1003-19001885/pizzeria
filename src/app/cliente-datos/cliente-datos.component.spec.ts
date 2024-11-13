import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClienteDatosComponent } from './cliente-datos.component';

describe('ClienteDatosComponent', () => {
  let component: ClienteDatosComponent;
  let fixture: ComponentFixture<ClienteDatosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClienteDatosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClienteDatosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
