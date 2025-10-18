/* tslint:disable:no-unused-variable */

import { TestBed } from '@angular/core/testing';
import { CitaService } from './citas.service';

describe('CitaService', () => {
  let service: CitaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CitaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
