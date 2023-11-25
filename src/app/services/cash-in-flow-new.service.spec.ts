import { TestBed } from '@angular/core/testing';

import { CashInFlowNewService } from './cash-in-flow-new.service';

describe('CashInFlowNewService', () => {
  let service: CashInFlowNewService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CashInFlowNewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
