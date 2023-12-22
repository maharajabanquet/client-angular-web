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
  EventEmitter,
  Inject
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
import Swal from 'sweetalert2'
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
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EnquiryServiceService } from 'src/app/services/enquiry-service.service';
import { DialogData } from 'src/app/landing-page/photogallery/photogallery.component';

const colors: Record < string, EventColor > = {
  red: {
    primary: '#ad2121',
    secondary: '#ad2121',
  },
  blue: {
    primary: '#FFA500	',
    secondary: '#FFA500	',
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  },
  gold: {
    primary: '#CFA240',
    secondary: '#CFA240',
  },
};

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styles: [
    `
    .lagan {
      height: 15px;
      width: 15px;
      background-color: #CFA240;
      border-radius: 50%;
      display: inline-block;
    }
    .staff {
      height: 15px;
      width: 15px;
      background-color: rgb(173, 33, 33);
      border-radius: 50%;
      
      display: inline-block;
    }

    .manager {
      height: 15px;
      width: 15px;
      background-color: orange;
      border-radius: 50%;
      
      display: inline-block;
    }
    .cal-month-view .cal-event-title {
    cursor: pointer;
    font-weight: bold;
}
      .my-custom-class span {
        color: #CFA240;
        animation: blinker 2s linear infinite;
        font-size:15px;
        font-weight: bold;
      }
      .cal-month-view .cal-day-badge {
      background-color: grey;;
      color: #fff;
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

export class AttendanceComponent implements OnInit {
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
  
  constructor(private bookingService: BookingServiceService, private dialog:MatDialog, private enService: EnquiryServiceService, private fb: FormBuilder, private _snackBar: MatSnackBar,
    ) {

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

  ngOnInit(): void {
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
    this.getAttendance()
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
    const dialogRef = this.dialog.open(AttendanceDialog, {
      width: 'auto',
      height: 'auto',
      data: date,
    });
    dialogRef.afterClosed().subscribe(result => {
     this.getAttendance();
     this.dialog.openDialogs.pop();
    });
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

  getAttendance() {
    this.bookingService.getAttendance().subscribe((res: any)=> {
      this.isready = true;
      let attendanceList = res && res.attendance || []
      for(let index=0; index< attendanceList.length; index++) {
        let clr = colors.red;
        if(attendanceList[index].typeColor === 'staff') {
          clr = colors.red;
        } else {
          clr = colors.blue;
        }
        this.events.push({
          start: addHours(new Date(attendanceList[index].absentDate), 10),
          end: addHours(new Date(attendanceList[index].absentDate), 8),
          title: `${attendanceList[index].employeeName}: ${attendanceList[index].reason}`,
          color: clr,
          meta:  ``
        })
      }
    })
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

  openDialog(): void {
    window.open('https://wa.me/+919572177693/?text=Please share visitor Code', '_blank')
  }

}


@Component({
  selector: 'dialog-animations-example-dialog',
  templateUrl: 'attendance.html',
  styles: [`
  button {
    margin-right: 8px;
  }`]
})
export class AttendanceDialog implements OnInit{
  attendanceForm !: FormGroup;
  constructor( @Inject(MAT_DIALOG_DATA) public data: DialogData,public dialogRef: MatDialogRef<AttendanceDialog>, private fb: FormBuilder, private bs: BookingServiceService) {
    
  }
  submit() {
    const payload = {
      absentDate: this.data && this.data,
      employeeName: this.attendanceForm.get('employeeName')?.value,
      reason: this.attendanceForm.get('reason')?.value,
      typeColor: this.attendanceForm.get('typeColor')?.value
    }
    this.bs.markAbsent(payload).subscribe((resp: any) => {
      if(resp && resp.status === 'success') {
        Swal.fire(
          'Added!',
          'Cash Inflow Has Been Added',
          'success'
        )
        this.dialogRef.close()
      }
    },err => {
      Swal.fire(
        'OOPS!',
        'Something Went Wrong, Contact Ankit Kumar',
        'error'
      )
    })
   
  }

  ngOnInit(): void {
    this.attendanceForm = this.fb.group({
      employeeName: ['', [Validators.required]],
      reason: ['', [Validators.required]],
      typeColor: ['', [Validators.required]]
    })
  }
}