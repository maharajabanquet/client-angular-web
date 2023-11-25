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
  constructor(private fb: FormBuilder, private bookingService: BookingServiceService) {
    this.adminForm = this.fb.group({
      pin: []
    })
    window.otpless = (otplessUser: any) => {
      console.log(JSON.stringify(otplessUser));
      this.bookingService.otpAuthAdd({user: JSON.stringify(otplessUser)}).subscribe(res => {
        console.log("USER ADDED", {user: JSON.stringify(otplessUser)});
        
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
