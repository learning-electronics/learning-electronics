import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-class',
  templateUrl: './add-class.component.html',
  styleUrls: ['./add-class.component.scss']
})
export class AddClassComponent implements OnInit {
  hide: boolean = true;
  hide_confirm: boolean = true;
  minPw: number = 6;
  form!: FormGroup;

  constructor(private _formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      name: new FormControl('', [Validators.required]),
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

  /* Generate a Password for the Classroom */
  generatePassword() {
    var randomString: string = Math.random().toString(36).slice(-6).toUpperCase();

    this.form.controls['password'].setValue(randomString);
    this.form.controls['password2'].setValue(randomString);
    this.hide = false;
    this.hide_confirm = false;
  }

  /* Submit form action */
  submit() {}
}

export const passwordMatchValidator: ValidatorFn = (formGroup: AbstractControl ): ValidationErrors | null => {
  if (formGroup.get('password')?.value === formGroup.get('password2')?.value)
    return null;
  else
    return {passwordMismatch: true};
};
