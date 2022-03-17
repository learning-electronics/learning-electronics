import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-show-game',
  templateUrl: './show-game.component.html',
  styleUrls: ['./show-game.component.scss']
})
export class ShowGameComponent implements OnInit {

  constructor() { }

  @Input() room_id! : string;
  @Input() socket : any;

  question : string = "";
  options : string[] = [];
  answer : string = "";
  res : string = "";
  show_answer : boolean = false;
  correct_answer : boolean = false;
  counter : number = 0;

  ngOnInit(): void {
    this.socket.emit("client_get_question", this.room_id);
  }

  ngAfterViewInit() {
    this.socket.on("server_get_question", (data : any) => {
      this.question = data['question'];
      this.options = data['options'];
      this.answer = data['answer'];
    });
    
    this.socket.on("question_change_room", (data : any) => {
      this.question = data['question'];
      this.options = data['options'];
      this.answer = data['answer'];
    });
    
    this.socket.on("server_get_question", (data : any) => {
      this.question = data['question'];
      this.options = data['options'];
      this.answer = data['answer'];
    });

    this.socket.on("show_result", () => {
      this.show_answer = !this.show_answer;
      if(this.res == this.answer) {
        this.correct_answer = true;
      } else {
        this.correct_answer = false;
      }
    });

    this.socket.on("counter", (counter : number) => {
      this.counter = counter;
    });
  }

}
