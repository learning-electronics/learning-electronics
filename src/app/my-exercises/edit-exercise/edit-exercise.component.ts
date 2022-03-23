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
  }

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      question: new FormControl( {value: this.data.exercise.question, disabled: this.disabled }, [Validators.required]),
      answers: new FormControl(
        { 
          value: this.data.exercise.ans1 + ";" + this.data.exercise.ans2 + ";" + this.data.exercise.ans3 + ";" + this.data.exercise.correct,
          disabled: this.disabled 
        },
        [Validators.required]
      ),
      theme: new FormControl({ value: this.data.exercise.theme, disabled: this.disabled }, [Validators.required]),
      unit: new FormControl({ value: this.data.exercise.unit, disabled: this.disabled }, [Validators.required]),
      resolution: new FormControl({ value: this.data.exercise.resol, disabled: this.disabled }),
      image: new FormControl(""),   
    }, {validator: answerValidator});

    if (this.data.exercise.img == null) {
      this.imgPath = "";
    } else {
      this.imgPath = this.DJANGO_SERVER + "/../.." + this.data.exercise.img;
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

  /* */
  submit() {

  }

  /* Set's the exercise info in the correct form controls */
  setExInfo() {
    this.form.controls['question'].setValue(this.data.exercise.question);
    this.form.controls['answers'].setValue(this.data.exercise.ans1 + ";" + this.data.exercise.ans2 + ";" + this.data.exercise.ans3 + ";" + this.data.exercise.correct);
    this.form.controls['theme'].setValue(this.data.exercise.theme),
    this.form.controls['unit'].setValue(this.data.exercise.unit);
    this.form.controls['resolution'].setValue(this.data.exercise.resol);
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
      this.form.controls['resolution'].disable();

      /* Set the default information about the exercise */
      this.setExInfo();
    } else {
      /* Enable the form edit state */
      this.form.controls['question'].enable();
      this.form.controls['answers'].enable();
      this.form.controls['theme'].enable();
      this.form.controls['unit'].enable();
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
