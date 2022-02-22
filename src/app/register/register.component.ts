import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
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

  constructor(private _snackBar: MatSnackBar) { }

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
    /* Debug */
    console.log(this.form.controls['email'].value);
    console.log(this.form.controls['fname'].value);
    console.log(this.form.controls['lname'].value);
    console.log(this.form.controls['password'].value);
    console.log(moment(this.form.controls['bday'].value).format('DD-MM-YYYY'));
    console.log(moment().format('DD-MM-YYYY'));

    /* Only submit if the form is valid */
    if (this.form.valid) {
      /* Call authentication method here */
      if (false) {
        /* Do something */
        this._snackBar.open('Registo bem sucedido!', 'Close', { "duration": 2500 });
      } else {
        this.form.controls['password'].reset();
        this._snackBar.open('Email ou Password incorretas!', 'Close', { "duration": 2500 });
      }
    } else {
      this._snackBar.open('Email ou Password incorreta!', 'Close', { "duration": 2500 });
    }
  }

}
