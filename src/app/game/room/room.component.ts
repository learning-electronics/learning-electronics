import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
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
  form: UntypedFormGroup = new UntypedFormGroup({
    msg: new UntypedFormControl(''),
  });
  @ViewChild('chat_box') chat_box:ElementRef;
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
  ngAfterViewChecked() {
    //scrolls to the bottom of the chat
    this.chat_box.nativeElement.scrollTop = this.chat_box.nativeElement.scrollHeight;
}
  // send message to the server
  sendMessage() {
    this.socket.emit("send_message", this.form.get('msg')?.value, this.room_id);
    this.form.reset();
  }
}
