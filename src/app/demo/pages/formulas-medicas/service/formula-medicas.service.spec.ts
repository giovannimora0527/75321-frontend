import { TestBed } from '@angular/core/testing';

import { FormulaMedicasService } from './formula-medicas.service';

describe('FormulaMedicasService', () => {
  let service: FormulaMedicasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormulaMedicasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
