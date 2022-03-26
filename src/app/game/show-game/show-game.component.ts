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
  @Input() socket_id! : string;
  @Input() owner! : string;

  DJANGO_SERVER = 'http://127.0.0.1:8000';
  
  question : string = "";
  options : string[] = [];
  answer : string = "";
  exercise_res : string = "";
  res : string = "";
  image_url : string = "";
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
        this.options = [];
        this.options.push(data['ans1']);
        this.options.push(data['ans2']);
        this.options.push(data['ans3']);
        this.options.push(data['correct']);
        this.shuffleArray(this.options); 
        this.answer = data['correct'];

        this.exercise_res = data['res'];
        
        if(data['img'] != null) {
          this.image_url = this.DJANGO_SERVER + data['img'];
        } else {
          this.image_url = "";
        }
        console.log(this.image_url);
      }
    });
    
    this.socket.on("question_change_room", (data : any) => {
      if(data != null) {
        this.question = data['question'];
        this.options = [];  
        this.options.push(data['ans1']);
        this.options.push(data['ans2']);
        this.options.push(data['ans3']);
        this.options.push(data['correct']);
        this.shuffleArray(this.options); 
        
        this.answer = data['correct'];
        
        this.exercise_res = data['res'];
        
        if(data['img'] != null) {
          this.image_url = this.DJANGO_SERVER + data['img'];
        } else {
          this.image_url = "";
        }
        console.log(this.image_url);
      }
    });
    
    this.socket.on("server_get_question", (data : any) => {
      if(data != null) {
        this.question = data['question'];
        this.options = [];    
        this.options.push(data['ans1']);
        this.options.push(data['ans2']);
        this.options.push(data['ans3']);
        this.options.push(data['correct']);
        this.shuffleArray(this.options); 
        
        this.answer = data['correct'];
        
        this.exercise_res = data['res'];
        
        if(data['img'] != null) {
          this.image_url = this.DJANGO_SERVER + data['img'];
        } else {
          this.image_url = "";
        }
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
    
    this.socket.on("game_started", (state : boolean, counter : number) => {
      this.started = state;
      this.counter = counter;
    });

  }

  startGame() {
    this.socket.emit("start_game", this.room_id);
  }

  shuffleArray(array : string[]) {
    for(var i = array.length-1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i+1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
  }

}
