import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SharedService } from 'src/app/shared.service';
import { MatDialogRef } from '@angular/material/dialog';

export interface account_response {
  v: boolean,
  m: string,
  t: string
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  hide: boolean = true;
  auth_res: account_response = { v: false, m: "", t: "" };

  form: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    check: new FormControl(false)
  });
  
  constructor(private _snackBar: MatSnackBar, private _service: SharedService, private dialogRef: MatDialogRef<LoginComponent>) { }

  ngOnInit(): void {
  }

  /* Error Message for Email validation */
  getErrorMessageEmail() {
    if (this.form.controls['email'].hasError('required')) {
      return 'Você deve inserir um valor';
    }

    return this.form.controls['email'].hasError('email') ? 'Email não é válido' : '';
  }

  /* Submit form action */
  submit() {
    /* Debug */
    console.log(this.form.controls['email'].value);
    console.log(this.form.controls['password'].value);
    console.log(this.form.controls['check'].value);

    /* Only submit if the form is valid */
    if (this.form.valid) {
      var cred = { 
        'email': this.form.controls['email'].value, 
        'password': this.form.controls['password'].value
      };
      
      /* Call authentication method */
      this._service.login(cred).subscribe((data: any) => {
        console.log(data);
        if (data.v == true) {
          /* Get the auth response */
          this.auth_res = data as account_response;

          /* Set the auth response and log status in the service */
          localStorage.setItem('token', this.auth_res.t);
          this._service.changeLogStatus(true);

          /* Close the Dialog */
          this.dialogRef.close();
          this._snackBar.open('Login bem sucedido!', 'Close', { "duration": 2500 });
        } else {
          /* Set the log status as false and reset the password field */
          this._service.changeLogStatus(false);
          this.form.controls['password'].reset();
          this._snackBar.open('Email ou Password incorretas!', 'Close', { "duration": 2500 });
        }
      });
    } else {
      /* Set the log status as false */
      this._service.changeLogStatus(false);
      this._snackBar.open('Email ou Password incorreta!', 'Close', { "duration": 2500 });
    }
  }
}
