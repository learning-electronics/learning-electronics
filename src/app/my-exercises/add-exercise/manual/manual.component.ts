import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { SharedService, theme, classroom } from 'src/app/shared.service';
import { AddExerciseComponent } from '../add-exercise.component';

@Component({
  selector: 'app-manual',
  templateUrl: './manual.component.html',
  styleUrls: ['./manual.component.scss']
})
export class ManualComponent implements OnInit {
  form!: UntypedFormGroup;
  ModalTitle: string;
  imageChangedEvent: any = '';
  croppedImage: any = '';
  themes: theme[] = [];
  units: string[] = [];
  classrooms: classroom[] = [];

  constructor(
    private _formBuilder: UntypedFormBuilder, 
    @Inject(MAT_DIALOG_DATA) public data: any, 
    private _service: SharedService,
    private _snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<AddExerciseComponent>,
    private _router: Router
    ) {
    this.ModalTitle = data.ModalTitle;
    this.themes = data.themes;
    this.units = data.units;
    this.classrooms = data.classrooms;
  }

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      question: new UntypedFormControl("", [Validators.required]),
      answers: new UntypedFormControl("", [Validators.required]),
      theme: new UntypedFormControl("", [Validators.required]),
      unit: new UntypedFormControl("", [Validators.required]),
      check: new UntypedFormControl(false),
      classrooms: new UntypedFormControl([]),
      resolution: new UntypedFormControl("")
    }, {validator: answerValidator});
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
        public: this.form.get('check')?.value,
        visible: this.form.get('check')?.value == false ? this.form.get('classrooms')?.value : [],
        img: null
      }

      this._service.addExercise(exercise).subscribe((data: any) => {
        if (data.v == true) {
          var img = this.uploadPhoto();

          if (img != null) {
            this._service.uploadExercisePhoto(img, Number(data.m)).subscribe((data: any) => {
              if (data.v == true) {
                /* Close the dialog */
                this.dialogRef.close();

                /* Reload the my_exercises component */
                let currentUrl = this._router.url;
                this._router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
                    this._router.navigate([currentUrl]);
                });
                
                this._snackBar.open('Exercício adicionado!', 'Fechar', { "duration": 2500 });
              }
            });
          }

          /* Close the dialog */
          this.dialogRef.close();

          /* Reload the my_exercises component */
          let currentUrl = this._router.url;
          this._router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
              this._router.navigate([currentUrl]);
          });
          
          this._snackBar.open('Exercício adicionado!', 'Fechar', { "duration": 2500 });
        }
      });  
    }
  }

  /* Upload the user's photo */
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
}

export const answerValidator: ValidatorFn = (formGroup: AbstractControl ): ValidationErrors | null  => {
  var answers = formGroup.get('answers')?.value.split(";");
  answers = answers.map((element: string) => {
    return element.trim();
  });

  /* Answers not valid if it doesn't have 4 answers separated by a ; */
  if (answers.length === 4) {
    for (let answer of answers) {
      if (answer.length === 0) {
        return { answerWrong: true };
      }
    }
    
    /* Check if all the answers are different */
    if ((new Set(answers)).size !== answers.length) {
      return { answerWrong: true };
    }

    return null;
  } else {
    return { answerWrong: true };
  }
}
