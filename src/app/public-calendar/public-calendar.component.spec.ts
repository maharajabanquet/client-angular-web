import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicCalendarComponent } from './public-calendar.component';

describe('PublicCalendarComponent', () => {
  let component: PublicCalendarComponent;
  let fixture: ComponentFixture<PublicCalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PublicCalendarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
