import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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
  form! : FormGroup;
  fileChangedEvent : any = "";
  imageChangedEvent: any = '';
  croppedImage: any = '';
  themes: theme[] = [];
  units: string[] = [];
  classrooms: classroom[] = [];
  ModalTitle: string;
  
  constructor(
    private _formBuilder: FormBuilder,
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
      cirpath : new FormControl("", [Validators.required]),
      theme : new FormControl("", [Validators.required]),
      question : new FormControl("", [Validators.required]),
      target : new FormControl("", [Validators.required]),
      check : new FormControl(false),
      classrooms: new FormControl([]),
      freq : new FormControl("", [Validators.required]),
      unit : new FormControl("", [Validators.required])
    })
  }

  /* Shorthands for form controls (used from within template) */
  get question() { return this.form.get('question'); }
  get target() { return this.form.get('target'); }
  get freq() { return this.form.get('freq'); }

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
    console.log(this.form.get('check')?.value == false ? this.form.get('classrooms')?.value : []);

    this._service.addExerciseSolver(formData).subscribe((data: any) => { 
      if(data.v == true) {
        var img = this.uploadPhoto();
      
        if(img != null) {  
          this._service.uploadExercisePhoto(img, Number(data.m)).subscribe((data: any) => {
            if (data.v == true) {
              // /* Close the dialog */
              // this.dialogRef.close();
              
              // /* Reload the my_exercises component */
              // let currentUrl = this._router.url;
              // this._router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
              //   this._router.navigate([currentUrl]);
              // });
              
              this._snackBar.open('Foto adicionada!', 'Fechar', { "duration": 2500 });
            }
          });
        }
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
