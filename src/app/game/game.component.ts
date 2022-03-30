import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService, person } from '../shared.service';
import io from "socket.io-client";
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CreateRoomComponent } from './create-room/create-room.component';

export interface DialogData {
  rooms: any;
  name: "";
  numExercises: number; 
}

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})

export class GameComponent implements OnInit {

  user_info!: person;
  socket: any;
  connections: string[] = [];
  rooms: string[] = [];
  selected_room: string = "";
  room_flag: boolean = false;
  socket_id: string = "";
  newRoomName: string = "";
  owner : string = "None";

  constructor(private router : Router,private _service: SharedService, public dialog: MatDialog) {
    this._service.getAccount().subscribe((data: any) => {
      if (data.v == true) {
        this.user_info = data.info as person;
      }
    });
  }
  
  

  ngOnInit(): void {
    this.socket = io("http://localhost:3000");
    this.rooms = ["None"];
  }

  ngAfterViewInit() {
    // receives the current list of sockets that are connected to the server
    this.socket.on("connections", (connections : any) => {
      this.connections = connections;
    });

    // associates the socket id to the username of the client
    this.socket.on("socket_id", (id : any) => {
      this.socket_id = id;
      this.socket.emit("nname",this.user_info?.first_name);
    });

    // receives the current list of rooms from the server
    this.socket.on("loadRooms", (rooms : string[]) => {
      this.rooms = rooms;
      console.log(this.rooms);
      
    });
    
  }

  ngOnDestroy() {
    this.socket.disconnect();
  }

  // when creating a room it opens a dialog to insert the values of the new room
  createRoom() {
    const dialogRef = this.dialog.open(CreateRoomComponent, {
      data: {
        rooms: this.rooms
      },
    });
    
    dialogRef.afterClosed().subscribe(result => {
      
      if(result != null) {
        this.socket.emit("createRoom", this.socket_id, result);
      }
    });
    //snackbar a dizer se criou com sucesso
  }
  
  changeRoom(room_id:any) {    
    if(room_id == "None") {
      this.room_flag = false;
      this.selected_room = "";
    } else {
      this.room_flag = true;
      this.selected_room = room_id;
    }
    this.socket.emit("change_room", this.selected_room);
  }
}
