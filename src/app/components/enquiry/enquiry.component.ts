import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EnquiryServiceService } from 'src/app/services/enquiry-service.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { DialogData } from 'src/app/landing-page/photogallery/photogallery.component';

export interface MarketData {
  date:any;
  title: string
 
}
@Component({
  selector: 'enquiry',
  templateUrl: './enquiry.component.html',
  styleUrls: ['./enquiry.component.css']
})
export class EnquiryComponent implements OnInit {
  enquiryForm!: FormGroup;
  hideForm!: boolean;
  currentView = 'form';
  @Output() eventEmit = new EventEmitter<string>();
  @Input() dynamicTitle = 'Enquiry'

  constructor(
    private formBuilder: FormBuilder,
    private enquiryServie: EnquiryServiceService,
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: MarketData,
    private dialog:MatDialog
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
      BookingDate: ['', [Validators.required]],
      is_public: [false]
    })
    if(this.data && this.data.date) {
      this.dynamicTitle = 'Booking Form'
    
      this.enquiryForm.get('BookingDate')?.patchValue(this.data.date);
      this.dynamicTitle = this.data.title;
      this.enquiryForm.get('is_public')?.patchValue(true);
    }
  }

  cancel() {
    this.dialog.closeAll();
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
        this.eventEmit.emit('submitted')
        this.dialog.closeAll();
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
  }
}
