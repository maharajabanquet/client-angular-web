import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import {DataSource} from '@angular/cdk/collections';
import {Observable, ReplaySubject} from 'rxjs';
import {MAT_DIALOG_DATA, MatDialog} from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CashInFlowNewService } from 'src/app/services/cash-in-flow-new.service';
import Swal from 'sweetalert2'
import * as XLSX from 'xlsx';
export interface PeriodicElement {
  name: String,
  transactionType: String,
  transactionDate: any,
  amount: Number,
  remarks: String,
  submittedBy: String
}

const ELEMENT_DATA: PeriodicElement[] = [];

@Component({
  selector: 'cash-in-flow-24-25',
  templateUrl: './cash-in-flow-new.component.html',
  styleUrls: ['./cash-in-flow-new.component.css']
})
export class CashInFlowNewComponent implements OnInit {
  @ViewChild('cashinflow_dailog') cashinflow_dailog !: TemplateRef<any>;
  expenseForm !: FormGroup;
  displayedColumns: string[] =  ['position','name' ,'transactionType', 'transactionDate', 'amount', 'remarks','submittedBy', 'action'];
  dataToDisplay = [...ELEMENT_DATA];
  selected !: Date | null;
  dataSource = new ExampleDataSource(this.dataToDisplay);
  dialogRef: any;
  ELEMENT_DATA: PeriodicElement[] = [];
  incashLoad: any = []
  isLoaded!: boolean;
  isDataLoaded!: boolean;
  transDate: any;
  // calendar
  campaignOne!: FormGroup;
  isBooking !: any;
  type !: any;
  filteredTotalBal!: any;
  filteredCredited!: any;
  total: any;
  credited!: number;
  debited!: number;
  isManager !: Boolean;
  constructor(public dialog: MatDialog, private fb: FormBuilder, private cashInFlow: CashInFlowNewService) {
    const today = new Date();
    const month = today.getMonth();
    const year = today.getFullYear();
    this.campaignOne = new FormGroup({
      start: new FormControl(new Date(year, month,1)),
      end: new FormControl(new Date(year, month, 3))
    });
    if(localStorage.getItem('email') === 'ompraksh@maharajaraxaul.com') {
      this.isManager = true;
    } else {
      this.isManager = false;
    }

  }

  

  createExpenseForm() {
    this.expenseForm = this.fb.group({
      name: [, [Validators.required]],
      transactionType: [, [Validators.required]],
      transactionDate: [, [Validators.required]],
      amount: [, [Validators.required]],
      is_booking: [false],
      remarks: [, [Validators.required]],
      submitted_by: [localStorage.getItem('name')]
    })
  }
  ngOnInit(): void {
    this.createExpenseForm();
    this.getExpenses({});
  }

