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
    this.rooms = ["None", "Room1", "Room2", "Room3"];
   
  }

  ngOnChanges() {
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
    
  }

  ngOnDestroy() {
    this.socket.disconnect();
  }

  changeRoom(room_id:any) {    
    if(room_id == "None") {
      this.room_flag = false;
      this.selected_room = "";
    } else {
      this.selected_room = room_id;
      this.room_flag = true;
    }
    this.socket.emit("change_room", room_id);
  }
}
