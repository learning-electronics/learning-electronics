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

  constructor(private _location: Location) { }

  // state : any;
  msg! : string;
  chat! : chat_data[];

  @Input() socket_id!: string;
  @Input() socket: any;
  @Input() room_id!: string;

  ngOnInit(): void {
  }
  
  ngAfterViewInit() {
    //receives the chat data from the server
    this.socket.on("chat", (data : any) => {
      console.log(data);
      this.chat = data;
      console.log(this.chat);
    });
  }

  // send message to the server
  sendMessage() {
    console.log(this.room_id);
    this.socket.emit("send_message", this.msg, this.room_id);
  }

}
