import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/shared.service';

@Component({
  selector: 'app-start-exam',
  templateUrl: './start-exam.component.html',
  styleUrls: ['./start-exam.component.scss']
})
export class StartExamComponent implements OnInit {
  hide: boolean = true;

  form: UntypedFormGroup = new UntypedFormGroup({ password: new UntypedFormControl('', [Validators.required]) });

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private _service: SharedService, 
    private _snackBar: MatSnackBar,
    private _router: Router,
    private dialogRef: MatDialogRef<StartExamComponent>
  ) { }

  ngOnInit(): void {
  }

  openExam() {
    this._service.openTest(this.data.class.id, this.data.exam.id, {password: this.form.get('password')?.value}).subscribe((data: any) => {
      if (!("v" in data)) {
        this.dialogRef.close();
        data.nquestions = data.exercises.length;
        data.class = this.data.class.id;
        data.exam = this.data.exam.id;

        this._service.openExam(data);
        this._router.navigate(['/show-quiz']);
      } else {
        this.form.reset();
        this._snackBar.open("Password errada", 'Fechar', { duration: 2500 });
      }
    });
  }
}
