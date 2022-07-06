import { BookingServiceService } from 'src/app/services/booking-service.service';
import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef,
  OnInit,
  OnChanges,
  SimpleChanges,
  AfterViewChecked,
  AfterContentChecked,
  ViewEncapsulation
} from '@angular/core';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours,
} from 'date-fns';
import { Subject } from 'rxjs';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView,
} from 'angular-calendar';

const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF',
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  },
};
@Component({
  selector: 'public-calendar',
  templateUrl: './public-calendar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./public-calendar.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class PublicCalendarComponent implements OnInit {
  @ViewChild('modalContent', { static: true }) modalContent!: TemplateRef<any>;

  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;

  viewDate: Date = new Date();

  modalData!: {
    action: string;
    event: CalendarEvent;
  };
  ready!: boolean;
  actions: CalendarEventAction[] = [
    {
      label: '<i class="fas fa-fw fa-pencil-alt"></i>',
      a11yLabel: 'Edit',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      },
    },
    {
      label: '<i class="fas fa-fw fa-trash-alt"></i>',
      a11yLabel: 'Delete',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter((iEvent) => iEvent !== event);
        this.handleEvent('Deleted', event);
      },
    },
  ];

  refresh = new Subject<void>();

 

  activeDayIsOpen: boolean = true;
  events: CalendarEvent[] = [];
  constructor(private bookingService: BookingServiceService) {
    
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }

      return iEvent;
    });
 
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };

  }

  addEvent(): void {
    this.events = [
      ...this.events,
      {
        title: 'New event',
        start: startOfDay(new Date()),
        end: endOfDay(new Date()),
        color: colors.red,
        draggable: true,
        resizable: {
          beforeStart: true,
          afterEnd: true,
        },
      },
    ];
 
  }

  deleteEvent(eventToDelete: CalendarEvent) {
    this.events = this.events.filter((event) => event !== eventToDelete);
  }

  setView(view: CalendarView) {
    this.view = view;

  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }
  ngOnInit(): void {
   this.getBookedDates();

    
  }

  getBookedDates() {
    this.ready = false;
    let highlightDates : any = [];
    let holdDates: any = [];
    this.bookingService.getAllBookingDate().subscribe((date: any) => {
      if(date && date.bookingData && date.bookingData.length > 0) {
        
        for(let index=0; index < date.bookingData.length; index++) {
        console.log(date.bookingData[index]);
        if(date.bookingData[index].status === 'approved') {
          let dateToFormat = new Date(date.bookingData[index].bookingDate).toLocaleDateString();
          highlightDates.push(dateToFormat);
        }
      }
      console.log(highlightDates);
      for(let index =0 ; index < highlightDates.length; index++) {
        this.events.push({
          start:startOfDay(new Date(highlightDates[index])),
          title: 'Marriage Hall has been booked.',
          color: colors.red,
          allDay: true,
          resizable: {
            beforeStart: true,
            afterEnd: true,
          },

        })
        this.refresh.next();
      
      }
      
    }
    })      
      
  }
 
}
