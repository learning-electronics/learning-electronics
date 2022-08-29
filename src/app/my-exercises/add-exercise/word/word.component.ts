import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { classroom, SharedService, theme } from 'src/app/shared.service';

@Component({
  selector: 'app-word',
  templateUrl: './word.component.html',
  styleUrls: ['./word.component.scss']
})
export class WordComponent implements OnInit {
  form!: UntypedFormGroup;
  fileChangedEvent : any = "";
  themes: theme[] = [];
  units: string[] = [];
  classrooms: classroom[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private _formBuilder: UntypedFormBuilder,
    private _service: SharedService,
    private _snackBar: MatSnackBar
  ) {
    this.themes = data.themes;
    this.units = data.units;
    this.classrooms = data.classrooms;
  }

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      word : new UntypedFormControl("", [Validators.required]),
      check : new UntypedFormControl(false)
    })
  }

  /* Submit form action */
  submit() {
    const formData = new FormData();
    formData.append('file', this.form.get('word')?.value);
    //formData.append('public', this.form.get('check')?.value);

    this._service.addExerciseWord(formData).subscribe((data: any) => { 
      console.log(data);
    });
  }

  /* Block Classrooms form field when "public" checkbox is chosen */
  blockClassrooms(val: boolean) {
    if (val) {
      this.form.controls['classrooms'].reset();
      this.form.controls['classrooms'].disable();
    } else {
      this.form.controls['classrooms'].enable();
    }
  }

  /* Transform the base64 to a blob */
  convertDataUrlToBlob(dataUrl:any): Blob {
    const arr = dataUrl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new Blob([u8arr], {type: mime});
  }

  fileChangeEvent(event: any): void {
    if(event.target.files.length > 0) {
      const file = event.target.files[0];
      this.form.get('word')?.setValue(file);
    }
  }
}
