import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from '../game.component';

@Component({
  selector: 'app-create-room',
  templateUrl: './create-room.component.html',
  styleUrls: ['./create-room.component.scss']
})
export class CreateRoomComponent implements OnInit {
  form!: FormGroup;
  
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData, private _formBuilder: FormBuilder, private dialogRef: MatDialogRef<CreateRoomComponent>) { }

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      roomInput: new FormControl("", [Validators.required]),
    }, {validator: roomValidator(this.data)}); 
  }

  /* Shorthands for form controls (used from within template) */
  get room() { return this.form.get('roomInput'); }

  /* Update validation when the room input changes */
  onRoomInput() {
    if (this.form.hasError('nameWrong'))
      this.room?.setErrors([{'nameWrong': true}]);
    else
      this.room?.setErrors(null);
  }

  // sends dialog data to game component(name of the room to be created)
  sendNewRoomData() {
    if (this.form.valid) {
      this.dialogRef.close({name: this.form.get('roomInput')?.value});
    }
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