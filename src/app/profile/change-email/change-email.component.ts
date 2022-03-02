import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SharedService } from 'src/app/shared.service';

@Component({
  selector: 'app-change-email',
  templateUrl: './change-email.component.html',
  styleUrls: ['./change-email.component.scss']
})
export class ChangeEmailComponent implements OnInit {
  hide: boolean = true;
  form!: FormGroup;
  
  constructor(private _formBuilder: FormBuilder, private _snackBar: MatSnackBar, private _service: SharedService, private dialogRef: MatDialogRef<ChangeEmailComponent>,) { }

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      email_old: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      email2: new FormControl('', [Validators.required, Validators.email]),   
    }, {validator: emailMatchValidator});
  }

  /* Shorthands for form controls (used from within template) */
  get email() { return this.form.get('email'); }
  get email2() { return this.form.get('email2'); }

  /* Called on each input in either password field */
  onEmailInput() {
    if (this.form.hasError('emailMismatch'))
      this.email2?.setErrors([{'emailMismatch': true}]);
    else
      this.email2?.setErrors(null);
  }

  /* Error Message for Email validation */
  getErrorMessageEmail() {
    if (this.form.controls['email'].hasError('required') || this.form.controls['email_old'].hasError('required')) {
      return 'Você deve inserir um email';
    }

    return this.form.controls['email'].hasError('email') || this.form.controls['email_old'].hasError('email') ? 'Email não é válido' : '';
  }

  /* Submit form action */
  submit() {
    /* Only submit if the form is valid */
    if (this.form.valid) {
      
    } else {
      this._snackBar.open('!', 'Close', { "duration": 2500 });
    }
  }
}

export const emailMatchValidator: ValidatorFn = (formGroup: AbstractControl ): ValidationErrors | null => {
  if (formGroup.get('email')?.value === formGroup.get('email2')?.value)
    return null;
  else
    return {emailMismatch: true};
};
