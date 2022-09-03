import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';

export interface chat_data {
  src : string,
  data : string
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  @ViewChild('chat_box') chat_box:ElementRef;
  @Input() socket_id!: string;
  @Input() socket: any;
  @Input() room_id!: string;

  chat!: chat_data[];
  form: UntypedFormGroup = new UntypedFormGroup({
    msg: new UntypedFormControl(''),
  });

  constructor() { }

  ngOnInit(): void { 
  }
  
  ngAfterViewInit() {
    // Receives the chat data from the server
    this.socket.on("chat", (data : any) => {
      this.chat = data;
    });
  }

  ngAfterViewChecked() {
    //Scrolls to the bottom of the chat
    this.chat_box.nativeElement.scrollTop = this.chat_box.nativeElement.scrollHeight;
  }

  //Send message to the server
  sendMessage() {
    this.socket.emit("send_message", this.form.get('msg')?.value, this.room_id);
    this.form.reset();
  }
}
