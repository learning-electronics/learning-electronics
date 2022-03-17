import { Component, OnInit, Input } from '@angular/core';
import { SharedService, exercise } from 'src/app/shared.service';

@Component({
  selector: 'app-show-game',
  templateUrl: './show-game.component.html',
  styleUrls: ['./show-game.component.scss']
})
export class ShowGameComponent implements OnInit {

  constructor(private service : SharedService) { }

  @Input() room_id! : string;
  @Input() socket : any;

  question : string = "";
  options : string[] = [];
  answer : string = "";
  res : string = "";
  show_answer : boolean = false;
  correct_answer : boolean = false;
  counter : number = 0;
  all_exercises : exercise[] = [];
  started : boolean = false;

  ngOnInit(): void {
    this.socket.emit("client_get_question", this.room_id);
    this.service.getExercises().subscribe((data: any) => {
      data.forEach((ex: exercise) => {
        this.all_exercises.push(ex);
      });
    });
    console.log(this.all_exercises);
  }

  ngAfterViewInit() {
    this.socket.on("server_get_question", (data : any) => {
      if(data != null) {
        this.question = data['question'];
        this.options = data['options'];
        this.answer = data['answer'];
      }
    });
    
    this.socket.on("question_change_room", (data : any) => {
      if(data != null) {
        this.question = data['question'];
        this.options = data['options'];
        this.answer = data['answer'];
      }
    });
    
    this.socket.on("server_get_question", (data : any) => {
      if(data != null) {
        this.question = data['question'];
        this.options = data['options'];
        this.answer = data['answer'];
      }
    });

    this.socket.on("show_result", (flag : boolean) => {
      this.show_answer = flag;
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

  startGame() {
    this.started = true;
    this.socket.emit("start_game", this.room_id);
  }

}
