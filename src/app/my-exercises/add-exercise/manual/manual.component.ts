import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { SharedService, theme } from 'src/app/shared.service';

@Component({
  selector: 'app-manual',
  templateUrl: './manual.component.html',
  styleUrls: ['./manual.component.scss']
})
export class ManualComponent implements OnInit {
  form!: FormGroup;
  ModalTitle: string;
  imageChangedEvent: any = '';
  croppedImage: any = '';
  themes: theme[] = [];
  units: string[] = [];

  constructor(private _formBuilder: FormBuilder, @Inject(MAT_DIALOG_DATA) public data: any, private _service: SharedService) {
    this.ModalTitle = data.ModalTitle;
    this.themes = data.themes;
    this.units = data.units;
  }

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      question: new FormControl("", [Validators.required]),
      answers: new FormControl("", [Validators.required]),
      theme: new FormControl("", [Validators.required]),
      unit: new FormControl("", [Validators.required]),
      resolution: new FormControl(""),
      image: new FormControl(""),   
    }, {validator: answerValidator});
  }
  
  /* Shorthands for form controls (used from within template) */
  get question() { return this.form.get('question'); }
  get answer() { return this.form.get('answers'); }

  /* Update validation when the answer input changes */
  onAnswerInput() {
    if (this.form.hasError('answerWrong'))
      this.answer?.setErrors([{'answerWrong': true}]);
    else
      this.answer?.setErrors(null);
  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
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

  /* Submit form action */
  submit() {
    console.log('ola')
    if (this.form.valid) {
      var answers: string[] = this.form.get('answers')?.value.split(";");
    
      var exercise = {
        question: this.form.get('question')?.value,
        ans1: answers[0],
        ans2: answers[1],
        ans3: answers[2],
        correct: answers[3],
        unit: this.form.get('unit')?.value,
        theme: this.form.get('theme')?.value,
        resol: this.form.get('resolution')?.value,
        /* image: this.form.get('image')?.value, */
      }

      console.log(exercise)

      this._service.addExercise(exercise).subscribe((data: any) => {
        console.log(data);
      });

      /* var photo;
      if (this.imageChangedEvent == "") {
        photo = "";     
      } else {
        photo = this.imageChangedEvent.target.files[0].name;

        var arr: string[] = photo.split('.');
        var ext: string = arr[arr.length - 1];
        var name: string = photo;
        const file = new File([this.convertDataUrlToBlob(this.croppedImage)], name, {type: 'image/' + ext});
        const formData: FormData = new FormData();

        formData.append('img', file, file.name);
      }  

      console.log(exercise); */
    }
  }
}

export const answerValidator: ValidatorFn = (formGroup: AbstractControl ): ValidationErrors | null  => {
  var answers = formGroup.get('answers')?.value.split(";");

  /* Answers not valid if it doesn't have 4 answers separated by a ; */
  if (answers.length === 4) {
    for (let answer of answers) {
      if (answer.length === 0) {
        return {answerWrong: true};
      }
    }
    
    return null;
  } else {
    return {answerWrong: true};
  }
}
