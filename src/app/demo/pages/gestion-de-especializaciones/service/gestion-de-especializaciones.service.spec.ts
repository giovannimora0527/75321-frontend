import { TestBed } from '@angular/core/testing';

import { GestionDeEspecializacionesService } from './gestion-de-especializaciones.service';

describe('GestionDeEspecializacionesService', () => {
  let service: GestionDeEspecializacionesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GestionDeEspecializacionesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
