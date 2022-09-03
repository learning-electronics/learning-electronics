import { Component, OnInit, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { io } from 'socket.io-client';
import { SharedService, exercise } from 'src/app/shared.service';

interface Result {
  name: string;
  points: number;
}

const RESULTS_DATA : Result[] = [];

@Component({
  selector: 'app-show-game',
  templateUrl: './show-game.component.html',
  styleUrls: ['./show-game.component.scss']
})
export class ShowGameComponent implements OnInit {
  subscription: Subscription = new Subscription();
  room_id! : string;
  socket : any;
  socket_id! : string;
  last_room: string;
  username: string;

  constructor(private _service : SharedService) {
    this.subscription = this._service.gameOpened.subscribe((data: any) => {
      this.room_id = data.room_id;
      this.last_room = data.last_room;
      this.username = data.username;
    });
  }

  
  DJANGO_SERVER = 'http://localhost:8000';
  
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
  n_players : number = 0;
  n_ready : number = 0;
  ready_value : number = 0;
  show_question : boolean = false;
  pready : boolean = false;
  num_correct_answers : number = 0;

  selected_id! : string;

  game_results = {};
  game_users : string[] = [];

  displayedColumns: string[] = ['name', 'points'];
  dataSource = RESULTS_DATA;
  show_results_flag : boolean = false;

  ngOnInit(): void {
    this.socket = io("http://localhost:3000");

    // associates the socket id to the username of the client
    this.socket.on("socket_id", (id : any) => {
      this.socket_id = id;
      this.socket.emit("nname", this.username);
    });

    this.socket.emit("change_room", this.room_id, this.last_room);

    this.socket.emit("client_get_question", this.room_id);
    this._service.getExercises().subscribe((data: any) => {
      data.forEach((ex: exercise) => {
        this.all_exercises.push(ex);
      });
    });

    this.socket.emit("client_get_totalPlayers", this.room_id);
    this.socket.emit("client_get_players_ready", this.room_id);
  }

  ngOnDestroy() {
    this.socket.disconnect();
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
        this.num_correct_answers++;
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
      this.show_question = false;
      this.game_over = true;
      
      this.socket.emit("client_total_points", this.socket.id, this.room_id, this.num_correct_answers);
    });

    this.socket.on("players_ready", (n_ready:number) => {
      this.n_ready = n_ready;
      this.ready_value = (this.n_ready / this.n_players) * 100;
    });
    
    this.socket.on("totalPlayers", (n_players:number) => {
      this.n_players = n_players;
      this.ready_value = (this.n_ready / this.n_players) * 100;
    });

    this.socket.on("game_results", (points: any) => {
      this.game_results = points;
      this.game_users = Object.keys(points);

      for(let key in points) {
        RESULTS_DATA.push({name: key, points: points[key]});
      }

      RESULTS_DATA.sort((a,b) => (a.points < b.points) ? 1 : -1);
      this.show_results_flag = true;
    });

  }

  shuffleArray(array : string[]) {
    for (var i = array.length-1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i+1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
  }

  getOption(option : string) {
    if(this.res != option) {
      this.res = option;
    } else {
      this.res = "";
    }
  }

  playerReady() {
    this.socket.emit("playerReady", this.room_id,this.ready_value);
    this.pready = true;
  }

  playerNotReady() {
    this.socket.emit("playerNotReady", this.room_id);
    this.pready = false;
  }
}