  reset() {
    this.getExpenses({});
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
  closeModal() {
    this.dialog.closeAll();
  }
  addExpenses() {
    this.dialogRef = this.dialog.open(this.cashinflow_dailog, {
      hasBackdrop: false
    });
    this.dialogRef.afterClosed().subscribe((result: any) => {
     if(result === 'submit') {
   
      this.submitExpense();

     }
    });
  }

  search() {
    let tDate = null;
    let sDate = new Date(this.campaignOne.get('start')?.value);
    sDate.setUTCHours(0, 0, 0, 0);
    let eDate = new Date(this.campaignOne.get('end')?.value);
    eDate.setUTCHours(0, 0, 0, 0);
    if(this.transDate) {
       tDate = new Date(this.transDate);
    tDate.setUTCHours(0, 0, 0, 0);
    }
    let query = {
      startDate: sDate, 
      endDate: eDate, 
      type: this.type, 
      is_booking: this.isBooking,
      singleDate: tDate
    }
      this.getExpenses(query)
  }

  getFilteredBalance() {
    let incash = 0;
   let outcash = 0;
   this.filteredTotalBal = '';
   this.filteredCredited = '';
   this.incashLoad.forEach((element: any) => {
     if(Math.sign(element.amount) === 1) {
       incash = incash+element.amount
       this.filteredCredited = incash;
     }
     if(Math.sign(element.amount) === - 1) {
       outcash = outcash + element.amount;
       this.filteredTotalBal = Math.abs(outcash);
     }
     // this.filteredTotalBal = incash - Math.abs(outcash);  
   });
 }

  getExpenses(query: any) {
    let index = 1;
    this.cashInFlow.getExpenses(query).subscribe((resp: any) => {
      const elements = (resp && resp.docs && resp.docs) || [];
      const mapElements = elements.map((element: any) => ({
        position: index++,
        id: element._id,
        name: element.name,
        transactionType: element.transactionType,
        transactionDate: element.transactionDate,
        amount: element.amount,
        submittedBy: element.submitted_by || 'Ankit Kumar',
        remarks: element.remarks
      }))
      this.incashLoad = mapElements;
      this.ELEMENT_DATA = mapElements
      this.dataSource = new ExampleDataSource(this.ELEMENT_DATA);
      this.dataSource
      this.isLoaded = true;
      this.isDataLoaded = true;
      this.getFilteredBalance()
      this.getTotalBalance();
    })
  }

  checknum(numberCheck: any) {
    if (numberCheck === 'credit') {
      return 'green-color';
    }
    else {
      return 'red-color'
    }
  
  }

  exportexcel(): void
  {
    /* pass here the table id */
    let element = document.getElementById('excel-table');
    const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);
 
    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
 
    /* save to file */  
    XLSX.writeFile(wb, `${new Date().toLocaleDateString()}_cashflow.xlsx`);
 
  }

  numberWithCommas(x: any) {
    if(x) {
      return x.toString().split('.')[0].length > 3 ? x.toString().substring(0,x.toString().split('.')[0].length-3).replace(/\B(?=(\d{2})+(?!\d))/g, ",") + "," + x.toString().substring(x.toString().split('.')[0].length-3): x.toString();
    }  else {
      return 0
    }
  }

  deleteEmployee(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Submit!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.cashInFlow.deleteCashFlow(id).subscribe((res: any) => {
          if(res && res.status === 'success') {
            Swal.fire(
              'Deleted!',
              'Data has been deleted.',
              'success'
            )
            this.dialog.closeAll();
            this.getExpenses({});
          } else {
            Swal.fire(
              'Error!',
              'Something Went Wrong, Please Try Again!!!',
              'error'
            )
          }
          
          this.getExpenses({});
        }, (err: any) => {
          Swal.fire(
            'Error!',
            'Something Went Wrong, Please Try Again!!!',
            'error'
          )
        })
      }
    })
  }

  callAPI() {
    let tDate = new Date(this.expenseForm.get('transactionDate')?.value);
    tDate.setUTCHours(0, 0, 0, 0);
   
    const paylaod = {
      name: this.expenseForm.get('name')?.value,
      transactionType: this.expenseForm.get('transactionType')?.value,
      transactionDate: tDate,
      amount: this.expenseForm.get('amount')?.value,
      remarks: this.expenseForm.get('remarks')?.value,
      is_booking: this.expenseForm.get('is_booking')?.value,
      submitted_by: this.expenseForm.get('submitted_by')?.value
    }
    paylaod['amount'] = Number(paylaod['amount']);
    this.cashInFlow.addExpense(paylaod).subscribe((resp: any) => {
      const status = resp && resp.status;
      Swal.fire(
        'Submitted',
        status,
        'success'
      )
      this.expenseForm.reset();
      this.getExpenses({});
    }, (err) => {
      Swal.fire(
        'Failed',
        'Error Submitting Expenses',
        'error'
      )
    })
  }
  submitExpense() {

    Swal.fire({
      title: 'Are you sure?',
      text: "You want to submit expenses",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Submit!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.callAPI()
      }
    })
  
  }
}

class ExampleDataSource extends DataSource<PeriodicElement> {
  private _dataStream = new ReplaySubject<PeriodicElement[]>();

  constructor(initialData: PeriodicElement[]) {
    super();
    this.setData(initialData);
  }

  connect(): Observable<PeriodicElement[]> {
    return this._dataStream;
  }

  disconnect() {}

  setData(data: PeriodicElement[]) {
    this._dataStream.next(data);
  }
}