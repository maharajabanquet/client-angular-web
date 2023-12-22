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
  employeeName: string;
  position: number;
  department: string;
  salary: string;
  joiningDate: string;
  documentProof: string;
  action: string;
  contact: string;

}
const ELEMENT_DATA: PeriodicElement[] = [];

@Component({
  selector: 'data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.css']
})
export class DataTableComponent implements OnInit {
 
  displayedColumns: string[] = ['position', 'type','mediaSoruce'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  selection = new SelectionModel<PeriodicElement>(true, []);
  @Input() label: any = 'Employee'
  @Input() type: any = ''
  departmentList: any = []
  constructor(
    public dialog: MatDialog,
    private utillityService: UtilityService,
    private employeeService:EmployeeService
  ) { }

  ngOnInit(): void {
    this.getDepartment();
    this.getAllMedia();
  }

  getAllMedia() {
    this.utillityService.getMedia().subscribe((media: any) => {
      let counter = 0;
      const elements = (media) || [];
      const mapElements = elements.map((element: any) => ({
        position: counter+1,
        type: element.type,
        mediaSoruce: element.mediaSource,
      }))
      this.dataSource = mapElements;
      // {position: 1, employeeName: 'Madan Paswan', contact: '8970777693',department: 'cleaning', salary: 'View', documentProof: 'View', joiningDate: '02/12/2022', action: ''},
    })
  }

  viewDocumentProof(url: any) {
    window.open(url, "_blank");
  }

  deleteEmployee(contact: any) {
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
        this.employeeService.deleteEmployee(contact).subscribe((res: any) => {
          Swal.fire(
            'Deleted!',
            'Emplyee Data has been deleted.',
            'success'
          )
          this.getAllMedia();
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

  addEmployee() {
    const dialogRef = this.dialog.open(CommonModalDialog, {
      data: {header: 'Add Employee',department: this.departmentList}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getAllMedia();
    });
  }

  openDialog() {
  
  }

  getDepartment() {
    this.utillityService.getDepartment().subscribe((dept: any) => {
      this.departmentList = dept && dept.department || [];
    })
  }

  
}


declare var swal: any
@Component({
  selector: 'common-modal',
  templateUrl: 'common-modal.html',
  styleUrls: ['common-modal.css']
})
export class CommonModalDialog {
  @ViewChild('fileInput') fileInput : any;
  mediaForm!: FormGroup;
  

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
    public dialogRef: MatDialogRef<CommonModalDialog>,
  ) {
    
    this.modalMetaData = data;
    this.createEmployeeForm();
    this.mediaForm.get('employeeName')?.valueChanges.subscribe(value => {
      if(value && value.length > 0) {
        this.isDisable = true;
      } else {
        this.isDisable
      }
    })
  }

  createEmployeeForm() {
    this.mediaForm = this.fb.group({
      mediaSource: ['', [Validators.required]],
      type: ['', Validators.required],
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
    let base64 = this.getBase64(this.file);
  }

  submit() {
    this.us.addMedia(this.mediaForm.getRawValue()).subscribe((resp) => {
      Swal.fire(
        'Employee Added!',
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
      self.us.uploadFile(reader.result, file.name, ext).subscribe((res: any) => {
        self.mediaForm.get('mediaSource')?.patchValue(res && res.url);
        self.fileuploaded = true;
      })
    };
    reader.onerror = function (error) {
     
    };
 }
 
}