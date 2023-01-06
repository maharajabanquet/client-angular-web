import { PageEvent } from '@angular/material/paginator';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import { BookingServiceService } from 'src/app/services/booking-service.service';
import Swal from 'sweetalert2'
import { CashInflowService } from 'src/app/services/cash-inflow.service';
import {MatTableDataSource} from '@angular/material/table';

export interface PeriodicElement {
  position: Number,
  id: string;
  partyName: string;
  transactionType: string;
  transactionDate: string;
  amount: Number;
  remarks: string;
  action: String;
}
const ELEMENT_DATA: PeriodicElement[] = [];

@Component({
  selector: 'in-cashflow',
  templateUrl: './in-cashflow.component.html',
  styleUrls: ['./in-cashflow.component.css']
})
export class InCashflowComponent implements OnInit {
  displayedColumns: string[] = ['sl-no', 'party-name', 'transcation-type', 'transcation-date', 'amount', 'remarks', 'action'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);
  ELEMENT_DATA: PeriodicElement[] = [];
  isLoaded!: boolean
  total: any;
  incashLoad: any = []
  credited: any;
  debited: any;
  isDataLoaded!: boolean;
  length = 100;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  pageEvent!: PageEvent;
  pageData: any;
  pageNo = 1;
  constructor(
    public dialog: MatDialog,
    private cashInflowService: CashInflowService
  ) { }

  ngOnInit(): void {
   this.getCashFlow();
  }

  getCashFlow() {
    let index = 1;
    this.cashInflowService.getCashInflow(this.pageNo, this.pageSize).subscribe((cashInflowData: any) => {
      const elements = (cashInflowData && cashInflowData.data && cashInflowData.data.docs) || [];
      
      const mapElements = elements.map((element: any) => ({
        position: index++,
        id: element._id,
        partyName: element.partyName,
        transactionType: element.transactionType,
        transactionDate: element.transactionDate,
        amount: element.amount,
        remarks: element.remarks
      }))
      this.incashLoad = mapElements;
      this.ELEMENT_DATA = mapElements
      this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
      this.dataSource
      this.isLoaded = true;
      this.isDataLoaded = true;
      
      this.length = cashInflowData.data.total;
      console.log("length", this.length);
      
      this.getTotalBalance();
  })
  console.log("check it" ,this.ELEMENT_DATA);
 
  
  }


  getCurrentPage(event: any) {
    console.log(event);
    this.pageNo = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    if(event && event.pageIndex === 0) {
      this.pageNo = 1;
    }
    this.getCashFlow();
  }

  getTotalBalance() {
    
    let incash = 0;
    let outcash = 0;
    this.incashLoad.forEach((element: any) => {
      if(Math.sign(element.amount) === 1) {
        incash = incash+element.amount
        this.credited = incash;
      }
      if(Math.sign(element.amount) === - 1) {
        outcash = outcash + element.amount;
        this.debited = Math.abs(outcash);
      }
      this.total = incash - Math.abs(outcash);  
    });
  }

  deleteEmployee(id: any) {
    console.log(id);
    
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
        this.cashInflowService.deleteCashFlow(id).subscribe((res: any) => {
          if(res && res.status === 'success') {
            Swal.fire(
              'Deleted!',
              'Data has been deleted.',
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
          
          this.getCashFlow();
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
  checknum(numberCheck: any) {
    if (Math.sign(numberCheck) === 1) {
      return 'green-color';
    }
    else {
      return 'red-color'
    }
  
  }

  openDialog() {
    const dialogRef = this.dialog.open(CashInFlowDialog);
    dialogRef.afterClosed().subscribe(result => {
      this.getCashFlow();
    });
  }

}



@Component({
  selector: 'cash-inflow-dialog',
  templateUrl: './dialog-content-example-dialog.html',
  styleUrls: ['./cash-inflow-dialog.css']

})
export class CashInFlowDialog {
  cashInflowForm!: FormGroup;
  bookingList: any = [];
  showOtherInput!: boolean;
  constructor(
    private fb: FormBuilder,
    private bookingService: BookingServiceService,
    private dialog: MatDialog,
    private cashInflowService: CashInflowService
  ) {
    this.bookingService.getBookingList().subscribe((bList: any) => {
      bList.success.forEach((element: any) => {
        if(!element.settle) {
          this.bookingList.push({partyName: `${ element.firstName} ${element.lastName} (${element.bookingDate})`})
        }
      });
      console.log(this.bookingList);
      
    })
    this.cashInflowForm = this.fb.group({
      partyName: ['', Validators.required],
      transactionType: ['', Validators.required],
      transactionDate: [Validators.required],
      amount: [, Validators.required],
      remarks: ['', [Validators.required]],
      others: ['']

    })
    this.cashInflowForm.get('partyName')?.valueChanges.subscribe((inValue: any) => {
      if(inValue === 'Other') {
        this.showOtherInput = true;
        this.cashInflowForm.get('partyName')?.setValidators([Validators.required])
      } else {
        this.showOtherInput = false;
        this.cashInflowForm.get('partyName')?.setValidators([])
      }
    })
  }



 
  submit() {
    if(this.cashInflowForm.status === 'INVALID') {
      Swal.fire(
        'Error!',
        'All Fields Are Required',
        'error'
      )
      return;
    }
    Swal.fire({
      title: 'Are you sure?',
      text: "You want add this cash inflow",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Add it!'
    }).then((result) => {
      if (result.isConfirmed) {
       // Submit api 
       let transDate = this.cashInflowForm.get('transactionDate')?.value;
       transDate = new Date(transDate).toLocaleDateString()
       if(this.cashInflowForm.get('partyName')?.value === 'Other') {
        this.cashInflowForm.get('partyName')?.patchValue(this.cashInflowForm.get('others')?.value);
       }
       const payload = {
        partyName: this.cashInflowForm.get('partyName')?.value,
        transactionType: this.cashInflowForm.get('transactionType')?.value,
        transactionDate: transDate,
        amount: this.cashInflowForm.get('amount')?.value,
        remarks: this.cashInflowForm.get('remarks')?.value,
       }
       this.cashInflowService.addCashInflow(payload).subscribe((resp: any) => {
        if(resp && resp.status === 'Added') {
          Swal.fire(
            'Added!',
            'Cash Inflow Has Been Added',
            'success'
          )
          this.dialog.closeAll();
        } else {
          Swal.fire(
            'Failed!',
            'Oops Something went wrong',
            'error'
          )
        }
        
       
       }, err => {
        Swal.fire(
          'Failed!',
          'Oops Something went wrong, Please Try Again!!!',
          'error'
        )
       })
      
     
      }
    })
   
  }
}