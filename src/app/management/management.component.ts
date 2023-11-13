import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
  constructor(private fb: FormBuilder) {
    this.adminForm = this.fb.group({
      pin: []
    })
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
