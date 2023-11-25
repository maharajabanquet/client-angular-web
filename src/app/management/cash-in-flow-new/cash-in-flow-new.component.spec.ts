import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashInFlowNewComponent } from './cash-in-flow-new.component';

describe('CashInFlowNewComponent', () => {
  let component: CashInFlowNewComponent;
  let fixture: ComponentFixture<CashInFlowNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CashInFlowNewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CashInFlowNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
