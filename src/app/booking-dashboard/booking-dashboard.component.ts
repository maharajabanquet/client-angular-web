import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BookingServiceService } from '../services/booking-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BnNgIdleService } from 'bn-ng-idle'; // import it to your component

@Component({
  selector: 'app-booking-dashboard',
  templateUrl: './booking-dashboard.component.html',
  styleUrls: ['./booking-dashboard.component.css']
})
export class BookingDashboardComponent implements OnInit {
  isAuthenticate = false;
  loginForm!: FormGroup
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
    this.bookService.getAuth().subscribe((res: any) => {
      res = res.credentials;
      const username = this.loginForm.get('username')?.value;
      const password = this.loginForm.get('password')?.value;
      if(atob(res.username) === username && atob(res.password) === password) {
        this.isAuthenticate = true;
        this.bnIdle.startWatching(40).subscribe((res) => {
          console.log("check", res);
          if(res) {
            this.isAuthenticate = false;
            this.loginForm.get('password')?.patchValue("")
          }
        })
      } else {
        this._snackBar.open('Unauthorized Access', 'Login Failed');

      }
    })
  }

}
