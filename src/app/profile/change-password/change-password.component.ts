import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SharedService, account_response, passwords } from 'src/app/shared.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  hide_old: boolean = true;
  hide_new: boolean = true;

  form: FormGroup = new FormGroup({
    password_old: new FormControl('', [Validators.required]),
    password_new: new FormControl('', [Validators.required]),
  });

  constructor(private _snackBar: MatSnackBar, private _service: SharedService, private dialogRef: MatDialogRef<ChangePasswordComponent>) { }

  ngOnInit(): void {
  }
  
  /* Submit form action */
  submit() {
    /* Debug */
    console.log(this.form.controls['password_old'].value);
    console.log(this.form.controls['password_new'].value);

    /* Only submit if the form is valid */
    if (this.form.valid) {
      var passwords: passwords = {
        old_pwd: this.form.controls['password_old'].value,
        new_pwd: this.form.controls['password_new'].value
      }

      /* Call change password method */
      this._service.changePassword(passwords).subscribe((data: any) => {        
        if ("v" in data) {
          data as account_response;

          /* Check if the response is valid */
          if (data.v) {
            this._snackBar.open('Mudança bem sucedida!', 'Close', { "duration": 2500 });
            this.dialogRef.close();
          } else {
            /* Reset old password field */
            this.form.controls['password_old'].reset();
            this._snackBar.open('Password antiga incorreta!', 'Close', { "duration": 2500 });
          }
        }       
      });
    } else {
      /* Reset old password field */
      this.form.controls['password_old'].reset();
      this._snackBar.open('Password antiga incorreta!', 'Close', { "duration": 2500 });
    }
  }
}
