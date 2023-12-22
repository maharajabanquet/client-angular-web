import { PageEvent } from '@angular/material/paginator';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import { BookingServiceService } from 'src/app/services/booking-service.service';
import Swal from 'sweetalert2'
import { CashInflowService } from 'src/app/services/cash-inflow.service';
import {MatTableDataSource} from '@angular/material/table';
import * as XLSX from 'xlsx';

export interface PeriodicElement {
  position: Number,
  customerName: String,
  bookingDate: any,
  advancePaymanet: any;
  dueAmount: any,
  paymentDate: any
}
const ELEMENT_DATA: PeriodicElement[] = [];

@Component({
  selector: 'pending-cashflow',
  templateUrl: './pending-booking-cash-flow.component.html',
  styleUrls: ['./pending-booking-cash-flow.component.css']
})
export class PendingBookingCashFlowComponent implements OnInit {
  displayedColumns: string[] = ['sl-no', 'customer-name', 'booking-date', 'advance-payment' ,'due-amount', 'payment-date'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);
  ELEMENT_DATA: PeriodicElement[] = [];
  isLoaded!: boolean
  total: any;
  incashLoad: any = []
  advance: any;
  due: any;
  isDataLoaded!: boolean;
  length = 100;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  pageEvent!: PageEvent;
  pageData: any;
  pageNo = 1;
  allCashFlow: any = [];
  fileName= 'bookingPayment.xlsx';
  transcationType = 'Credited'
  dateFilter!: FormGroup;
  bookingList: any = [];
  filteredTotalBal: any;
  filteredCredited: any;
  bookingData: any = []
  excelArray: any = []
  constructor(
    public dialog: MatDialog,
    private cashInflowService: CashInflowService,
    private fb: FormBuilder,
    private bookingService: BookingServiceService
  ) { }

  ngOnInit(): void {
   this.getCashFlow();

  
  
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  reset() {
    this.getCashFlow()
    this.dateFilter.reset();
    this.filteredCredited = null;
  }

  exportexcel(): void
  {
    /* pass here the table id */
    let element = document.getElementById('excel-table');
    const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);
 
    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Maharaja Banquet');
 
    /* save to file */  
    XLSX.writeFile(wb, this.fileName);
 
  }

  getCashInflowWithoutPaginate() {
    this.cashInflowService.getAllCashFlow(true).subscribe((allCashFlow: any) => {
      this.allCashFlow = allCashFlow && allCashFlow.data || [];
     
      
    })
  }

  getCustomerName(name: any) {
    return `${name.firstName} ${name.lastName}` 
  }

  getCashFlow() {
    this.bookingData = [];
    let index = 1;
   this.bookingService.getBookingList().subscribe((bList: any) => {
    const data = bList && bList.success || []
    for(let i = 0 ; i < data.length; i++) {
      if(!data[i].settled) {
        this.bookingData.push(data[i])
      }
    }
    const elements = (this.bookingData) || [];
    const mapElements = elements.map((element: any) => ({
      position: index++,
      customerName: this.getCustomerName(element),
      bookingDate: element.bookingDate,
      advancePaymanet: element.BookingAmount,
      dueAmount: element.balancedAmount,
      paymentDate: element.timestamp
    }))
    this.excelArray = mapElements;
       this.ELEMENT_DATA = mapElements;
       this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
       this.getTotalBalance();
   })
  }


  getCurrentPage(event: any) {
    this.pageNo = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    if(event && event.pageIndex === 0) {
      this.pageNo = 1;
    }
    this.getCashFlow();
  }

  getFilteredBalance() {
   
  }

  getTotalBalance() {
    let due = 0;
    let advance = 0;
    let total = 0;
    this.bookingData.forEach((element: any) => {
      due = due+element.balancedAmount
      this.due = due;
      advance = advance+element.BookingAmount;
      this.advance = advance;
      total = total + element.balancedAmount + element.BookingAmount;
      this.total = total;
    });
  }

  deleteEmployee(id: any) {
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

  changeType(numberCheck: any) {
    if (Math.sign(numberCheck) === 1) {
      return 'Credited';
    }
    else {
      return 'Debited'
    }
  }
  status(element: any) {
    if (element.transactionType === 'credited') {
      return 'green-color';
    }
    else {
      return 'red-color'
    }
  }
  numberWithCommas(x: any) {
    if(x) {
      return x.toString().split('.')[0].length > 3 ? x.toString().substring(0,x.toString().split('.')[0].length-3).replace(/\B(?=(\d{2})+(?!\d))/g, ",") + "," + x.toString().substring(x.toString().split('.')[0].length-3): x.toString();
    }  else {
      return 0
    }
  }

 

  
  
}


