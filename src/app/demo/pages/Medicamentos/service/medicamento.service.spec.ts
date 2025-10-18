/* tslint:disable:no-unused-variable */

import { TestBed } from '@angular/core/testing';
import { MedicamentoService } from './medicamento.service';

describe('MedicoService', () => {
  let service: MedicamentoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MedicamentoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
