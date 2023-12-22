import { Input, Component, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { UtilityService } from '../services/utility.service';

@Component({
  selector: 'my-login-form',
  template: `
      <mat-card>
            <mat-card-title *ngIf="!isSubmit">Login</mat-card-title>
            <mat-card-title *ngIf="isSubmit">
            <mat-spinner></mat-spinner>
            </mat-card-title>
            

      <mat-card-content>
        <form [formGroup]="form" (ngSubmit)="submit()">
          <p>
            <mat-form-field>
              <input type="text" matInput placeholder="Email" formControlName="email">
            </mat-form-field>
          </p>

          <p>
            <mat-form-field>
              <input type="password" matInput placeholder="Password" formControlName="password">
            </mat-form-field>
          </p>

          <p *ngIf="error" class="error">
            {{ error }}
          </p>

          <div class="button">
            <button type="submit" mat-button>Login</button>
          </div>

        </form>
      </mat-card-content>
    </mat-card>
  `,
  styles: [
    `
      :host {
        display: flex;
        justify-content: center;
        margin: 100px 0px;
      }

      .mat-form-field {
        width: 100%;
        min-width: 300px;
      }

      mat-card-title,
      mat-card-content {
        display: flex;
        justify-content: center;
      }

      .error {
        padding: 16px;
        width: 300px;
        color: white;
        background-color: red;
      }

      .button {
        display: flex;
        justify-content: flex-end;
      }
    `,
  ],

})
export class LoginFormComponent {
  form: FormGroup = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });
  isSubmit!: boolean;
  constructor(private utilityService: UtilityService) {

  }

  submit() {
    if (this.form.valid) {
        this.isSubmit = true;
        this.utilityService.login(this.form.value).subscribe((userResp: any) => {
            if(userResp && userResp.token) {
                localStorage.setItem('token', userResp.token)
                localStorage.setItem('email', userResp.email)
                localStorage.setItem('name', userResp.first_name + " " + userResp.last_name)
            }
            this.isSubmit = true;
            this.submitEM.emit(this.form.value);
        }, err => {
          console.log(err);
          this.error = err.error;
            this.isSubmit = false;
        })
      
    }
  }
  @Input() error!: string | null;

  @Output() submitEM = new EventEmitter();
}
