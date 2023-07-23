import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EnquiryServiceService } from 'src/app/services/enquiry-service.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'enquiry',
  templateUrl: './enquiry.component.html',
  styleUrls: ['./enquiry.component.css']
})
export class EnquiryComponent implements OnInit {
  enquiryForm!: FormGroup;
  hideForm!: boolean;
  currentView = 'form';
  constructor(
    private formBuilder: FormBuilder,
    private enquiryServie: EnquiryServiceService,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.createEnquiryForm()
  }

  createEnquiryForm() {
    this.enquiryForm = this.formBuilder.group({
      firstName: ['', [Validators.required,  Validators.minLength(3), Validators.maxLength(20)]],
      lastName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      phoneNumber: ['', [Validators.required,Validators.minLength(10), Validators.maxLength(10), Validators.pattern(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/)]],
      address: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(50)]],
      BookingDate: ['', [Validators.required]]
    })
  }

  public checkError = (controlName: string, errorName: string) => {
    return this.enquiryForm.controls[controlName].hasError(errorName);
  }

  submit() {
    this.hideForm = true;
    this.enquiryServie.addEnquiry(this.enquiryForm.getRawValue()).subscribe((resp: any) => {
      if(resp && resp['visitorCode']) {
        this._snackBar.open('Enquiry Form Successfully Submitted', 'OK');
        this.createEnquiryForm();
        this.hideForm = false;
        this.enquiryServie.visitorCode.next(resp['visitorCode'])
      }
    }, (err) => {
      this.hideForm = false;
    })
  }

  toggleTabel() {
    if(this.currentView === 'form') {
      this.currentView = 'table';
    } else if(this.currentView = 'table') {
      this.currentView = 'form';
    }
    console.log(this.currentView);
  }
}
