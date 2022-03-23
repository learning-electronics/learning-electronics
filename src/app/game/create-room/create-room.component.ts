import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from '../game.component';

@Component({
  selector: 'app-create-room',
  templateUrl: './create-room.component.html',
  styleUrls: ['./create-room.component.scss']
})
export class CreateRoomComponent implements OnInit {
  
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData, private dialogRef: MatDialogRef<CreateRoomComponent>) { }

  value : string = "";

  ngOnInit(): void {
  }

  // sends dialog data to game component(name of the room to be created)
  sendNewRoomData() {
    this.dialogRef.close({name: this.data.name});
  }

}