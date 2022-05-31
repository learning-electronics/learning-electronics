import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators,  ValidationErrors, ValidatorFn, AbstractControl, FormBuilder } from '@angular/forms';
import { SharedService, theme } from '../shared.service';


@Component({
  selector: 'app-quizz',
  templateUrl: './quizz.component.html',
  styleUrls: ['./quizz.component.scss']
})
export class QuizzComponent implements OnInit {

  createTestForm!: FormGroup;
  all_themes: theme [] = [];
  points: any[] = [{name: 'Nada', value: 0}, {name: '25%', value: 0.25}, {name: '33%', value: 1/3}, {name: '50%', value: 0.5}];


  constructor(private _formBuilder: FormBuilder,private _service: SharedService) {
    this._service.getThemes().subscribe((data: any) => {
      this.all_themes = data as theme[];
    });

   }

  ngOnInit(): void {
    this.createTestForm = this._formBuilder.group({
      nQuestions: new FormControl('', [Validators.required]),
      themes: new FormControl('', [Validators.required]),
      duration: new FormControl('', [Validators.required]),
      deduct: new FormControl('', [Validators.required]),    
    }, {validator: numQuestionsValidator});

  
  }

  

  createTest() {
    console.log(this.createTestForm.value);
  }
}
export const numQuestionsValidator: ValidatorFn = (formGroup: AbstractControl ): ValidationErrors | null  => {
    var numQuestions = formGroup.get('questions')?.value;
  
    if (numQuestions <= 0 || numQuestions > 50) {
      return {'numQuestionsWrong': true};
    } else {
      return null;
    }
  }