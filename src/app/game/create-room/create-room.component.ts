import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from '../game.component';

@Component({
  selector: 'app-create-room',
  templateUrl: './create-room.component.html',
  styleUrls: ['./create-room.component.scss']
})
export class CreateRoomComponent implements OnInit {
  minutes: number;
  seconds: number;
  form!: UntypedFormGroup;
  
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData, private _formBuilder: UntypedFormBuilder, private dialogRef: MatDialogRef<CreateRoomComponent>) { }

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      roomInput: new UntypedFormControl("", [Validators.required]),
      questions: new UntypedFormControl("", [Validators.required])
    }, {validator: [roomValidator(this.data), numQuestionsValidator]}); 
  }

  /* Shorthands for form controls (used from within template) */
  get room() { return this.form.get('roomInput'); }
  get numQuestions() { return this.form.get('questions'); }

  /* Update validation when the room input changes */
  onRoomInput() {
    if (this.form.hasError('nameWrong'))
      this.room?.setErrors([{'nameWrong': true}]);
    else
      this.room?.setErrors(null);
  }

  /* Update validation when the questgions input changes */
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

  // sends dialog data to game component(name of the room to be created)
  sendNewRoomData() {
    console.log(this.minutes, this.seconds);
    /* if (this.form.valid) {
      this.dialogRef.close({name: this.form.get('roomInput')?.value, numExercises: this.form.get('numExercises')?.value});
    } */
  }
}

export const roomValidator = (data: DialogData): ValidatorFn => {
  return (formGroup: AbstractControl ): ValidationErrors | null  => {
    /* Check if the room name already exists */
    var roomName: string = formGroup.get('roomInput')?.value;

    if (data.rooms.includes(roomName)) {
      return { nameWrong: true };
    }

    return null;
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
