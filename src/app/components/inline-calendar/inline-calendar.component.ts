import { Subject } from 'rxjs';



import { Component, OnInit, Input, HostListener } from '@angular/core';
import { MatCalendarCellCssClasses } from '@angular/material/datepicker';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { BookingModalComponent } from 'src/app/modals/booking-modal/booking-modal.component';
import { BookingServiceService } from 'src/app/services/booking-service.service';

@Component({
  selector: 'inline-calendar',
  templateUrl: './inline-calendar.component.html',
  styleUrls: ['./inline-calendar.component.css']
})
export class InlineCalendarComponent implements OnInit {
  selected: Date | null | undefined;
   
  selectedDate: any;

 @Input() datesToHighlight = [];
  userActivity: any;
  userInactive: Subject<any> = new Subject();
   @Input() isPublic: boolean | undefined;
  animal: string | undefined;
  name: string | undefined;
  ready: boolean | undefined;
  holdDate  = [];
  completedBooking: any;
  pendingBooking: any;
  cancelledBooking: any;
  totalBooking: any;
  onSelect(event: any){
    let matchDate : any;
    this.selectedDate = event;
    this.datesToHighlight.forEach(data => {
      if(new Date(event).toISOString() === new Date(data).toISOString()) {
        matchDate =  new Date(data).toISOString()
      }
    })
    if(new Date(event).toISOString() !== matchDate) {
      this.openDialog(this.selectedDate, false)
    } else {
      this.openDialog(this.selectedDate, true)
    }
    
  }

  dateClass() {
    return (date: Date): MatCalendarCellCssClasses => {
      const highlightDate = this.datesToHighlight
        .map(strDate => new Date(strDate))
        .some(d => d.getDate() === date.getDate() && d.getMonth() === date.getMonth() && d.getFullYear() === date.getFullYear());
      
        const holdDate = this.holdDate
        .map(strDate => new Date(strDate))
        .some(d => d.getDate() === date.getDate() && d.getMonth() === date.getMonth() && d.getFullYear() === date.getFullYear());

      if(highlightDate) {
        return 'special-date'
      } else if(holdDate) {
        return 'hold-date'
      } else {
        return ''
      }
      // return highlightDate ? 'special-date' : '';
    };
  }

  constructor(
    public dialog: MatDialog,
    private bookingService: BookingServiceService
  ) {
    this.setTimeout();
    this.getAllBooking()
    this.userInactive.subscribe(() => this.getBookedDates());
   }
   setStatus(status: any) {
    this.bookingService.setStatus.next(status);
   }

  ngOnInit(): void {
   this.getBookedDates();
  
 
  }

  getAllBooking() {
    this.bookingService.getBookingList().subscribe((bList: any) => {
      const data = bList && bList.success || [];
      this.totalBooking = data.length;
      let cCount = 1;
      let pCount = 1;
      let canCount = 1;
      for(let index=0; index < data.length; index++) {
        if(data[index].status === 'approved' && data[index].settled) {
          this.completedBooking = cCount++;
        }
        if(data[index].status === "cancelled") {
          this.cancelledBooking = canCount++;
        }
          if(data[index].settled === false) {
            this.pendingBooking = pCount++;
        }
      }
    })
  }
  setTimeout() {
    this.userActivity = setTimeout(() => this.userInactive.next(undefined), 300000);
  }

  @HostListener('window:mousemove') refreshUserState() {
    clearTimeout(this.userActivity);
    this.setTimeout();
  }

  openDialog(selectedDate: Date, disabled: any): void {
    if(!this.isPublic) {
      let height = 'auto';
      if(disabled) {
        height = '100%';
      }
      const dialogRef = this.dialog.open(BookingModalComponent, {
        width: 'auto',
        height: 'auto',
        data: {selectedDate: selectedDate, disabled: disabled},
      });
  
      dialogRef.afterClosed().subscribe(result => {
        this.selectedDate = null;
       this.getBookedDates();
       this.dialog.openDialogs.pop();
      });
    }
   
  }

  getBookedDates() {
    this.ready = false;
    let highlightDates : any = [];
    let holdDates: any = [];
    this.bookingService.getAllBookingDate().subscribe((date: any) => {
      if(date && date.bookingData && date.bookingData.length > 0) {
        
        for(let index=0; index < date.bookingData.length; index++) {
        if(date.bookingData[index].status === 'pending') {
          let dateToFormat = new Date(date.bookingData[index].bookingDate).toLocaleDateString();
          holdDates.push(dateToFormat);
        } else   if(date.bookingData[index].status === 'approved') {
          let dateToFormat = new Date(date.bookingData[index].bookingDate).toLocaleDateString();
          highlightDates.push(dateToFormat);
        }
      }
      }
      this.datesToHighlight = highlightDates;
      if(!this.isPublic) {
        this.holdDate = holdDates;
      }
      this.ready = true;
      this.getAllBooking();
      
    })
  }

  

}
