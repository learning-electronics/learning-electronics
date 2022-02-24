import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { Router } from '@angular/router';
import { account_response, person, SharedService } from '../shared.service';
import * as _moment from 'moment';
const moment = _moment;

export const DATE_FORMAT = {
  parse: {
      dateInput: 'LL'
  },
  display: {
      dateInput: 'DD-MM-YYYY',
      monthYearLabel: 'YYYY',
      dateA11yLabel: 'LL',
      monthYearA11yLabel: 'YYYY'
  }
};

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: DATE_FORMAT },
  ]
})
export class RegisterComponent implements OnInit {
  hide: boolean = true;

  form: FormGroup = new FormGroup({
    fname: new FormControl('', [Validators.required]),
    lname: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    bday: new FormControl('', [Validators.required]),
  });

  constructor(private _snackBar: MatSnackBar, private _service: SharedService, private _router: Router) { }

  ngOnInit(): void {
  }

  /* Error Message for Email validation */
  getErrorMessage() {
    if (this.form.controls['email'].hasError('required')) {
      return 'Você deve inserir um valor';
    }

    return this.form.controls['email'].hasError('email') ? 'Email não é válido' : '';
  }

  /* Submit form action */
  submit() {
    /* Only submit if the form is valid */
    if (this.form.valid) {
      var person: person = { 
        email: this.form.controls['email'].value, 
        first_name: this.form.controls['fname'].value, 
        last_name: this.form.controls['lname'].value, 
        birth_date: moment(this.form.controls['bday'].value).format('YYYY-MM-DD'), 
        password: this.form.controls['password'].value 
      };

      /* Call registration method */
      this._service.register(person).subscribe((data: any) => {
        data as account_response;
        
        if (data.v == true) {
          /* Redirect to home */
          this._router.navigate(['/home']);
          this._snackBar.open('Registo bem sucedido!', 'Close', { "duration": 2500 });
        } else {
          /* Reset Email and Password forms */
          this.form.controls['email'].reset();
          this.form.controls['password'].reset();
          this._snackBar.open('Email já está registado!', 'Close', { "duration": 2500 });
        }
      });
    } else {
      this._snackBar.open('Parametros introduzidos inválidos!', 'Close', { "duration": 2500 });
    }
  }

}
