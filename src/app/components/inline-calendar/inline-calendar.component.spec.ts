import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InlineCalendarComponent } from './inline-calendar.component';

describe('InlineCalendarComponent', () => {
  let component: InlineCalendarComponent;
  let fixture: ComponentFixture<InlineCalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InlineCalendarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InlineCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
