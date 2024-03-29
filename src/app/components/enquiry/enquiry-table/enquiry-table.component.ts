import { Component, OnInit } from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import { EnquiryServiceService } from 'src/app/services/enquiry-service.service';
import { PageEvent } from '@angular/material/paginator';
export interface PeriodicElement {
  position: number,
  name: string;
  phoneNumber: string;
  address: string;
  bookingDate: any;
}

const ELEMENT_DATA: PeriodicElement[] = [];

@Component({
  selector: 'enquiry-table',
  templateUrl: './enquiry-table.component.html',
  styleUrls: ['./enquiry-table.component.css']
})
export class EnquiryTableComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name', 'phoneNumber', 'address', 'bookingDate'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);
  ELEMENT_DATA: PeriodicElement[] = [];
  isDataLoaded!: boolean;
  length = 100;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  pageEvent!: PageEvent;
  pageData: any;
  pageNo = 1;

  constructor(
    private enquiryService: EnquiryServiceService
  ) { 
    
  }
  

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnInit(): void {
    this.getEnquires();
  }


  getEnquires() {
    this.enquiryService.getAllEnquiry(this.pageNo, this.pageSize).subscribe((data: any) => {
      const elements = (data && data.success &&  data.success && data.success.docs) || [];
      let index = 0;
      const mapElements = elements.map((element: any)=> ({
        position: index+1,
        name:  element.firstName + " " + element.lastName,
        phoneNumber: element.phoneNumber,
        address: element.address,
        bookingDate: new Date(element.BookingDate).toLocaleDateString()
      }))
      this.ELEMENT_DATA = mapElements;
      this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
      this.isDataLoaded = true;
      
      this.length = data.success.total;
      console.log(data);
      
    })
  }

  getCurrentPage(event: any) {
    console.log(event);
    this.pageNo = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    if(event && event.pageIndex === 0) {
      this.pageNo = 1;
    }
    console.log("PAGE NO ", this.pageNo);
    
    this.getEnquires();
  }

}
