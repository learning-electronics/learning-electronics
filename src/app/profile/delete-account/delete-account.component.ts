import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { account_response, login, SharedService } from 'src/app/shared.service';

@Component({
  selector: 'app-delete-account',
  templateUrl: './delete-account.component.html',
  styleUrls: ['./delete-account.component.css']
})
export class DeleteAccountComponent implements OnInit {
  hide: boolean = true;

  form: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });


  constructor(private _snackBar: MatSnackBar, private _service: SharedService, private dialogRef: MatDialogRef<DeleteAccountComponent>, private _router: Router) { }

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

    /* Only submit if the form is valid */
    if (this.form.valid) {
      var cred: login = {
        'email': this.form.controls['email'].value,
        'password': this.form.controls['password'].value
      };

      /* Call authentication method */
      this._service.deleteAccount(cred).subscribe((data: any) => {
        if (data.v == true) {
          /* Get the account response */
          data as account_response;

          /* remove the token and log status in the service */
          this._service.changeLogStatus(false);
          localStorage.removeItem('token');
          
          /* Close the Dialog */
          this.dialogRef.close();
          this._router.navigate(['/home']);
          this._snackBar.open('Conta eliminada com sucesso!', 'Close', { "duration": 2500 });
        } else {
          /* Reset the password field */
          this.form.controls['password'].reset();
          this._snackBar.open('Email ou Password incorretas!', 'Close', { "duration": 2500 });
        }
      });
    } else {
      /* Reset the password field */
      this.form.controls['password'].reset();
      this._snackBar.open('Email ou Password incorretas!', 'Close', { "duration": 2500 });
    }
  }
}
