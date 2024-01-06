import {
  BookingServiceService
} from 'src/app/services/booking-service.service';
import {map, startWith} from 'rxjs/operators';

import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef,
  OnInit,
  ViewEncapsulation,
  Input,
  Output,
  EventEmitter
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
import {
  Observable,
  Subject
} from 'rxjs';

import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView,
} from 'angular-calendar';
import {
  EventColor
} from 'calendar-utils';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { EnquiryServiceService } from '../services/enquiry-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EnquiryComponent } from '../components/enquiry/enquiry.component';

const colors: Record < string, EventColor > = {
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
  gold: {
    primary: '#CFA240',
    secondary: '#CFA240',


  }
};
declare const window: any;

@Component({
  selector: 'public-calendar',
  templateUrl: './public-calendar.component.html',
  // styleUrls: ['./public-calendar.component.css'],
  styles: [
    `
    .lagan {
      height: 15px;
      width: 15px;
      background-color: #CFA240;
      border-radius: 50%;
      display: inline-block;
    }
    .booking {
      height: 15px;
      width: 15px;
      background-color: #ad2121;
      border-radius: 50%;
      
      display: inline-block;
    }
    .cal-month-view .cal-event-title {
    cursor: pointer;
    font-weight: bold;
}
      .my-custom-class span {
        color: orange;
        animation: blinker 2s linear infinite;
        font-size:15px;
        font-weight: bold;
      }
      .cal-month-view .cal-day-badge {
      background-color: grey;;
      color: #fff;
      opacity:0
}
.cal-month-view .cal-day-cell.cal-in-month.cal-has-events {
  cursor: pointer;
    background: #932d2d;
    color: #fff900;
    font-weight: bolder;
    font-size: 21px;
}

.cal-month-view .cal-day-cell.cal-weekend .cal-day-number {
  color: #17180f;
  font-weight:bold;
  font-size: 21px;

}
      @keyframes blinker {
  50% {
    opacity: 0;
  }
}
    `,
  ],
  encapsulation: ViewEncapsulation.None
})
export class PublicCalendarComponent implements OnInit {
  @ViewChild('modalContent', {
    static: true
  }) modalContent!: TemplateRef < any > ;
  myControl = new FormControl();
  options: string[] = ['One', 'Two', 'Three'];
  filteredOptions!: Observable<string[]>;
  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;
  visitorCodeForm !: FormGroup;
  viewDate: Date = new Date();
  isready !: Boolean
  @Input() status!: String;
  @Output() isReady = new EventEmitter();
  showSubmitBtn : boolean = false;
  modalData!: {
    action: string;
    event: CalendarEvent;
  };

  actions: CalendarEventAction[] = [{
      label: '<i class="fas fa-fw fa-pencil-alt"></i>',
      a11yLabel: 'Edit',
      onClick: ({
        event
      }: {
        event: CalendarEvent
      }): void => {
        this.handleEvent('Edited', event);
      },
    },
    {
      label: '<i class="fas fa-fw fa-trash-alt"></i>',
      a11yLabel: 'Delete',
      onClick: ({
        event
      }: {
        event: CalendarEvent
      }): void => {
        this.events = this.events.filter((iEvent) => iEvent !== event);
        this.handleEvent('Deleted', event);
      },
    },
  ];

  refresh = new Subject < void > ();

  events: CalendarEvent[] = [];

  activeDayIsOpen: boolean = false;
  visitCodeEntered: boolean = false;
  isSubmitBtn: boolean = false;
  isOpenModal: boolean = false;
  visitorCode: any = null;
  isLoggedIN!: boolean;
  public menuActive = false;
  innerHeight: any;
  innerWidth: any;

  constructor(private bookingService: BookingServiceService, private dialog:MatDialog, private enService: EnquiryServiceService, private fb: FormBuilder, private _snackBar: MatSnackBar,
    ) {
      window.otpless = (otplessUser: any) => {
        this.bookingService.otpAuthAdd({user: JSON.stringify(otplessUser)}).subscribe(res => {
          this.visitCodeEntered = true;
        })
       };

       this.bookingService.getAuthUser().subscribe((user) => {
        
       })
  }

  submitVisitorCode() {
    if(this.visitorCodeForm.getRawValue() && this.visitorCodeForm.getRawValue().visitorCode) {
      this.enService.verifyVisitorCode(this.visitorCodeForm.getRawValue()).subscribe((status) => {
        this.visitCodeEntered = true;
      }, (err) =>{
        this._snackBar.open('Invalid Visitor Code, Please contact Us For Visitor Code', 'OK');
        this.visitorCodeForm.reset()
        this.visitCodeEntered = false;
      })
    }
  }

  openDialog(date: any) {
    const dialogRef = this.dialog.open(EnquiryComponent, {
      data: {'date': date, 'title': 'Booking Form'},
      width: this.innerWidth,
      height: this.innerHeight
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }
  

  ngOnInit(): void {
    this.innerHeight = window.innerHeight;
    this.innerWidth = window.innerWidth;
    this.visitorCodeForm = this.fb.group({
      visitorCode : ['', [Validators.required]]
    })

    this.visitorCodeForm.get('visitorCode')?.valueChanges.subscribe((value: any) => {
      if(value) {
        this.isSubmitBtn = true;
      } else {
        this.isSubmitBtn = false;
        this.visitCodeEntered = false;
      }
    })
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
    this.getBookedDates();
    // this.getLaganDate();
    if(localStorage.getItem('token')) {
      this.visitCodeEntered = true;
    }
  }
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }
  dayClicked({
    date,
    events
  }: {
    date: Date;events: CalendarEvent[]
  }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      if(!this.activeDayIsOpen) {
        this.openDialog(date)
      }
      
      
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
    this.handleEvent('Dropped or resized', event);
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = {
      event,
      action
    };
  }

  isVisitorCodes() {
    if(this.visitCodeEntered) {
      return 'filter:blur(0px)';
    } else {
      return 'filter:blur(8px)'
    }
  }

  isOpen() {
    this.isOpenModal = true;
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

  getBookedDates() {
    this.isready = false;
    var i = this;
    this.bookingService.getAllBookingDate().subscribe((bookingData: any) => {
      let bookingDataIns = bookingData.bookingData;
      for (let index = 0; index < bookingDataIns.length; index++) {
        if (bookingDataIns[index] && bookingDataIns[index].status === 'approved') {
          var bookingDate = bookingDataIns[index].bookingDate;
          this.events.push({
            start: addHours(new Date(bookingDate), 10),
            end: addHours(new Date(bookingDate), 23),
            title: "मैरिज हॉल बुक हो चुका है -  " + addHours(new Date(bookingDate), 10),
            color: colors.red,
           
          })
        }
        this.isready = true;
        this.isReady.emit(true);
      }
    })
  }

  getLaganDate() {
    this.bookingService.getLagan().subscribe((laganDate: any) => {
      for (let index = 0; index < laganDate.length; index++) {
        this.events.push({
          start: new Date(laganDate[index].date),
          end: new Date(laganDate[index].date),
          title: laganDate[index].description,
          color: colors.gold,
          cssClass: 'my-custom-class',
          
        })

      }
     
    })
  }



}


@Component({
  selector: 'dialog-animations-example-dialog',
  templateUrl: 'enquiry.html',
  styles: [`
  button {
    margin-right: 8px;
  }`]
})
export class DialogAnimationsExampleDialog {
  constructor(public dialogRef: MatDialogRef<DialogAnimationsExampleDialog>) {}
}