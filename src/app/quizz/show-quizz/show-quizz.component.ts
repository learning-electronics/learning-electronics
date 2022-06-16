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
  examData: any;
  grade: number = 0;
  questionValue:number=0;
  first: boolean = true;
  last: boolean = false;
  currentQuestion:any;
  currentQuestionId:number;
  selectedValue:any;
  end:boolean=false;
  timeLeft: number ;
  interval: any;
  minutes: number;
  seconds: any;
  

  constructor(private _service: SharedService,private _router:Router) {
    this.subscription = this._service.examStatus.subscribe((data: any) => {
      this.examData=data;
      console.log(this.examData);
      this.timeLeft=this.examData.duration*60;    
    });
  }

  ngOnInit(): void {
    this.getRandomExs(this.examData.nquestions);
    this.questionValue=20/this.examData.nquestions;
    // this.currentQuestionId=this.examData.nquestions;
    this.currentQuestionId=0;
    this.getNextQuestion();
    this.startTimer();
    console.log(this.exs);
    console.log(this.questionValue);

  }

  shuffleArray(array : string[]) {
    for(var i = array.length-1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i+1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
  }

  getRandomExs(ntimes: number) {
    let exs: any = [];
    for (let i = 0; i < ntimes; i++) {
      let randomIndex = Math.floor(Math.random() * this.examData.exs.length);
      if (!exs.includes(this.examData.exs[randomIndex])) {
        exs.push(this.examData.exs[randomIndex]);
        this.options.push(this.examData.exs[randomIndex].ans1);
        this.options.push(this.examData.exs[randomIndex].ans2);
        this.options.push(this.examData.exs[randomIndex].ans3);
        this.options.push(this.examData.exs[randomIndex].correct);
        this.shuffleArray(this.options);
        this.exsOptions.set(this.examData.exs[randomIndex].question,this.options);
        this.options = [];
      }else{
        i--;
      }
    }
    this.exs=exs;
    console.log(this.exsOptions);
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
      }else {
        
        this.grade=this.grade-(this.examData.deduct*this.questionValue);
      }
    }

    console.log(this.grade);
    this.end=true;
    //navigate to /home after 5 seconds
    setTimeout(() => {
      this._router.navigate(['/home']);
    }, 4000);
    
    
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
      // check if is last
      if(this.currentQuestionId==this.examData.nquestions-1){
        this.last=true;
      }
      
    }

    //get previous question
    getPreviousQuestion(){

      //check if is first question
      this.currentQuestionId--;
      
      this.currentQuestion=this.exs[this.currentQuestionId];
      
      this.selectedValue = this.studentAnswer.get(this.currentQuestion.question);
     
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
