import { ThisReceiver } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators,  ValidationErrors, ValidatorFn, AbstractControl, UntypedFormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { exercise, SharedService, theme } from '../shared.service';


@Component({
  selector: 'app-quizz',
  templateUrl: './quizz.component.html',
  styleUrls: ['./quizz.component.scss']
})
export class QuizzComponent implements OnInit {

  createTestForm!: UntypedFormGroup;
  all_themes: theme [] = [];
  all_exs: any[] = [];
  possible_exs: exercise[] = [];
  points: any[] = [{name: 'Nada', value: 0}, {name: '25%', value: 0.25}, {name: '33%', value: 1/3}, {name: '50%', value: 0.5}];


  constructor(private _snackBar: MatSnackBar,private _formBuilder: UntypedFormBuilder,private _service: SharedService, private _router: Router) {
    this._service.getThemes().subscribe((data: any) => {
      this.all_themes = data as theme[];
      this._service.getExercises().subscribe((data: any) => {
        this.all_exs = data as exercise[];
      });
    });  
  }

  ngOnInit(): void {
    this.createTestForm = this._formBuilder.group({
      nQuestions: new UntypedFormControl('', [Validators.required, Validators.min(1),Validators.max(30), Validators.pattern('^[0-9]*$')]),
      themes: new UntypedFormControl('', [Validators.required]),
      duration: new UntypedFormControl('', [Validators.required,Validators.min(1),Validators.max(60), Validators.pattern('^[0-9]*$')]),
      deduct: new UntypedFormControl('', [Validators.required]),    
    });
    
   
  }

  submit() {
    console.log(this.createTestForm.value);
    if (this.createTestForm.valid) {
      this.createTestForm.controls['themes'].value.forEach((theme_id: number)  => {
        this.filterExs(theme_id).forEach((e: any) => {
          this.possible_exs.push(e); 
        });
      });
      console.log(this.possible_exs);
      var exam_data: any = { 
        nquestions: this.createTestForm.controls['nQuestions'].value, 
        themes: this.createTestForm.controls['themes'].value, 
        duration: this.createTestForm.controls['duration'].value, 
        deduct: this.createTestForm.controls['deduct'].value,
        exs: this.possible_exs
      };
      /* Redirect to home */
      this._service.openExam(exam_data);
      this._router.navigate(['/show-quizz']);
    }
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
