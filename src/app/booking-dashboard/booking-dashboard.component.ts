import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BookingServiceService } from '../services/booking-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BnNgIdleService } from 'bn-ng-idle'; // import it to your component

@Component({
  selector: 'app-booking-dashboard',
  templateUrl: './booking-dashboard.component.html',
  styleUrls: ['./booking-dashboard.component.css'],
})
export class BookingDashboardComponent implements OnInit {
  isAuthenticate = false;
  loginForm!: FormGroup
  showFiller = false;

  constructor(
    private fb: FormBuilder,
    private bookService: BookingServiceService,
    private _snackBar: MatSnackBar,
    private bnIdle: BnNgIdleService
  ) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    })
  }


  login() {
    this.bookService.getAuth(this.loginForm.get('username')?.value, this.loginForm.get('password')?.value).subscribe((res: any) => {
      this.isAuthenticate = true;
  
    }, (err) => {
      this._snackBar.open('Unauthorized Access', 'Login Failed');
    })
  }

}
