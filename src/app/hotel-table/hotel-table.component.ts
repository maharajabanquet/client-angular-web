import { EmployeeService } from './../services/employee.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UtilityService } from 'src/app/services/utility.service';
import { DialogData } from './../landing-page/photogallery/photogallery.component';
import { Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import {SelectionModel} from '@angular/cdk/collections';
import {MatTableDataSource} from '@angular/material/table';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import Swal from 'sweetalert2'

export interface PeriodicElement {
  customerName: string;
  purpose: string;
  idProof: string;
  amountPaid: string;
  date: string;
  position: number;
  contactNumber: string;
  action:string;
}
const ELEMENT_DATA: PeriodicElement[] = [];

@Component({
  selector: 'hotel-table',
  templateUrl: './hotel-table.component.html',
  styleUrls: ['./hotel-table.component.css']
})
export class HotelTableComponent implements OnInit {
  displayedColumns: string[] = ['position', 'customerName','contactNumber','purpose' ,'idProof', 'amountPaid', 'date', 'action'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  selection = new SelectionModel<PeriodicElement>(true, []);
  @Input() label: any = 'Hotel'
  @Input() type: any = ''
  departmentList: any = []
  constructor(
    public dialog: MatDialog,
    private utillityService: UtilityService,
    private employeeService:EmployeeService
  ) { }


  ngOnInit(): void {
    this.getHotelActivityList();
  }

  getHotelActivityList() {
    this.employeeService.getHotelActivityList().subscribe((empList: any) => {
      let counter = 0;
      const elements = (empList && empList.activities) || [];
      const mapElements = elements.map((element: any) => ({
        position: counter+1,
        customerName: element.customerName,
        purpose: element.purpose,
        idProof: element.idProof,
        amountPaid: element.amountPaid,
        contactNumber: element.contactNumber,
        date:element.date

      }))
      this.dataSource = mapElements;
      // {position: 1, employeeName: 'Madan Paswan', contact: '8970777693',department: 'cleaning', salary: 'View', documentProof: 'View', joiningDate: '02/12/2022', action: ''},
    })
  }

  viewDocumentProof(url: any) {
    window.open(url, "_blank");
  }

  deleteEmployee(contactNumber: any) {
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
        this.employeeService.deleteHotelActivites(contactNumber).subscribe((res: any) => {
          Swal.fire(
            'Deleted!',
            'Emplyee Data has been deleted.',
            'success'
          )
          this.getHotelActivityList();
        })
      }
    })
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

 

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

  }
  checkboxLabel(row?: PeriodicElement): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }
  uploadSalarySlip() {
    // TODO
  }

  add() {
    const dialogRef = this.dialog.open(HotelModalDialog, {
      data: {header: 'Add Employee',department: this.departmentList}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      this.getHotelActivityList();
    });
  }

  openDialog() {
  
  }


  
}


declare var swal: any
@Component({
  selector: 'common-modal',
  templateUrl: 'hotel-modal.html',
  styleUrls: ['hotel-modal.css']
})
export class HotelModalDialog {
  @ViewChild('fileInput') fileInput : any;
  hotelForm!: FormGroup;
  

  file: File | null = null;
  modalMetaData: any;
  uploadedFiles: any;
  isDisable = false;
  fileuploaded!: boolean;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: FormBuilder,
    private us: UtilityService,
    private employeeService: EmployeeService,
    public dialogRef: MatDialogRef<HotelModalDialog>,
  ) {
    
    this.modalMetaData = data;
    this.createHotelForm();
    this.hotelForm.get('customerName')?.valueChanges.subscribe(value => {
      if(value && value.length > 0) {
        this.isDisable = true;
      } else {
        this.isDisable
      }
    })
  }

  createHotelForm() {
    this.hotelForm = this.fb.group({
      customerName: ['', [Validators.required]],
      contactNumber: ['', Validators.required],
      purpose: ['', Validators.required],
      idProof: [''],
      amountPaid: ['', [Validators.required]],
      date: ['', [Validators.required]],
     
    })
  }
  onClickFileInputButton(): void {
    this.fileInput.nativeElement.click();
    this.fileuploaded = false;
  }

  onChangeFileInput(element: any): void {
    this.uploadedFiles = element.target.files;
    const files: { [key: string]: File } = this.fileInput.nativeElement.files;
    this.file = files[0];
    console.log(this.file);
    let base64 = this.getBase64(this.file);
  }

  submit() {
    console.log();
    this.employeeService.addHotelActivities(this.hotelForm.getRawValue()).subscribe((resp) => {
      Swal.fire(
        'Successfully Added!',
        'Employe Has Been Added To Record',
        'success'
      )
      this.dialogRef.close();
    })
  }

  getBase64(file:any) {
    let self = this;
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      let ext = file.name.split(".")[1]
      self.us.uploadFile(reader.result, self.hotelForm.get('employeeName')?.value, ext).subscribe((res: any) => {
        self.hotelForm.get('idProof')?.patchValue(res && res.url);
        self.fileuploaded = true;
      })
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };
 }
}