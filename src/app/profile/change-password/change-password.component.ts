import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { passwordMatchValidator } from 'src/app/register/register.component';
import { SharedService, account_response, passwords } from 'src/app/shared.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  hide_old: boolean = true;
  hide_new: boolean = true;
  hide_new2: boolean = true;
  minPw: number = 8;
  form!: UntypedFormGroup;

  constructor(private _formBuilder: UntypedFormBuilder, private _snackBar: MatSnackBar, private _service: SharedService, private dialogRef: MatDialogRef<ChangePasswordComponent>) { }

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      password_old: new UntypedFormControl('', [Validators.required]),
      password: ['', [Validators.required, Validators.minLength(this.minPw)]],
      password2: ['', [Validators.required]],
    }, {validator: passwordMatchValidator});
  }
  
  /* Shorthands for form controls (used from within template) */
  get password() { return this.form.get('password'); }
  get password2() { return this.form.get('password2'); }

  /* Called on each input in either password field */
  onPasswordInput() {
    if (this.form.hasError('passwordMismatch'))
      this.password2?.setErrors([{'passwordMismatch': true}]);
    else
      this.password2?.setErrors(null);
  }

  /* Submit form action */
  submit() {
    /* Only submit if the form is valid */
    if (this.form.valid) {
      var passwords: passwords = {
        old_pwd: this.form.controls['password_old'].value,
        new_pwd: this.form.controls['password'].value
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
      this._snackBar.open('Parâmetros introduzidos inválidos!', 'Close', { "duration": 2500 });
    }
  }
}
