import { Component, OnInit, Input } from '@angular/core';
// import { Location } from '@angular/common';

export interface chat_data {
  src : string,
  data : string
}

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit {

  constructor() { }

  // state : any;
  msg: string = "";
  chat!: chat_data[];

  @Input() socket_id!: string;
  @Input() socket: any;
  @Input() room_id!: string;

  ngOnInit(): void {
    
  }
  
  ngAfterViewInit() {
    //receives the chat data from the server
    this.socket.on("chat", (data : any) => {
      this.chat = data;
    });
  }

  // send message to the server
  sendMessage() {
    this.socket.emit("send_message", this.msg, this.room_id);
  }
}
