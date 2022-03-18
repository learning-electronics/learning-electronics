import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import * as _moment from 'moment';
import { SharedService, person } from 'src/app/shared.service';
const moment = _moment;

export const DATE_FORMAT = {
  parse: {
      dateInput: ['DD-MM-YYYY', 'DD/MM/YYYY']
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
  styleUrls: ['./show-info.component.scss'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: DATE_FORMAT },
  ]
})
export class ShowInfoComponent implements OnInit {
  @Input() user_info: person | undefined;
  disabled: boolean = true;
  progress: number = 0;
  type: string = 'Aluno';

  form: FormGroup = new FormGroup({
    fname: new FormControl({ value: "", disabled: this.disabled }, [Validators.required]),
    lname: new FormControl({ value: "", disabled: this.disabled }, [Validators.required]),
    bday: new FormControl({ value: "", disabled: this.disabled }, [Validators.required]),
    email: new FormControl({ value: "", disabled: this.disabled }),
    joined: new FormControl({ value: "", disabled: true }),
  });
  
  constructor(private _snackBar: MatSnackBar, private _service: SharedService, private _router: Router) { }

  ngOnInit(): void {
    this.setUserInfo();
    this.progress = 0;
  }
  
  /* Update the Input variable changes */
  ngOnChanges() {
    this.setUserInfo();

    if (this.user_info !== undefined) {
      if (this.user_info.role == 'Student') {
        this.type = 'Aluno';
      } else {
        this.type = 'Professor';
      }
    }
  }

  /* Set's the user info in the correct form controls */
  setUserInfo() {
    this.form.controls['fname'].setValue(this.user_info?.first_name);
    this.form.controls['lname'].setValue(this.user_info?.last_name);
    this.form.controls['email'].setValue(this.user_info?.email),
    this.form.controls['bday'].setValue(new Date(this.user_info?.birth_date == undefined ? new Date(): this.user_info?.birth_date));
    this.form.controls['joined'].setValue(moment(this.user_info?.joined).format('DD-MM-YYYY'));
  }

  /* Submit form action */
  submit() {
    /* Only submit if the form is valid */
    if (this.form.valid) {
      var person: any = {};

      // Fill the person object only with updated values
      if (this.form.controls['fname'].value != this.user_info?.first_name) person['first_name'] = this.form.controls['fname'].value;
      if (this.form.controls['lname'].value != this.user_info?.last_name) person['last_name'] = this.form.controls['lname'].value;
      if (moment(this.form.controls['bday'].value).format('YYYY-MM-DD') != this.user_info?.birth_date) person['birth_date'] = moment(this.form.controls['bday'].value).format('YYYY-MM-DD');
      
      // Check if the person variable is empty
      if (Object.keys(person).length != 0) {
        /* Call registration method */
        this._service.updateAccount(person).subscribe((data: any) => {
          if (data.v == true) {
            /* Realod the Profile Component */
            let currentUrl = this._router.url;
            this._router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
                this._router.navigate([currentUrl]);
            });

            this._snackBar.open('Dados Atualizados!', 'Close', { "duration": 2500 });
          } else {
            this._snackBar.open('Parâmetros introduzidos inválidos!', 'Close', { "duration": 2500 });
          }
        });
      }
    } else {
      this._snackBar.open('Parâmetros introduzidos inválidos!', 'Close', { "duration": 2500 })
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
