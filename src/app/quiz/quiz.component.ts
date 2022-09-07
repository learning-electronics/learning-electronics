import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators,  ValidationErrors, ValidatorFn, AbstractControl, UntypedFormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { exercise, SharedService, theme } from '../shared.service';


@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss']
})
export class QuizComponent implements OnInit {
  form!: UntypedFormGroup;
  all_themes: theme [] = [];
  all_exs: any[] = [];
  possible_exs: exercise[] = [];
  points: any[] = [{name: 'Nada', value: 0}, {name: '25%', value: 0.25}, {name: '33%', value: 1/3}, {name: '50%', value: 0.5}];
  minutes: number = 30;
  seconds: number = 0;

  constructor(private _snackBar: MatSnackBar,private _formBuilder: UntypedFormBuilder,private _service: SharedService, private _router: Router) {
    this._service.getThemes().subscribe((data: any) => {
      this.all_themes = data as theme[];
      this._service.getExercises().subscribe((data: any) => {
        this.all_exs = data as exercise[];
      });
    });  
  }

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      questions: new UntypedFormControl('', [Validators.required]),
      themes: new UntypedFormControl('', [Validators.required]),
      deduct: new UntypedFormControl('', [Validators.required]),    
    }, {validator: numQuestionsValidator});
  }

  /* Shorthands for form controls (used from within template) */
  get numQuestions() { return this.form.get('questions'); }

  submit() {
    console.log(this.form.value);
    if (this.form.valid) {
      this.form.controls['themes'].value.forEach((theme_id: number)  => {
        this.filterExs(theme_id).forEach((e: any) => {
          this.possible_exs.push(e); 
        });
      });

      var exam_data: any = { 
        questions: this.form.controls['questions'].value, 
        themes: this.form.controls['themes'].value, 
        duration: (this.minutes*60 + this.seconds) * this.form.controls['questions'].value,
        deduct: this.form.controls['deduct'].value,
        exs: this.possible_exs
      };

      /* Redirect to home */
      this._service.openExam(exam_data);
      this._router.navigate(['/show-quiz']);
    }
  }

  /* Update validation when the questions input changes */
  onQuestionsInput() {
    if (this.form.hasError('numQuestionsWrong'))
      this.numQuestions?.setErrors([{'numQuestionsWrong': true}]);
    else
      this.numQuestions?.setErrors(null);
  }

  getTimerValue(resp: any) {
    this.minutes = resp.minutes;
    this.seconds = resp.seconds;
  }

  //filter exs by theme
  filterExs(theme_id: number) {
    return (this.all_exs.filter((ex: any) => ex.theme.includes(theme_id)));
  }
}

export const numQuestionsValidator: ValidatorFn = (formGroup: AbstractControl ): ValidationErrors | null  => {
  var numQuestions = formGroup.get('questions')?.value;

  if (numQuestions <= 0 || numQuestions > 50) {
    return {'numQuestionsWrong': true};
  } else {
    return null;
  }
};
