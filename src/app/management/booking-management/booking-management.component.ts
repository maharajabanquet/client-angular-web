import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {MatTableModule} from '@angular/material/table';
import { BookingModalComponent } from 'src/app/modals/booking-modal/booking-modal.component';
import { BookingServiceService } from 'src/app/services/booking-service.service';
import Swal from 'sweetalert2'

export interface PeriodicElement {
  "_id": string,
  "bookingDate": string,
  "firstName": string,
  "lastName":string,
  "address": string,
  "invoice_generated": boolean,
  "clientName": string,
  "phoneNumber": string,
  "requirements": string,
  "BookingAmount": Number,
  "finalAmount": Number,
  "balancedAmount": Number,
  "status": string,
  "dgWithDiesel": string,
  "settled": boolean,
  "action": string
}

const ELEMENT_DATA: PeriodicElement[] = [];
@Component({
  selector: 'booking-management',
  templateUrl: './booking-management.component.html',
  styleUrls: ['./booking-management.component.css']
})
export class BookingManagementComponent implements OnInit {
  displayedColumns: string[] = [
    'position',
    'booking-date', 
    'client-name', 
    'contact-number',
    'requirements',
    'booking-amount',
    'final-amount',
    'balanced-amount',
    'dg-with-diesel',
    'settled',
    'status',
    'action'
  ];
    dataSource = ELEMENT_DATA;


  constructor(
    private bs: BookingServiceService,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.getData()
  }

  getData() {
    this.dataSource = [];
    this.bs.getLatestBooking().subscribe((res: any) => {
      const elements = (res && res.docs) || [];
      const mapElements = elements.map((element: any) => ({
        "_id": element._id,
        "bookingDate": element.bookingDate,
        "clientName": element.firstName + " " + element.lastName,
        "firstName": element.firstName,
        "lastName": element.lastName,
        "address": element.address,
        "invoice_generated": element.invoice_generated,
        "phoneNumber": element.phoneNumber,
        "requirements": element.requirements,
        "BookingAmount": element.BookingAmount,
        "finalAmount": element.finalAmount,
        "balancedAmount": element.balancedAmount,
        "status": element.status,
        "dgWithDiesel": element.dgWithDiesel,
        "settled": element.settled,
        "action": ''
      }))
      this.dataSource=mapElements;
    })
  }

  checkReq(req:string) {
    if(req === 'Wedding') {
      return 'wedding';
    } else if(req === 'Engagement'){
    return 'engagement'
   } else {
    return 'dekha-suno'
   }
  }

  checkStatus(status: string) {
    if(status === 'approved') {
      return 'approved'
    } else {
      return 'pending'
    }
  }

  notifyPayment(booking: any) {
    window.open(`https://wa.me/${booking.phoneNumber}?text=Gentle Reminder, Please clear your due amount of  Rs${booking.balancedAmount}/- before one week of your booking date: ${new Date(booking.bookingDate).toLocaleDateString()}`, '_blank')
  }

  edit(bookingData: any) {
  
    const dialogRef = this.dialog.open(BookingModalComponent, {
      width: 'auto',
      height: 'auto',
      data: {selectedDate: bookingData.bookingDate, disabled: true},
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
     this.getData();
     this.dialog.openDialogs.pop();
    });
  }

  delete(bookingData:any){ 
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.bs.purgeBooking(bookingData).subscribe((res: any) => {
          Swal.fire(
            'Deleted!',
            'Emplyee Data has been deleted.',
            'success'
          )
          this.getData();
        })
      }
    })
  }
}
