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
  game_over : boolean = false;
  toggle : boolean = false;
  n_players : number = 0;
  n_ready : number = 0;
  ready_value : number = 0;
  show_question : boolean = false;
  pready : boolean = false;

  ngOnInit(): void {
    this.socket.emit("client_get_question", this.room_id);
    this.service.getExercises().subscribe((data: any) => {
      data.forEach((ex: exercise) => {
        this.all_exercises.push(ex);
      });
    });

    this.socket.emit("client_get_totalPlayers", this.room_id);
    this.socket.emit("client_get_players_ready", this.room_id);
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
      console.log(this.answer);
      console.log(this.res);
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
      this.show_question=true;
      this.started = state;
      this.counter = counter;
    });

    this.socket.on("game_over", () => {
      this.show_answer = false;
      //fazer um play again**
      this.show_question = false;
      this.game_over = true;
    });

    this.socket.on("players_ready", (n_ready:number) => {
      this.n_ready=n_ready;
      console.log(this.n_ready);
      this.ready_value = (this.n_ready / this.n_players) * 100;
    });
    
    this.socket.on("totalPlayers", (n_players:number) => {
      this.n_players = n_players ;
      this.ready_value = (this.n_ready / this.n_players) * 100;
    });
  }

  // startGame() {
  //   this.socket.emit("start_game", this.room_id);
  // }

  shuffleArray(array : string[]) {
    for(var i = array.length-1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i+1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
  }
  getOption(option : string) {
    this.res = option;
    this.toggle = !this.toggle;
    //this.socket.emit("client_get_result", this.room_id, this.res);
  }
  playerReady() {
    //this.ready_value = (this.n_ready / this.n_players) * 100;
    this.socket.emit("playerReady", this.room_id,this.ready_value);
    this.pready = true;
  }

  playerNotReady() {
    this.socket.emit("playerNotReady", this.room_id);
    this.pready = false;
  }
}
