import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { SharedService } from 'src/app/shared.service';
import { HostListener } from '@angular/core';
import { ComponentCanDeactivate } from 'src/app/pending-changes.guard';    

@Component({
  selector: 'app-show-quiz',
  templateUrl: './show-quiz.component.html',
  styleUrls: ['./show-quiz.component.scss']
})
export class ShowQuizComponent implements OnInit, ComponentCanDeactivate {
  subscription: Subscription = new Subscription();
  data: any;
  time_str: string;
  counter: number = 0;
  studentAnswer: Map<number, string> = new Map<number, string>();
  exsOptions: Map <number, string[]> = new Map <number, string[]>();;
  grade: number = 0;

  currentQuestion: any;
  currentQuestionId: number;
  selectedValue: any;
  end: boolean = false;
  interval: any;

  constructor(private _service: SharedService, private _router: Router, private _snackBar: MatSnackBar) {
    this.subscription = this._service.examStatus.subscribe((data: any) => {
      this.data = data;
      
      //Check if test was automatically generated or made by a teacher and retrieve the data
      if (data.class != undefined && data.exam != undefined) {
        this.counter = data.timer;
        this.data.duration = data.timer;
        this.getRandomExs(data.nquestions);
        if (this.counter == null) {
          this.counter = 10;
        }
        
        this.counter = this.counter*60; 
      } else if (data.answers != undefined) {
        // this.exs = data.
        this.counter = this.counter*60; 
      } else {
        this.counter = data.duration;
        this.getRandomExs(data.nquestions);
      }
    });
  }

  ngOnInit(): void {
    this.currentQuestionId =- 1;
    this.getNextQuestion();
    this.startTimer();

    window.onbeforeunload = () => this.ngOnDestroy();
  }

  //@HostListener allows us to also guard against browser refresh, close, etc.
  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    // insert logic to check if there are pending changes here;
    // returning true will navigate without confirmation
    // returning false will show a confirm dialog before navigating away
    return false;
  }

  //Stop timer when the component is destroyed
  ngOnDestroy(): void {
    clearInterval(this.interval);
  }

  //Shuffle array and return it
  shuffleArray(array : string[]) {
    for(var i = array.length-1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i+1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }

    return array;
  }

  //If exam is auto generated get random questions from the pool
  getRandomExs(ntimes: number) {
    let exs: any = [];

    for (let i = 0; i < ntimes; i++) {
      let randomIndex = Math.floor(Math.random() * this.data.exercises.length);
      
      //Check if the question is already selected
      if (!exs.includes(this.data.exercises[randomIndex])) {
        exs.push(this.data.exercises[randomIndex]);
        var shuffledOptions = this.shuffleArray([this.data.exercises[randomIndex].ans1, this.data.exercises[randomIndex].ans2, this.data.exercises[randomIndex].ans3, this.data.exercises[randomIndex].correct]);
        this.exsOptions.set(this.data.exercises[randomIndex].id, shuffledOptions);
      } else {
        i--;
      }
    }
  }

  //Change the selected answer and save it in the map
  chooseOption(event: Event, id: number, el: any) {
    event.preventDefault();

    if (this.studentAnswer.get(id) === el.value) {
      el.checked = false;
      this.studentAnswer.delete(id);
      this.selectedValue = '';
    } else {
      el.checked = true;
      this.studentAnswer.set(id, el.value);
      this.selectedValue = el.value;
    }
  }

  //Check if the answers are correct
  checkAnswers() {
    this.grade = 0;
    var questionValue = 20 / this.data.nquestions;

    // Calculate the grade
    for (let key of this.studentAnswer.keys()) {
      if (this.data.exercises.find((x: any) => x.id == key).correct == this.studentAnswer.get(key))
        this.grade += questionValue;
      else if ( this.studentAnswer.get(key) == undefined )
        this.studentAnswer.set(key, "Não respondeu");
      else 
        this.grade -= (this.data.deduct * questionValue);
    }
    
    //Display grade with only 2 decimal places
    this.grade = Math.round(this.grade*100)/100;
    
    // Stop the exam
    if (this.data.exam == undefined && this.data.class == undefined) {
      this.end = true;
      this.pauseTimer();
      this.currentQuestionId = -1;
      this.getNextQuestion();
    } else {
      // Submit the Exam
      var submit: any = {'final_mark': this.grade < 0 ? 0 : this.grade, 'answers': {}};
      for (let i = 0; i < this.data.exercises.length; i++) {
        submit.answers[(this.data.exercises[i].id).toString()] = this.studentAnswer.get(this.data.exercises[i].id);
      }

      this._service.submitExam(this.data.class, this.data.exam, submit).subscribe((data: any) => {
        if (data.v) {
          this.end = true;
          this.pauseTimer();
          this.currentQuestionId = -1;
          this.getNextQuestion();

          this._snackBar.open("Exame finalizado!", "Fechar", { "duration": 2500 });
        } else {
          this._snackBar.open("Erro ao finalizar exame!", "Fechar", { "duration": 2500 });
        }
      });
    } 
  }
    
  //go home
  goHome() {
    this._router.navigate(['/home']);
  }

  //get 1 question from exs list and remove it from the list
  getNextQuestion(){
    this.currentQuestionId++;
    this.currentQuestion = this.data.exercises.find((x: any) => x.id == Array.from(this.exsOptions.keys())[this.currentQuestionId]);
  }

  //get previous question
  getPreviousQuestion() {
    this.currentQuestionId--;
    this.currentQuestion = this.data.exercises.find((x: any) => x.id == Array.from(this.exsOptions.keys())[this.currentQuestionId]);
  }

  startTimer() {
    this.interval = setInterval(() => {
      if (this.counter > 0) {
        this.counter--;
        this.time_str = (Math.floor(this.counter/60) == 0 ? "" : Math.floor(this.counter/60) + "m ") + this.counter%60 + "s"
      } else {
        this.pauseTimer();
        this.checkAnswers();
      }
    },1000);
    
    if (this.counter == 0) {
      this.pauseTimer();
      this.checkAnswers();
    }
  }

  pauseTimer() {
    clearInterval(this.interval);
  }
}
