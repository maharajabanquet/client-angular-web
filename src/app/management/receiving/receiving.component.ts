import { BookingServiceService } from './../../services/booking-service.service';
import { ReceivingService } from './../../services/receiving.service';
import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import { FormGroup, FormControl,FormArray, FormBuilder, Validators, AbstractControl } from '@angular/forms'
import Swal from 'sweetalert2'
import {animate, state, style, transition, trigger} from '@angular/animations';

export interface PeriodicElement {
  position: Number,
  date: string,
  items: any,
  name: string,
  address: string,
  mobileNumber: string,
  securityDeposit: string
}
const ELEMENT_DATA: PeriodicElement[] = [];

@Component({
  selector: 'receiving',
  templateUrl: './receiving.component.html',
  styleUrls: ['./receiving.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class ReceivingComponent implements OnInit {
  dataSource = ELEMENT_DATA;
  columnsToDisplay = ['date', 'name', 'address', 'mobileNumber', "securityDeposit"];
  columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand'];
  expandedElement!: PeriodicElement | null;
  title = 'angular-mat-table-example';
  blob!: Blob;

  constructor(public dialog: MatDialog, private resService: ReceivingService) {

  }

  toggleRow(element: { expanded: boolean; }) {
    // Uncommnet to open only single row at once
    // ELEMENT_DATA.forEach(row => {
    //   row.expanded = false;
    // })
    element.expanded = !element.expanded
  }

  
  ngOnInit(): void {
    this.getReceivingList();
  }

  getReceivingList() {
    this.resService.get().subscribe((data:any) => {
      console.log(data);
      this.dataSource = data;
      
    })
  }

  
  print(element: any) {
    console.log(element);
    
    // window.open(environment.host + `api/v1/invoice/invoice?data=${JSON.stringify(this.bookingForm.getRawValue())}`, "_blank");
    // this.bookingService.generateInvoice(this.bookingForm.getRawValue()).subscribe(res => {
    //   this._snackBar.open('Invoice Generated!', 'OK',{duration: 1000});
    // })
    
    this.resService.generateInvoice(element).subscribe((data: any) => {
      this.blob = new Blob([data as BlobPart], {type: 'application/pdf'});
      var downloadURL = window.URL.createObjectURL(data);
      var link = document.createElement('a');
      link.href = downloadURL;
      link.download = `${element.name}`+ "_receiving-slip.pdf";
      link.click();
    
    });
  }
  openDialog() {
    const dialogRef = this.dialog.open(ReceivingModalComponent);

    dialogRef.afterClosed().subscribe(result => {
      this.getReceivingList();
      console.log(`Dialog result: ${result}`);
    });
  }
}



@Component({
  selector: 'receiving-modal',
  templateUrl: './receiving-modal.html',
  styleUrls: ['receiving-modal.css']
})
export class ReceivingModalComponent {

  form!: FormGroup
  items!: FormGroup
  bookingList: any;
info: any;
  securityMoney: any;
  constructor(private fb: FormBuilder, private rService: ReceivingService, public dialog: MatDialog, private bookingService: BookingServiceService) {
  
    this.getBookingList();

    this.form = this.fb.group({
      date: ['', Validators.required],
      items: this.fb.array([]),
      name: ['', Validators.required],
      address: ['', Validators.required],
      mobileNumber: ['', Validators.required],
      securityDeposit: [this.securityMoney,  Validators.required]
  });
  this.bookingService.getConfig().subscribe((config: any) => {
    this.securityMoney = config && config.config &&  config.config.securityDepositCharges || 0;
    this.form.get('securityDeposit')?.patchValue(this.securityMoney);
  
  })
  
  this.patchDetails()
  this.getInventoryList();
  }

  getBookingList() {
    this.bookingService.getBookingList().subscribe((list: any) => {
      this.bookingList = list && list.success || [];
    })
  }
  get lessons() {
    return this.form.controls["items"] as FormArray;
  }

  addReciving(item: any) {
    this.items = this.fb.group({
      itemName: [item.itemName],
      quantity: [item.quantity, Validators.required],
      itemCode: [item.itemCode],
      displayName: [item.displayName],
      createdOn: [item.createdOn]
    });
    this.lessons.push(this.items);
  }
  ADD() {
    this.items = this.fb.group({
      itemName: [''],
      quantity: ['', Validators.required],
      itemCode: [''],
      displayName: [''],
      createdOn: ['']
    });
    this.lessons.push(this.items);
  }
  deleteLesson(lessonIndex: number) {
    this.lessons.removeAt(lessonIndex);
  }
  toFormGroup = (form: AbstractControl) => form as FormGroup;

  submit() {
    if(this.items === undefined) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please click on Plus Button To Add Item!',
        footer: '<a href="">For Assistant Contact: Ankit Kumar or email us: support@maharajaraxaul.com</a>'
      })
      return
    }
    Swal.fire({
      title: 'Are you sure?',
      text: "This will create a receiving record",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Create'
    }).then((result) => {
      if (result.isConfirmed) {
        this.rService.create(this.form.getRawValue()).subscribe((res: any) => {
          if(res && res.status === 'created') {
            Swal.fire(
              'Created!',
              'Receiving List Has Been Created.',
              'success'
            )
            this.dialog.closeAll();
          } else {
            Swal.fire(
              'Error!',
              'Something Went Wrong, Please Try Again!!!',
              'error'
            )
          }
          
          
        }, err => {
          Swal.fire(
            'Error!',
            'Something Went Wrong, Please Try Again!!!',
            'error'
          )
        })
      }
    })
   
  }

  showBookingDate(date: any) {
    let split = date.split("/");
    return split[1] + "/" + split[0] + "/" +split[2];
   
  }

  patchDetails() {
      this.form.get('date')?.valueChanges.subscribe(date => {
        this.bookingService.getASpecificBooking(date).subscribe((data : any) => {
          
          const bookingData = data.bookingData[0];
          const fullName = bookingData.firstName + " " + bookingData.lastName;
          const address = bookingData.address;
          const mobileNumber = bookingData.phoneNumber

          this.form.get('name')?.patchValue(fullName);
          this.form.get('address')?.patchValue(address);
          this.form.get('mobileNumber')?.patchValue(mobileNumber);


          
        })
      })
    
  }

  getInventoryList() {
    this.rService.getInventory().subscribe((resp: any) => {
      console.log(resp);
      const inventoryList = resp && resp.inventory || [];
      let transformedItems = inventoryList.map((item: any) =>
      {
        this.addReciving(item)
      }
    );

    // this.form.setControl('items', this.fb.array(transformedItems));
      
    })
  }

}