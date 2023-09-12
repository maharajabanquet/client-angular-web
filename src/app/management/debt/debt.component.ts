import {Component, OnInit} from '@angular/core';
import {DataSource} from '@angular/cdk/collections';
import {Observable, ReplaySubject} from 'rxjs';
import {MatTableModule} from '@angular/material/table';
import {MatButtonModule} from '@angular/material/button';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UtilityService } from 'src/app/services/utility.service';
import {MatSnackBar} from '@angular/material/snack-bar';

const ELEMENT_DATA: PeriodicElement[] = [];
export interface PeriodicElement {
  position: number,
  name: string;
  payment_history: any
  balance: number;
}
@Component({
  selector: 'app-debt',
  templateUrl: './debt.component.html',
  styleUrls: ['./debt.component.css'],
  
})
export class DebtComponent implements OnInit {

  displayedColumns: string[] = ['position','name', 'payment_history', 'balance', 'action'];
  dataToDisplay = [...ELEMENT_DATA];
  paymentHistory = [{amount: '', date: ''}]
  dataSource = new ExampleDataSource(this.dataToDisplay);
  updateData: any;
  amount!: Number
  constructor(private dialog: MatDialog, private ut: UtilityService,  private _snackBar: MatSnackBar) {
    this.getDebt();
  }

  getDebt() {
    this.ut.getDebt().subscribe((resp: any) =>{
      const elements = (resp && resp.debt) || [];
      const mapElements = elements.map((element: any) => ({
        name: element.name,
        balance: element.balance,
        payment_history: element.payment_history
      }))
      this.dataSource = mapElements;
    })
  }
  addData() {
    const dialogRef = this.dialog.open(DebtModalDialog, {
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);})
      this.getDebt()
  }

  ngOnInit(): void {
    
  }

  viewPaymentHistory(data: any, templateRef: any) {
    let dialogRef = this.dialog.open(templateRef, {
      width: '50%'
    });
    this.paymentHistory = data;
  }

  update(data: any, templateRef: any) {
    let dialogRef = this.dialog.open(templateRef, {
    });
    this.update = data;
  }

  submitUpdate() {
    const payload = {
      amount: this.amount,
      date: new Date().toLocaleDateString('en-GB')
    }
    const name = this.update.name;
    this.ut.updatePayment(payload, name).subscribe((resp: any) => {
      this._snackBar.open('Data has been added', 'OK');
    })
    

  }

  removeData() {
    this.dataToDisplay = this.dataToDisplay.slice(0, -1);
    this.dataSource.setData(this.dataToDisplay);
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

declare var swal: any
@Component({
  selector: 'debt-modal',
  templateUrl: 'debt-modal.html',
  styleUrls: ['debt-modal.css']
})

export class DebtModalDialog {
  debtForm!: FormGroup
  constructor(private fb: FormBuilder,private utilitiyService: UtilityService,  private _snackBar: MatSnackBar) {
    this.debtForm = this.fb.group({
    name: [],
    payment_history: [[]],
    balance: []
    })
  }

  submit() {
    this.utilitiyService.addDebt(this.debtForm.getRawValue()).subscribe((resp: any) => {
      this._snackBar.open('Data has been added', 'OK');
    }) 
  }

}