import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-edit-exercise',
  templateUrl: './add-edit-exercise.component.html',
  styleUrls: ['./add-edit-exercise.component.scss']
})
export class AddEditExerciseComponent implements OnInit {
  form: FormGroup = new FormGroup({
    question: new FormControl("", [Validators.required]),
    answers: new FormControl("", [Validators.required]),
    theme: new FormControl("", [Validators.required]),
    resolution: new FormControl("", [Validators.required]),
    image: new FormControl("", [Validators.required]),
  });
  
  constructor() { }

  ngOnInit(): void {
  }

  /* Submit form action */
  submit() {
  }
}
