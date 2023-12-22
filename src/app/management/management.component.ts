import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BookingServiceService } from '../services/booking-service.service';
declare const window: any;
@Component({
  selector: 'management',
  templateUrl: './management.component.html',
  styleUrls: ['./management.component.css']
})
export class ManagementComponent implements OnInit {
  type = 'Booking Cash Inflow'
  isReady: any;
  isAdmin !: Boolean
  pin !: any;
  adminForm !: FormGroup
  height: any;
  width: any;
  isManager !: boolean;
  constructor(private fb: FormBuilder, private bookingService: BookingServiceService) {
    this.height = window.innerHeight;
    this.width = window.innerWidth
    if(localStorage.getItem('email') === 'ompraksh@maharajaraxaul.com') {
      this.isManager = true;
    }
    this.adminForm = this.fb.group({
      pin: []
    })
    window.otpless = (otplessUser: any) => {
      this.bookingService.otpAuthAdd({user: JSON.stringify(otplessUser)}).subscribe(res => {
      })
     };
   }

  ngOnInit(): void {
  }

  isReadyToLoad(eventData: any) {
    this.isReady = eventData;
  }
  auth() {
    let pin = this.adminForm.get('pin')?.value
    if(pin === 2120227693) {
      this.isAdmin = true;
      return;
    } else {
      alert("Invalid Pin, Please contact Admin")
    }
  }
}
