import { Component, OnInit } from '@angular/core';
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
  exs:any;
  studentAnswer: Map<string, string> = new Map<string, string>();
  image_url: string = "";
  examData: any;
  grade: number = 0;
  questionValue:number=0;


  constructor(private _service: SharedService) {
    this.subscription = this._service.examStatus.subscribe((data: any) => {
      this.examData=data;
      console.log(this.examData);
    });
  }

  ngOnInit(): void {
    this.getRandomExs(this.examData.nquestions);
    this.questionValue=20/this.examData.nquestions;
    console.log(this.exs);
  }

  //scramble the options

  // get random exs from the list
  getRandomExs(ntimes: number) {
    let exs: any = [];
    for (let i = 0; i < ntimes; i++) {
      let randomIndex = Math.floor(Math.random() * this.examData.exs.length);
      if (!exs.includes(this.examData.exs[randomIndex])) {
        exs.push(this.examData.exs[randomIndex]);
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
      }else{
        console.log("wrong");
        this.grade=this.grade-(this.examData.deduct*this.questionValue);
      }
    }

    console.log(this.grade);
  }
}
