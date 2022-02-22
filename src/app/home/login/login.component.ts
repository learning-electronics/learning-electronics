import { Component, OnInit, Input } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormGroup, FormControl, Validators } from '@angular/forms';

export interface auth_response {
  message: boolean,
  email: string,
  token: string
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  hide: boolean = true;
  token: string = "";
  auth_res: auth_response = { message: false, email: "", token: "" };

  @Input() error: string | undefined;
  form: FormGroup = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    check: new FormControl('', [Validators.required])
  });
  
  constructor(private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
  }

  /* Error Message for Username/Email validation */
  getErrorMessage() {
    if (this.form.controls['username'].hasError('required')) {
      return 'You must enter a value';
    }

    return this.form.controls['username'].hasError('email') ? 'Not a valid username' : '';
  }

  /* Submit form action */
  submit() {
    /* Debug */
    console.log(this.form.controls['username'].value);
    console.log(this.form.controls['password'].value);
    console.log(this.form.controls['check'].value);

    /* Only submit if the form is valid */
    if (this.form.valid) {
      /* Call authentication method here */
      if (false) {
        /* Do something */  
      } else {
        console.log('error');
        this.error = "Username or Password incorrect!";
      }
    }
  }

}
