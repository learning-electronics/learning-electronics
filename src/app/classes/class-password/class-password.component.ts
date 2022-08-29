import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { account_response, SharedService } from 'src/app/shared.service';

@Component({
  selector: 'app-class-password',
  templateUrl: './class-password.component.html',
  styleUrls: ['./class-password.component.scss']
})
export class ClassPasswordComponent implements OnInit {
  info_class: any;
  hide: boolean = true;
  form!: UntypedFormGroup;

  constructor(private _formBuilder: UntypedFormBuilder, 
    private _snackBar: MatSnackBar, 
    private _service: SharedService,
    private _router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any, 
    private dialogRef: MatDialogRef<ClassPasswordComponent>) {
    this.info_class = data;
  }

  ngOnInit(): void {
    this.form = this._formBuilder.group({ password: new UntypedFormControl('', [Validators.required]) });
  }

  /* Submit thed form to login into the classroom */
  submit() {
    /* Only submit if the form is valid */
    if (this.form.valid) {
      /* Call login classroom method */
      this._service.loginClassroom(this.info_class.id, this.form.controls['password'].value).subscribe((data: any) => {      
        console.log(data);
          
        if ("v" in data) {
          data as account_response;

          /* Check if the response is valid */
          if (data.v) {
            this._snackBar.open('Login bem sucedido!', 'Close', { "duration": 2500 });
            this.dialogRef.close();
            
            /* Open the classroom */
            this.openClassroom(this.info_class);
            this._router.navigate(['class/']);
          } else {
            /* Reset old password field */
            this.form.controls['password'].reset();
            this._snackBar.open('Password incorreta!', 'Close', { "duration": 2500 });
          }
        }       
      });
    } else {
      /* Reset old password field */
      this.form.controls['password'].reset();
      this._snackBar.open('Password introduzida inválida!', 'Close', { "duration": 2500 });
    }
  }

  /* Change the opened classroom */
  openClassroom(info: any) {
    this._service.openClassroom(info);
  }
}
