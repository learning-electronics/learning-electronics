import { Component, OnInit, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
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
  form: FormGroup = new FormGroup({
    msg: new FormControl(''),
  });

  constructor() { }

  // state : any;
  //msg: string = "";
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
    console.log(this.form.get('msg')?.value);
    this.socket.emit("send_message", this.form.get('msg')?.value, this.room_id);
    this.form.reset();
  }
}
