import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UntypedFormGroup, UntypedFormControl, Validators,  ValidationErrors, ValidatorFn, AbstractControl, UntypedFormBuilder } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { Router } from '@angular/router';
import { account_response, person, SharedService } from '../shared.service';
import * as _moment from 'moment';
import { MatDialog } from '@angular/material/dialog';
import { TermsConditionsComponent } from './terms-conditions/terms-conditions.component';
import { LoginComponent } from '../home/login/login.component';
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
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: DATE_FORMAT },
  ]
})
export class RegisterComponent implements OnInit {
  hide: boolean = true;
  hide_confirm: boolean = true;
  minPw: number = 8;
  form!: UntypedFormGroup;

  constructor(private _formBuilder: UntypedFormBuilder, private _snackBar: MatSnackBar, private _service: SharedService, private _router: Router, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      fname: new UntypedFormControl('', [Validators.required]),
      lname: new UntypedFormControl('', [Validators.required]),
      email: new UntypedFormControl('', [Validators.required, Validators.email]),
      password: ['', [Validators.required, Validators.minLength(this.minPw)]],
      password2: ['', [Validators.required]],
      bday: new UntypedFormControl('', [Validators.required]),
      terms: new UntypedFormControl(false, [Validators.requiredTrue])    
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

  /* Error Message for Email validation */
  getErrorMessageEmail() {
    if (this.form.controls['email'].hasError('required')) {
      return 'Você deve inserir um email';
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
        password: this.form.controls['password'].value,
        avatar: null,
        role: 1
      };

      /* Call registration method */
      this._service.register(person).subscribe((data: any) => {
        data as account_response;
        
        if (data.v == true) {
          /* Redirect to home */
          this._router.navigate(['/home']);
          this._snackBar.open('Confirme a sua conta acendendo ao Email!', 'Fechar', { "duration": 2500 });
        } else {
          /* Reset Email and Password forms */
          this.form.controls['email'].reset();
          this.form.controls['password'].reset();
          this.form.controls['password2'].reset();
          this._snackBar.open('Email já está registado!', 'Fechar', { "duration": 2500 });
        }
      });
    } else {
      if (this.form.controls['terms'].value == false) {
        this._snackBar.open('Os termos e condições têm que ser aceites!', 'Fechar', { "duration": 2500 });
      } else {
        this._snackBar.open('Parâmetros introduzidos inválidos!', 'Fechar', { "duration": 2500 });
      }
    }
  }

  openTerms() {
    this.form.controls['terms'].setValue(!this.form.controls['terms'].value);
    const dialogRef = this.dialog.open(TermsConditionsComponent, {
      width: '80%',
      height: '80%'
    });
  }

  /* Open Login Dialog */
  login() {
    const dialogRef = this.dialog.open(LoginComponent, {
      width: '30%',
      minWidth: '330px',
      maxWidth: '500px',
    });
  }
}

export const passwordMatchValidator: ValidatorFn = (formGroup: AbstractControl ): ValidationErrors | null => {
  if (formGroup.get('password')?.value === formGroup.get('password2')?.value)
    return null;
  else
    return {passwordMismatch: true};
};
