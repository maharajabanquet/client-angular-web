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
  displayedColumns: string[] = ['position', 'userName','mobile','password' , 'dateOfBooking', 'Admin', 'Action', 'Notify'];
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
    this.getUser();
  }

  remove(element: any) {
    console.log(element);
    this.employeeService.removeUser(element).subscribe((resp: any) => {
      Swal.fire(
        'Successfully Removed!',
        'User Has Been Removed !!!',
        'success'
      )
      this.getUser();
    })

  }

  getUser() {
    this.employeeService.getUser().subscribe((userList: any) => {
      let counter = 0;
      const elements = (userList && userList) || [];
      const mapElements = elements.map((element: any) => ({
        position: counter+1,
        userName: element.userName,
        password: element.password,
        mobile: element.mobile,
        dateOfBooking: element.dateOfBooking,
        isAdmin: this.isAdminTrue(element.isAdmin),
        
      }))
      this.dataSource = mapElements;
      // {position: 1, employeeName: 'Madan Paswan', contact: '8970777693',department: 'cleaning', salary: 'View', documentProof: 'View', joiningDate: '02/12/2022', action: ''},
    })
  }

  isAdminTrue(isAdmin: any) {
    if(isAdmin) {
      return 'Yes'
    } else {
      return 'No'
    }
  }

  viewDocumentProof(url: any) {
    window.open(url, "_blank");
  }

  openNotificationModalForm(data: any) {
    
    const dialogRef = this.dialog.open(NotifcationModalDialog, {
      data: data
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);})
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
      this.getUser();
    });
  }

  openDialog() {
  
  }


  
}

@Component({
  selector: 'common-modal',
  templateUrl: 'notification-modal.html',
  styleUrls: ['hotel-modal.css']
})
export class NotifcationModalDialog {
  modalMetaData: any;
  notifyForm!: FormGroup;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: FormBuilder,
    private us: UtilityService,
  ){ 
    this.modalMetaData = data;
    this.notifyForm = this.fb.group({
      title: ['', [Validators.required]],
      body: ['', [Validators.required]],
      img: ['', [Validators.required]]
    })
  }

  sendNotification() {
    const payload = this.notifyForm.getRawValue();
    this.us.sendNotification(payload, this.modalMetaData.mobile).subscribe(resp => {
      Swal.fire(
        'Notification Sent!',
        'User Has Been Notified !!!',
        'success'
      )
    })
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
  userForm!: FormGroup;
  

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
    this.userForm.get('customerName')?.valueChanges.subscribe(value => {
      if(value && value.length > 0) {
        this.isDisable = true;
      } else {
        this.isDisable
      }
    })
  }

  createHotelForm() {
    this.userForm = this.fb.group({
      mobile: ['', [Validators.required]],
      userName: ['', Validators.required],
      password: ['', Validators.required],
      dateOfBooking: [''],
      isAdmin: [false, Validators.required],
      isDj: []
    })
  }
 


  submit() {
    let payload: any;
    if(this.userForm.get('isDj')?.value) {
       payload = {
        "mobile": this.userForm.get('mobile')?.value,
        "userName": this.userForm.get('userName')?.value,
        "password": this.userForm.get('password')?.value,
        "dateOfBooking": this.userForm.get('dateOfBooking')?.value,
        "isAdmin": this.userForm.get('isAdmin')?.value,
        "payment": 0,
        "__v": 0,
        "isDj": this.userForm.get('isDj')?.value
      }
    } else {
       payload = {
        "mobile": this.userForm.get('mobile')?.value,
        "userName": this.userForm.get('userName')?.value,
        "password": this.userForm.get('password')?.value,
        "dateOfBooking": this.userForm.get('dateOfBooking')?.value,
        "isAdmin": this.userForm.get('isAdmin')?.value,
        "payment": 0,
        "cart": [
          {
            "_id": "645f32244c440597d142d72d",
            "id": "0",
            "category": "Tent",
            "discription": "Center Table, Steel Chair, ...",
            "img": "https://5.imimg.com/data5/VD/KL/PS/SELLER-9029459/marriage-hall-chair-500x500.jpg",
            "categoryList": [
              {
                "itemName": "Plastic Chair",
                "price": 5,
                "quantity": 100,
                "orderQuant": 0
              },
              {
                "itemName": "Steel Chair with Cover",
                "price": 25,
                "quantity": 100,
                "orderQuant": 0
              },
              {
                "itemName": "Center Table",
                "price": 100,
                "quantity": 5,
                "orderQuant": 0
              },
              {
                "itemName": "Blanket",
                "price": 0,
                "quantity": 15,
                "orderQuant": 0
              }
            ]
          },
          {
            "_id": "645f329b4c440597d142d72f",
            "id": "1",
            "category": "Catering",
            "discription": "Plates & Spoon, ...",
            "img": "https://i.pinimg.com/originals/a7/41/0d/a7410d1c429840ab6d883347a8c9c59c.jpg",
            "categoryList": [
              {
                "itemName": "Coffee Tea Machine",
                "price": 2000,
                "quantity": 1,
                "orderQuant": 0
              },
              {
                "itemName": "Plates & Spoon",
                "price": 5,
                "quantity": 200,
                "orderQuant": 0
              },
              {
                "itemName": "Mixer grinder",
                  "price": 5,
                  "quantity": 1,
                  "orderQuant": 0
                }
            ],
            "__v": 0
          },
          {
            "_id": "645f32b44c440597d142d733",
            "id": "2",
            "category": "Party Props",
            "discription": "Pyro gun, ...",
            "img": "https://5.imimg.com/data5/ANDROID/Default/2022/7/PK/AS/FW/120886659/product-jpeg-500x500.jpg",
            "categoryList": [
              {
                "itemName": "Pyro Gun",
                "price": 250,
                "quantity": 4,
                "orderQuant": 0
              }
            ]
          }
        ],
        "__v": 0
      }
    }
    
    this.employeeService.addUser(payload).subscribe((resp) => {
      Swal.fire(
        'Successfully Added!',
        'User Has Been Added To Record',
        'success'
      )
      this.dialogRef.close();
    }, (err) => {
      Swal.fire(
        'Not Added!',
        'Failed to add user',
        'error'
      )
    })
  }

}