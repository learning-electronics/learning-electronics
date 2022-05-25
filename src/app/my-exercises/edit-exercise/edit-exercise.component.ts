import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { SharedService } from 'src/app/shared.service';

@Component({
  selector: 'app-edit-exercise',
  templateUrl: './edit-exercise.component.html',
  styleUrls: ['./edit-exercise.component.scss']
})
export class EditExerciseComponent implements OnInit {
  form!: FormGroup;
  imageChangedEvent: any = '';
  croppedImage: any = '';
  disabled: boolean = true;
  DJANGO_SERVER = 'http://127.0.0.1:8000';
  imgPath: string = "";
  
  constructor(
    private _formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any, 
    private _service: SharedService, 
    private _snackBar: MatSnackBar,
    private _router: Router,
    private dialogRef: MatDialogRef<EditExerciseComponent>
    ) {
    console.log(data);

    if (this.data.exercise.img == null) {
      this.imgPath = "";
    } else {
      this.imgPath = this.DJANGO_SERVER + "/../.." + this.data.exercise.img;
    }
  }

  ngOnInit(): void {
    var lst: any = [];
    
    if ('visible' in this.data.exercise && this.data.exercise.visible != undefined) {
      this.data.exercise.visible.forEach((c: any) => { lst.push(c.id) });
    } 

    this.form = this._formBuilder.group({
      question: new FormControl( {value: this.data.exercise.question, disabled: this.disabled }, [Validators.required]),
      answers: new FormControl(
        { 
          value: this.data.exercise.ans1 + ";" + this.data.exercise.ans2 + ";" + this.data.exercise.ans3 + ";" + this.data.exercise.correct,
          disabled: this.disabled 
        }
      ),
      classrooms: new FormControl({value: lst, disabled: this.disabled }),
      check: new FormControl({value: this.data.exercise.public, disabled: this.disabled }, [Validators.required]),
      theme: new FormControl({ value: this.data.exercise.theme, disabled: this.disabled }, [Validators.required]),
      unit: new FormControl({ value: this.data.exercise.unit, disabled: this.disabled }, [Validators.required]),
      resolution: new FormControl({ value: this.data.exercise.resol, disabled: this.disabled }),
      image: new FormControl(""),
    }, {validator: answerValidator}); 
  }

  /* Block Classrooms form field when "public" checkbox is chosen */
  blockClassrooms(val: boolean) {
    if (val) {
      this.form.controls['classrooms'].reset();
      this.form.controls['classrooms'].disable();
    } else {
      var lst: any = [];
      this.data.exercise.visible.forEach((c: any) => { lst.push(c.id)  });
      this.form.controls['classrooms'].setValue(lst);
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

  /* Delete the current exercise */
  deleteEx() {
    this._service.deleteExercise(this.data.exercise.id).subscribe((data: any) => {
      if (data.v) {
        this.dialogRef.close();

        /* Realod the Profile Component */
        let currentUrl = this._router.url;
        this._router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
            this._router.navigate([currentUrl]);
        });

        this._snackBar.open('Exercício Eliminado!', 'Fechar', { "duration": 2500 });
      } else {
        this._snackBar.open('Erro ao Eliminar Exercício!', 'Fechar', { "duration": 2500 });
      }
    });
  }

  /* Submit the updated exercise info */
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

      console.log(exercise);

      this._service.updateExercise(exercise, this.data.exercise.id).subscribe((data: any) => {
        if (data.v == true) {
          /* Close the dialog */
          this.dialogRef.close();

          /* Reload the my_exercises component */
          let currentUrl = this._router.url;
          this._router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
              this._router.navigate([currentUrl]);
          });
          
          this._snackBar.open('Exercício atualizado!', 'Fechar', { "duration": 2500 });
        } else {
          console.log(data);
        }
      });  
    }
  }

  /* Upload the user's photo */
  uploadPhoto() {
    if (this.croppedImage != "") {
      var photo;

      if (this.imageChangedEvent == "") {
        photo = this.data.exercise.img;
      } else {
        photo = this.imageChangedEvent.target.files[0].name;
      }

      var arr: string[] = photo.split('.');
      var ext: string = arr[arr.length - 1];
      var name: string = photo;

      const file = new File([this.convertDataUrlToBlob(this.croppedImage)], name, {type: 'image/' + ext});
      
      const formData: FormData = new FormData();
      formData.append('img', file, file.name);

      this._service.uploadExercisePhoto(formData, this.data.exercise.id).subscribe((data:any)=>{
        if (data.v) {
          /* Realod the MyExercises Component */
          let currentUrl = this._router.url;
          this._router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
              this._router.navigate([currentUrl]);
          });
          this.dialogRef.close();

          this._snackBar.open('Imagem Atualizada!', 'Fechar', { "duration": 2500 });
        } else {
          this._snackBar.open('Atualização de Imagem falhou!', 'Fechar', { "duration": 2500 });
        }
      });
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

  /* Set's the exercise info in the correct form controls */
  setExInfo() {
    this.form.controls['question'].setValue(this.data.exercise.question);
    this.form.controls['answers'].setValue(this.data.exercise.ans1 + ";" + this.data.exercise.ans2 + ";" + this.data.exercise.ans3 + ";" + this.data.exercise.correct);
    this.form.controls['theme'].setValue(this.data.exercise.theme),
    this.form.controls['unit'].setValue(this.data.exercise.unit);
    this.form.controls['resolution'].setValue(this.data.exercise.resol);

    var lst: any = [];
    this.data.exercise.visible.forEach((c: any) => { lst.push(c.id)  });
    this.form.controls['classrooms'].setValue(lst);
    this.form.controls['check'].setValue(this.data.exercise.public);
  }

  /* Control the form edit state */
  edit() {
    this.disabled = !this.disabled;
    if (this.disabled) {
      /* Disable the form controls */
      this.form.controls['question'].disable();
      this.form.controls['answers'].disable();
      this.form.controls['theme'].disable();
      this.form.controls['unit'].disable();
      this.form.controls['classrooms'].disable();
      this.form.controls['check'].disable();
      this.form.controls['resolution'].disable();

      /* Set the default information about the exercise */
      this.setExInfo();
    } else {
      /* Enable the form edit state */
      this.form.controls['question'].enable();
      this.form.controls['answers'].enable();
      this.form.controls['theme'].enable();
      this.form.controls['unit'].enable();
      if (this.form.get('check')?.value == false) this.form.controls['classrooms'].enable();
      this.form.controls['check'].enable();
      this.form.controls['resolution'].enable();
    }
  }
}

export const answerValidator: ValidatorFn = (formGroup: AbstractControl ): ValidationErrors | null  => {
  if (formGroup.get('answers')?.disabled) return null;

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
