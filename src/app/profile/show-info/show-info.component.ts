import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as _moment from 'moment';
import { SharedService } from 'src/app/shared.service';
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
  selector: 'app-show-info',
  templateUrl: './show-info.component.html',
  styleUrls: ['./show-info.component.css'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: DATE_FORMAT },
  ]
})
export class ShowInfoComponent implements OnInit {
  disabled: boolean = true;
  progress: number = 0;

  form: FormGroup = new FormGroup({
    fname: new FormControl({ value: "", disabled: this.disabled }, [Validators.required], ),
    lname: new FormControl({ value: "", disabled: this.disabled }, [Validators.required]),
    bday: new FormControl({ value: "", disabled: this.disabled }, [Validators.required]),
    email: new FormControl({ value: "", disabled: true }),
    joined: new FormControl({ value: "", disabled: true }),
  });
  
  constructor(private _snackBar: MatSnackBar, private _service: SharedService) { }

  ngOnInit(): void {
    this.setUserInfo();
    this.progress = 0;
  }

  /* Set's the user info in the correct form controls */
  setUserInfo() {
    /* Debug testing */
    this.form.controls['fname'].setValue("Andre");
    this.form.controls['lname'].setValue("C");
    this.form.controls['email'].setValue("andrec@example.com"),
    this.form.controls['bday'].setValue(new Date("1995-12-12"));
    this.form.controls['joined'].setValue("22-02-2022");
  }

  /* Submit form action */
  submit() {
    /* Only submit if the form is valid */
    if (this.form.valid) {
      var person = { 
        email: this.form.controls['email'].value, 
        first_name: this.form.controls['fname'].value, 
        last_name: this.form.controls['lname'].value, 
        birth_date: moment(this.form.controls['bday'].value).format('YYYY-MM-DD'), 
      };

      /* Call registration method 
      this._service.register(person).subscribe((data: any) => {
        
        if (data.v == true) {
          this._snackBar.open('Registo bem sucedido!', 'Close', { "duration": 2500 });
        } else {
          this._snackBar.open('Parâmetros introduzidos inválidos!', 'Close', { "duration": 2500 });
        }
      });
      */
    } else {
      this._snackBar.open('Parâmetros introduzidos inválidos!', 'Close', { "duration": 2500 });
    }
  }

  /* Control the form edit state */
  edit() {
    this.disabled = !this.disabled;
    if (this.disabled) {
      /* Disable the form controls */
      this.form.controls['fname'].disable();
      this.form.controls['lname'].disable();
      this.form.controls['bday'].disable();

      /* Set the default information about the user */
      this.setUserInfo();
    } else {
      /* Enable the form edit state */
      this.form.controls['fname'].enable();
      this.form.controls['lname'].enable();
      this.form.controls['bday'].enable();
    }
  }
}
