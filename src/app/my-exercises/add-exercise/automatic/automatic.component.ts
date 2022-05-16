import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { SharedService } from 'src/app/shared.service';
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
  
  
  constructor(
    private _formBuilder: FormBuilder,
    private _service: SharedService,
    private _snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<AddExerciseComponent>,
    private _router: Router
  ) { }

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      cirpath : new FormControl(),
      theme : new FormControl(),
      question : new FormControl(),
      public : new FormControl(),
      target : new FormControl(),
      freq : new FormControl(),
      unit : new FormControl(),
      img : new FormControl()
    })
  }

  ngAfterViewInit() {
  }
  
  // submit form action
  submit() {

    const formData = new FormData();
    formData.append('cirpath', this.form.get('cirpath')?.value);
    
    // var exercise = {
    //   question: this.form.get('question')?.value,
    //   public: this.form.get('public')?.value,
    //   theme: this.form.get('theme')?.value,
    //   target: this.form.get('target')?.value,
    //   freq: this.form.get('freq')?.value,
    //   unit: this.form.get('unit')?.value
    // }

    formData.append('question', this.form.get('question')?.value);
    formData.append('theme', this.form.get('theme')?.value);
    formData.append('public', this.form.get('public')?.value);
    formData.append('target', this.form.get('target')?.value);
    formData.append('freq', this.form.get('freq')?.value);
    formData.append('unit', this.form.get('unit')?.value);
    
    this._service.addExerciseSolver(formData).subscribe((data: any) => {
      console.log(data);

      if(data.v == true) {
        var img = this.uploadPhoto();
        
        console.log(img?.get);
        if(img != null) {
          console.log("img nao é null");
          
          this._service.uploadExercisePhoto(img, Number(data.m)).subscribe((data: any) => {
              
            if (data.v == true) {
              /* Close the dialog */
              this.dialogRef.close();

              /* Reload the my_exercises component */
              let currentUrl = this._router.url;
              this._router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
                  this._router.navigate([currentUrl]);
              });
              
              this._snackBar.open('Foto adicionada!', 'Fechar', { "duration": 2500 });
            }
          });
        }

      }
      
    });

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
    console.log("upload");
    console.log(formData.get('img'));
    return formData;
  }

  return null;
}

  uploadFile() {
    if(this.fileChangedEvent != "") {
      var file_name = this.fileChangedEvent.target.files[0].name;

      var arr: string[] = file_name.split('.');
      var ext: string = arr[arr.length - 1];
      var name: string = file_name;
      
      const file = new File([this.convertDataUrlToBlob(file_name)], name, {type: 'file/' + ext});
      console.log(file);

      const formData: FormData = new FormData();
      formData.append('cirpath', file, file.name);

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
    // if(event.target.files.length > 0) {
    //   const img = event.target.files[0];
    //   this.form.get('img')?.setValue(img);
    // }
    this.imageChangedEvent = event;

  }

}
