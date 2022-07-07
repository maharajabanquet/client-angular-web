import { BookingServiceService } from 'src/app/services/booking-service.service';
import {
  Component,
  OnInit,
} from '@angular/core';
@Component({
  selector: 'public-calendar',
  templateUrl: './public-calendar.component.html',
  styleUrls: ['./public-calendar.component.css'],
})
export class PublicCalendarComponent implements OnInit {
  confirmBooking: any = [];
  sortedDates: any = [];
  date: any = '2022-12-06T18:30:00.000Z'
  constructor(private bookingService: BookingServiceService) {
    
  }

  ngOnInit(): void {
    this.getBookedDates();
  }

 
  getBookedDates() {
    let highlightDates : any = [];
    let holdDates: any = [];
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    this.bookingService.getAllBookingDate().subscribe((date: any) => {
      const d = new Date();
      const bookings = date && date.bookingData || []
      for(let index=0; index < bookings.length; index++) {
        if(bookings && bookings[index].status === "approved") {
          const bookingDateFormat = bookings && bookings[index].bookingDate;
          this.confirmBooking.push(new Date(bookingDateFormat).toISOString())
        }
        this.sortedDates = this.confirmBooking.sort();
        
      }       

      
      
    })
  }
}
