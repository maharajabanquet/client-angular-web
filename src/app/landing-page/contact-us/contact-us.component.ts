import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EnquiryServiceService } from 'src/app/services/enquiry-service.service';
import {  MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css']
})
export class ContactUsComponent implements OnInit {
  contactForm!: FormGroup ;
  constructor(
    private fb: FormBuilder,
    private enquiryService: EnquiryServiceService,
    private _snackBar: MatSnackBar,

  ) { }

  ngOnInit(): void {
    this.createContactForm();
    this.contactForm.valueChanges.subscribe(res => {
    })
  }

  createContactForm() {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required]],
      phone: ['', [Validators.required,Validators.minLength(10), Validators.maxLength(10), Validators.pattern(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/)]],
      email: ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')]],
      message: ['', [Validators.required]]
    })
  }

  submit() {
    this._snackBar.open('Please wait...', 'OK');

    this.enquiryService.sendMail(this.contactForm.getRawValue()).subscribe(res => {
      this._snackBar.open('Thank you , Your Request has been sent to mail.', 'OK');
      this.contactForm.reset();
    })
    
  }
}
