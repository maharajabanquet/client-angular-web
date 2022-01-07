import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { BookingServiceService } from 'src/app/services/booking-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from 'src/environments/environment';
interface DialogData {
  selectedDate: any;
  disabled: any;
}
export interface PeriodicElement {
  facilities: string;
  position: number;
  price: Number;
}
@Component({
  selector: 'app-booking-modal',
  templateUrl: './booking-modal.component.html',
  styleUrls: ['./booking-modal.component.css']
})
export class BookingModalComponent implements OnInit {
   ELEMENT_DATA: PeriodicElement[] = [
  ];
  displayedColumns: string[] = ['position', 'facilities', 'price'];
  dataSource: any;
  selectedBookingDate: any;
  bookingForm!: FormGroup;
  requirementFormControl = new FormControl();
  requirements: string[] = [
    'Marriage or reception',
    'Ring Ceremony or Dekha suni',
    'Birthday Party',
    'Others'
  ]
  facilities: string[] = ['Lawn', 
                            'वर बधु के सलए सडल्क्स कमरा (A.C.)-02', 
                            'AC Main Hall', 
                            '2 Delux Room', 
                            'Mini AC Hall',
                            'Kitchen',
                            'First Floor',
                            'DG with Diesel',
                          ];
  config: any;
  formReadyToLoad: boolean | undefined;
  ready: boolean | undefined;
  formDisabled: boolean | undefined;
  printReady: boolean | undefined;
  facilites: any;
  constructor(
    public dialogRef: MatDialogRef<BookingModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private formBuilder: FormBuilder,
    private bookingService: BookingServiceService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,

  ) { }

  ngOnInit(): void {
    this.dialog.openDialogs.pop();
    this.selectedBookingDate = this.data.selectedDate;
    this.formDisabled = this.data.disabled;
    this.bookingService.getConfig().subscribe((configResp: any) => {
      if(configResp && configResp.config && configResp.config.finalBookingAmount) {
        this.config = configResp.config;
        this.facilites = [
          {label: 'AC Main Hall', price: configResp.config.acMainHall},
          {label: 'Delux Room', price: configResp.config.deluxRoom},
          {label: 'Mini AC Hall', price: configResp.config.miniAcHall},
          {label: 'Kitcehn', price: configResp.config.kitchen},
          {label: 'First Floor', price: configResp.config.firstFloor},
          {label: 'DG with Diesel', price: configResp.config.dgWithDisel},
        ]
        //  {
        //   'AC Main Hall': configResp.config.acMainHall,
        //   'Delux Room': configResp.config.deluxRoom,
        //   'Mini AC Hall': configResp.config.miniAcHall,
        //   'Kitcehn': configResp.config.miniAcHall,
        // }
        this.createForm()
      } else if(configResp && configResp.config && configResp.config.finalBookingAmount <= 0) {
        this.closeModal();
        this._snackBar.open('Error, Please Try Again!', 'OK');
      }
      else {
        this.closeModal();
        this._snackBar.open('Error, Please Try Again!', 'OK');
      }
      
    }, (err) => {
      this.closeModal();
      this._snackBar.open('Error, Please Try Again!', 'OK');
    })
    
   
  }

  createForm() {
    this.bookingForm = this.formBuilder.group({
      bookingDate: [, Validators.required],
      firstName: ['', [Validators.required,  Validators.minLength(3), Validators.maxLength(20)]],
      lastName: ['', [Validators.required,  Validators.minLength(3), Validators.maxLength(20)]],
      phoneNumber: ['', [Validators.required,Validators.minLength(10), Validators.maxLength(10), Validators.pattern(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/)]],
      address: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(150)]],
      requirements: ['', [Validators.required]],
      BookingAmount: [, [Validators.required]],
      finalAmount: [, [Validators.required]],
      balancedAmount: [, [Validators.required]],
      facilities: [[]],
      status: ['pending']

    })
    if(this.formDisabled) {
      this.openPatchedForm();
    } else {
      this.bookingForm.get('bookingDate')?.patchValue(new Date(this.selectedBookingDate).toLocaleDateString());
      this.bookingForm.get('finalAmount')?.disable();
      this.bookingForm.get('balancedAmount')?.disable();
      this.bookingForm.get('bookingDate')?.disable();
      // this.bookingForm.get('BookingAmount')?.disable();
    }
  
    this.formReadyToLoad = true;
    if(!this.formDisabled) {
      this.onRequirementSelect();
      this.onFacilitiesSelection();
    }
  }

  patchForm(value: any, controlName: string) {
    this.bookingForm.get(this.selectedBookingDate)?.patchValue(value);
  }

  closeModal() {
    this.dialogRef.close();
  }

  submit() {
    this.bookingService.add_booking(this.bookingForm.getRawValue()).subscribe(res => {
      this.closeModal();
      this._snackBar.open('Booking Done!', 'OK');
      
    }, (err) => {
      this._snackBar.open('Error, Please Try Again!', 'OK');
    })
  
  }

  public checkError = (controlName: string, errorName: string) => {
    return this.bookingForm.controls[controlName].hasError(errorName);
  }

  onInputBalanceAmount(event: any) {
    console.log(event.target.value);
    const balancedAmount = Number(this.bookingForm.get('finalAmount')?.value) - Number(this.bookingForm.get('BookingAmount')?.value);
    this.bookingForm.get('balancedAmount')?.patchValue(balancedAmount) 
    console.log(balancedAmount);
    
  }

  openPatchedForm() {
    this.ready = false;
    this.bookingService.getASpecificBooking(this.selectedBookingDate.toLocaleDateString()).subscribe((data: any) => {
      this.bookingForm.patchValue(data.bookingData[0])

      for(let index=0; index < data.bookingData[0].facilities.length; index++) {
        this.ELEMENT_DATA.push({position: index+1, facilities: data.bookingData[0].facilities[index].label, price: data.bookingData[0].facilities[index].price})
      }
      this.dataSource = this.ELEMENT_DATA;
      this.bookingForm.disable();
      this.printReady = true;
      this.ready = true;
    })
  }

  givePrint(){
    window.open(environment.host + `api/v1/invoice/invoice?data=${JSON.stringify(this.bookingForm.getRawValue())}`, "_blank");
    this._snackBar.open('Invoice Generated!', 'OK',{duration: 1000});
  }

  onRequirementSelect() { 
    this.bookingForm.get('requirements')?.valueChanges.subscribe(data => {
      if(data === 'Marriage or reception')  {
        this.bookingForm.get('finalAmount')?.patchValue(this.config.finalBookingAmount)
        this.bookingForm.get('BookingAmount')?.enable();
      } else {
        this.bookingForm.get('facilities')?.setValidators([Validators.required])
        this.bookingForm.get('BookingAmount')?.disable();
        this.bookingForm.get('BookingAmount')?.patchValue('');

      }
    })
  }

  onFacilitiesSelection() {
    let finalAmount = 0;
    this.bookingForm.get('facilities')?.valueChanges.subscribe(value => {
      if(value && value.length > 0) {
        for(let index=0; index < value.length; index++) {
          finalAmount += value[index].price;
        }
      }
      this.bookingForm.get('BookingAmount')?.enable();
      this.bookingForm.get('finalAmount')?.patchValue(finalAmount);
      if(value && value.length === 0) {
      this.bookingForm.get('BookingAmount')?.disable();
        
      }
    })
  }
}
