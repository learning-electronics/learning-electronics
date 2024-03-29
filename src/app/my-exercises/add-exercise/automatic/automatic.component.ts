import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { classroom, SharedService, theme } from 'src/app/shared.service';
import { AddExerciseComponent } from '../add-exercise.component';

@Component({
  selector: 'app-automatic',
  templateUrl: './automatic.component.html',
  styleUrls: ['./automatic.component.scss']
})
export class AutomaticComponent implements OnInit {
  form! : UntypedFormGroup;
  fileChangedEvent : any = "";
  imageChangedEvent: any = '';
  croppedImage: any = '';
  themes: theme[] = [];
  units: string[] = [];
  classrooms: classroom[] = [];
  ModalTitle: string;
  
  constructor(
    private _formBuilder: UntypedFormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _service: SharedService,
    private _snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<AddExerciseComponent>,
    private _router: Router
  ) {
    this.themes = data.themes;
    this.units = data.units;
    this.classrooms = data.classrooms;
    this.ModalTitle = data.ModalTitle;
  }

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      cirpath : new UntypedFormControl("", [Validators.required]),
      theme : new UntypedFormControl("", [Validators.required]),
      question : new UntypedFormControl("", [Validators.required]),
      target : new UntypedFormControl("", [Validators.required]),
      check : new UntypedFormControl(false),
      classrooms: new UntypedFormControl([]),
      freq : new UntypedFormControl("", [Validators.required]),
      unit : new UntypedFormControl("", [Validators.required]),
      iteracoes : new UntypedFormControl("", [Validators.required])
    })
  }

  /* Shorthands for form controls (used from within template) */
  get question() { return this.form.get('question'); }
  get target() { return this.form.get('target'); }
  get freq() { return this.form.get('freq'); }
  get iteracoes() { return this.form.get('iteracoes'); }

  /*  Submit form action
      Sends all data to the rest in a FormData object
  */
  submit() {
    const formData = new FormData();
    formData.append('cirpath', this.form.get('cirpath')?.value);
    formData.append('question', this.form.get('question')?.value);
    formData.append('theme', this.form.get('theme')?.value);
    formData.append('target', this.form.get('target')?.value);
    formData.append('freq', this.form.get('freq')?.value);
    formData.append('unit', this.form.get('unit')?.value);
    formData.append('public', this.form.get('check')?.value);
    formData.append('visible', this.form.get('check')?.value == false ? this.form.get('classrooms')?.value : []);
    formData.append('iteracoes', this.form.get('iteracoes')?.value);

    this._service.addExerciseSolver(formData).subscribe((data: any) => {
      if(data.v == true) {
        var img = this.uploadPhoto();
        var num_added_exs : number = 0;
        data.m.ids.forEach((element : any) => {
          if(img != null) {  
            this._service.uploadExercisePhoto(img, Number(element)).subscribe((data: any) => {
              if (data.v == true) {
                num_added_exs++;
              }
            });
          }
          
        });
        
        this._snackBar.open(num_added_exs + ' exercises added!', 'Fechar', { "duration": 2500 });
      }
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

  /* Upload the exercise's photo */
  uploadPhoto() {
    if (this.croppedImage != "") {
      var photo;

      if (this.imageChangedEvent == "") {
        return null;
      } else {
        photo = this.imageChangedEvent.target.files[0].name;
      }

      var arr: string[] = photo.split('.');
      var ext: string = arr[arr.length - 1];
      var name: string = photo;

      const file = new File([this.convertDataUrlToBlob(this.croppedImage)], name, {type: 'image/' + ext});
      
      const formData: FormData = new FormData();
      formData.append('img', file, file.name);

      return formData;
    }

    return null;
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
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
      this.form.get('cirpath')?.setValue(file);
    }
  }

  imageChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }
}
