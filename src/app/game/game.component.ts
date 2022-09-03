import io from "socket.io-client";
import { Component, OnInit, ViewChild } from '@angular/core';
import { SharedService, person } from '../shared.service';
import { MatDialog } from '@angular/material/dialog';
import { CreateRoomComponent } from './create-room/create-room.component';
import { Router } from "@angular/router";
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatGridList } from "@angular/material/grid-list";

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
  rooms: {name: string, exercises: number, time: string, owner: string}[] = [];
  selected_room: string = "";
  last_room: string = "";
  socket_id: string = "";
  breakpoint: number = 5;
  cols: number;

  gridByBreakpoint: any = {
    xl: 6,
    lg: 5,
    md: 3,
    sm: 2,
    xs: 1
  }

  constructor(private _service: SharedService, public dialog: MatDialog, private _router: Router, private breakpointObserver: BreakpointObserver) {
    this._service.getAccount().subscribe((data: any) => {
      if (data.v == true) {
        this.user_info = data.info as person;
        
        this.socket = io("http://localhost:3000");

        // associates the socket id to the username of the client
        this.socket.on("socket_id", (id : any) => {
          this.socket_id = id;
          this.socket.emit("nname", this.user_info.first_name + " " + this.user_info.last_name);
        });

        // receives the current list of rooms from the server
        this.socket.on("loadRooms", (rooms :any) => {
          this.rooms = [];

          for (var info in rooms) {
            var total_time = rooms[info].time * rooms[info].numExercises;
            this.rooms.push({name: info, exercises: rooms[info].numExercises, time: Math.floor(total_time/60) + "m " + total_time%60 + "s", owner: rooms[info].owner});
          }
        });
      }
    });

    this.breakpointObserver.observe([Breakpoints.XSmall, Breakpoints.Small, Breakpoints.Medium, Breakpoints.Large, Breakpoints.XLarge]).subscribe(result => {
      if (result.matches) {
        if (result.breakpoints[Breakpoints.XSmall]) this.cols = this.gridByBreakpoint.xs;

        if (result.breakpoints[Breakpoints.Small]) this.cols = this.gridByBreakpoint.sm;

        if (result.breakpoints[Breakpoints.Medium]) this.cols = this.gridByBreakpoint.md;

        if (result.breakpoints[Breakpoints.Large]) this.cols = this.gridByBreakpoint.lg;
        
        if (result.breakpoints[Breakpoints.XLarge]) this.cols = this.gridByBreakpoint.xl;
      }
    });
  }
  
  ngOnInit(): void {
    if (window.innerWidth <= 820) {
      this.breakpoint = 1;
    } else if (window.innerWidth <= 1130) {
      this.breakpoint = 2;
    } else if (window.innerWidth <= 1460) {
      this.breakpoint = 3;
    } else if (window.innerWidth <= 1800) {
      this.breakpoint = 4;
    } else {
      this.breakpoint = 5;
    }
  }

  ngOnDestroy() {
    this.socket.disconnect();
  }

  // when creating a room it opens a dialog to insert the values of the new room
  createRoom() {
    const dialogRef = this.dialog.open(CreateRoomComponent, {
      data: { rooms: this.rooms }
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        this.socket.emit("createRoom", this.socket_id, result);
      }
    });
  }

  changeRoom(room: any) {
    this.last_room = this.selected_room;
    this.selected_room = room.name;

    this._service.openGame({room_id: this.selected_room, last_room: this.last_room, username: this.user_info.first_name + " " + this.user_info.last_name});
    this._router.navigate(['/game']);
  }
}
