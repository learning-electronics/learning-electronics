import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService, person } from '../shared.service';
import io from "socket.io-client";

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

  constructor(private router : Router,private _service: SharedService) {
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
    this.socket.on("connections", (connections : any) => {
      this.connections = connections;
      console.log(connections);
 
    });

    this.socket.on("socket_id", (id : any) => {
      this.socket_id = id;
      this.socket.emit("nname",this.user_info?.first_name);
    });

    this.socket.on("loadRooms", (rooms : string[]) => {
      console.log("LOAD ROOMS");
      this.rooms = rooms;
      console.log(rooms);
    });
    
  }

  ngOnDestroy() {
    this.socket.disconnect();
  }

  createRoom(){

    // this.rooms.push("Room"+this.rooms.length);
    this.socket.emit("createRoom",this.rooms[this.rooms.length-1])
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
