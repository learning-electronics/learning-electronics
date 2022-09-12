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
  exsOptions: Map <number, string[]> = new Map <number, string[]>();
  grade: number = 0;
  end: boolean = false;
  interval: any;

  currentQuestion: any;
  currentQuestionId: number;

  constructor(private _service: SharedService, private _router: Router, private _snackBar: MatSnackBar) {
    this.subscription = this._service.examStatus.subscribe((data: any) => {
      this.data = data;
      console.log(data);

      //Submited exam
      if (data.exsOptions != undefined) {
        //this.exsOptions = data.exam_id != undefined ? data.exsOptions : new Map(JSON.parse(data.exsOptions));
        this.exsOptions = new Map(JSON.parse(data.exsOptions));
        this.studentAnswer = new Map(JSON.parse(data.studentAnswer));
        this.counter = data.counter;
        this.time_str = data.time_str;
        this.grade = data.grade;
        this.end = true
      } else {
        //Check if test was automatically generated or made by a teacher and retrieve the data
        if (data.class != undefined && data.exam != undefined) {
          this.counter = data.timer;
          this.data.duration = data.timer;
          this.getRandomExs(data.nquestions);     //Get random nquestions from the pool with suffled options
          if (this.counter == null) {
            this.counter = 10;
          }
          
          this.counter = this.counter*60; 
        } else {
          this.counter = data.duration;
          this.getRandomExs(data.nquestions);     //Get random nquestions from the pool with suffled options
        }

        this.startTimer();
      }
    });
  }

  ngOnInit(): void {
    this.currentQuestionId =- 1;
    this.getNextQuestion();

    window.onbeforeunload = () => this.ngOnDestroy();   //Call ngOnDestroy when the user closes/switches the tab
  }

  //@HostListener allows us to also guard against browser refresh, close, etc.
  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    // insert logic to check if there are pending changes here;
    // returning true will navigate without confirmation
    // returning false will show a confirm dialog before navigating away
    return this.end;
  }

  //Stop timer when the component is destroyed
  ngOnDestroy(): void {
    // If the user is in the middle of the exam, save the data
    if (!this.end) {
      this.checkAnswers();
    }
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
    } else {
      el.checked = true;
      this.studentAnswer.set(id, el.value);
    }
  }

  //Check if the answers are correct
  checkAnswers() {
    this.grade = 0;
    var questionValue = 20 / this.data.nquestions;

    // Calculate the grade
    for (let key of this.studentAnswer.keys()) {
      if (this.data.exercises.find((x: any) => x.id == key).correct == this.studentAnswer.get(key)) {
        this.grade += questionValue;
      } else {
        if (this.studentAnswer.get(key) != undefined) {
          this.grade -= (this.data.deduct * questionValue);
        }
      }
    }
    
    //Display grade with only 2 decimal places
    this.grade = Math.round(this.grade*100)/100;
    
    // Stop the exam
    if (this.data.exam == undefined && this.data.class == undefined) {
      this.end = true;
      clearInterval(this.interval);
      this.currentQuestionId = -1;
      this.getNextQuestion();
      
      //Save the exam data
      this.data.exsOptions = JSON.stringify([...this.exsOptions]);
      this.data.studentAnswer = JSON.stringify([...this.studentAnswer]);
      this.data.time_str = this.time_str;
      this.data.grade = this.grade; 
      this.data.counter = this.counter;
      this.data.exercises = this.data.exercises;

      this._service.openExam(this.data);
    } else {
      // Submit the Exam
      var submit: any = {'final_mark': this.grade < 0 ? 0 : this.grade, 'answers': {}};
      for (let i = 0; i < this.data.exercises.length; i++) {
        submit.answers[(this.data.exercises[i].id).toString()] = this.studentAnswer.get(this.data.exercises[i].id);
      }

      this._service.submitExam(this.data.class, this.data.exam, submit).subscribe((data: any) => {
        if (data.v) {
          this.end = true;
          clearInterval(this.interval);
          
          //Go to the first Question
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

  //Go for the Next Question
  getNextQuestion(){
    this.currentQuestionId++;
    this.currentQuestion = this.data.exercises.find((x: any) => x.id == Array.from(this.exsOptions.keys())[this.currentQuestionId]);
  }

  //Go for the Previous Question
  getPreviousQuestion() {
    this.currentQuestionId--;
    this.currentQuestion = this.data.exercises.find((x: any) => x.id == Array.from(this.exsOptions.keys())[this.currentQuestionId]);
  }

  moveToQuestion(id: number) {
    if (this.currentQuestionId > id)
        this.currentQuestionId -= Math.abs(this.currentQuestionId-id);
    else
      this.currentQuestionId += Math.abs(this.currentQuestionId-id);

    this.currentQuestion = this.data.exercises.find((x: any) => x.id == Array.from(this.exsOptions.keys())[this.currentQuestionId]);
  }

  answeredCorrectly(id: number) {
    if (this.studentAnswer.get(id) == this.data.exercises.find((x: any) => x.id == id).correct)
      return true;
    else
      return false;
  }

  //Display Map in insert order
  asIsOrder(a: any, b: any) {
    return 1;
  }

  startTimer() {
    this.interval = setInterval(() => {
      if (this.counter > 0) {
        this.counter--;
        this.time_str = (Math.floor(this.counter/60) == 0 ? "" : Math.floor(this.counter/60) + "m ") + this.counter%60 + "s"
      } else {
        clearInterval(this.interval);
        this.checkAnswers();
      }
    }, 1000);
  }
}
