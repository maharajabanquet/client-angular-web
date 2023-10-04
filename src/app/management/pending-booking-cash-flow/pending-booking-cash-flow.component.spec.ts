import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingBookingCashFlowComponent } from './pending-booking-cash-flow.component';

describe('PendingBookingCashFlowComponent', () => {
  let component: PendingBookingCashFlowComponent;
  let fixture: ComponentFixture<PendingBookingCashFlowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PendingBookingCashFlowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PendingBookingCashFlowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
