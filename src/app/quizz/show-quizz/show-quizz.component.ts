import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SharedService } from 'src/app/shared.service';

@Component({
  selector: 'app-show-quizz',
  templateUrl: './show-quizz.component.html',
  styleUrls: ['./show-quizz.component.scss']
})


export class ShowQuizzComponent implements OnInit {
  subscription: Subscription = new Subscription();
  options: string[] = [];
  exs:any[]=[];
  studentAnswer: Map<string, string> = new Map<string, string>();
  exsOptions:Map <string,string[]>=new Map<string,string[]>();
  nquestions: number = 0;
  deduct: number = 0;
  grade: number = 0;
  questionValue:number=0;
  currentQuestion:any;
  currentQuestionId:number;
  selectedValue:any;
  end:boolean=false;
  timeLeft: number=0;
  interval: any;
  minutes: number;
  seconds: any;


  constructor(private _service: SharedService,private _router:Router) {
    this.subscription = this._service.examStatus.subscribe((data: any) => {
      //check if test was automatically generated or made by a teacher and retrieve the data
      if (data.exercises!=undefined) {
        this.exs = data.exercises;
        this.nquestions = data.nquestions;
        this.deduct = data.deduct;
        this.timeLeft=data.timer;
      }else{
        this.nquestions = data.nquestions;
        this.timeLeft=data.duration;
        this.deduct = data.deduct;
        this.exs=data.exs;  
        this.getRandomExs(this.nquestions);
      }
    this.timeLeft=this.timeLeft*60;  
    this.questionValue=20/this.nquestions;
    
  });
}

  ngOnInit(): void {
    this.currentQuestionId=-1;
    this.getNextQuestion();
    this.startTimer();
  }

  //stop timer when the component is destroyed
  ngOnDestroy(): void {
    
    clearInterval(this.interval);
  }

  //shuffle array 
  shuffleArray(array : string[]) {
    for(var i = array.length-1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i+1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
  }

  //if teste is auto generated get random questions from the pool
  getRandomExs(ntimes: number) {
    let exs: any = [];
    for (let i = 0; i < ntimes; i++) {
      let randomIndex = Math.floor(Math.random() * this.exs.length);
      if (!exs.includes(this.exs[randomIndex])) {
        exs.push(this.exs[randomIndex]);
        this.options.push(this.exs[randomIndex].ans1);
        this.options.push(this.exs[randomIndex].ans2);
        this.options.push(this.exs[randomIndex].ans3);
        this.options.push(this.exs[randomIndex].correct);
        this.shuffleArray(this.options); //shuffle options
        this.exsOptions.set(this.exs[randomIndex].question,this.options);
        this.options = [];
      }else{
        i--;
      }
    }
    this.exs=exs;
  }

  chooseOption(question:string,option: string) {
    console.log(option);
    //delete previous answer
    if(this.studentAnswer.has(question)){
      this.studentAnswer.delete(question);
    }
    //add new answer
    this.studentAnswer.set(question,option);
    console.log(this.studentAnswer);
  }

  //check if the answer is correct
  checkAnswers() {
    this.grade=0;
    for (let i = 0; i < this.exs.length; i++) {
      if (this.exs[i].correct == this.studentAnswer.get(this.exs[i].question)) {
        this.grade+=this.questionValue;
      }else if ( this.studentAnswer.get(this.exs[i].question)==undefined ) {
        this.grade+=0;
        this.studentAnswer.set(this.exs[i].question,"Não respondeu");
      } else{
        
        this.grade=this.grade-(this.deduct*this.questionValue);
      }
    }
    //display grade with onyl 2 decimal cases
    this.grade=Math.round(this.grade*100)/100;
    this.end=true;
    this.pauseTimer();
    this.currentQuestionId=0;
  }
    //go home
    goHome(){
      this._router.navigate(['/home']);
    }

   //get 1 question from exs list and remove it from the list
    getNextQuestion(){
      this.currentQuestionId++;
      this.currentQuestion=this.exs[this.currentQuestionId];
      if (this.studentAnswer.has(this.currentQuestion.question)) {
        this.selectedValue=this.studentAnswer.get(this.currentQuestion.question);
      }else{
        this.selectedValue='';
      }
    }

    //get previous question
    getPreviousQuestion(){
      this.currentQuestionId--;
      this.currentQuestion=this.exs[this.currentQuestionId];
      if (this.studentAnswer.has(this.currentQuestion.question)) {
        this.selectedValue=this.studentAnswer.get(this.currentQuestion.question);
      }else{
        this.selectedValue='';
      }
    }
  
    startTimer() {
      
      this.interval = setInterval(() => {
        if(this.timeLeft > 0) {
          this.timeLeft--;
          this.getMinutes();
          this.getSeconds();
          console.log(this.timeLeft);
        } else {
          this.pauseTimer();
          this.checkAnswers();
        }
      },1000)
      if (this.timeLeft==0) {
        this.pauseTimer();
        this.checkAnswers();
      }
    }

    //timer with minutes and seconds
    getMinutes() {
      this.minutes=Math.floor(this.timeLeft / 60);
    }
    getSeconds() {
      this.seconds=this.timeLeft % 60;
      //with 2 digits
      if(this.seconds<10){
        this.seconds='0'+this.seconds;
      }
    }
  
    pauseTimer() {
      clearInterval(this.interval);
    }
}
