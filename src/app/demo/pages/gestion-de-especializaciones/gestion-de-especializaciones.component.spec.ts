import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionDeEspecializacionesComponent } from './gestion-de-especializaciones.component';

describe('GestionDeEspecializacionesComponent', () => {
  let component: GestionDeEspecializacionesComponent;
  let fixture: ComponentFixture<GestionDeEspecializacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionDeEspecializacionesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionDeEspecializacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
