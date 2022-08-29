import { Component, EventEmitter, OnInit, Output, ViewEncapsulation } from '@angular/core';


@Component({
  selector: 'app-time-picker',
  templateUrl: './time-picker.component.html',
  styleUrls: ['./time-picker.component.scss'],
  encapsulation : ViewEncapsulation.None,
})
export class TimePickerComponent implements OnInit {
  @Output() onTimerPicked = new EventEmitter<any>();
  minutes: number = 10;
  seconds: number = 0;

  constructor() { }

  ngOnInit(): void {
  }

  checkMinuteValue(input: any) {
    setTimeout(() => {
      if (input.value == '') {
        input.value = 0; 
        this.minutes = 0;
        this.onTimerPicked.emit({minutes: this.minutes, seconds: this.seconds});
      }
    }, 2000);
  }

  checkSecondValue(input: any) {
    setTimeout(() => {
      if (input.value == '') {
        input.value = 0;
        this.seconds = 0;
        this.onTimerPicked.emit({minutes: this.minutes, seconds: this.seconds});
      }
    }, 2000);
  }

  changeMinute(input: any, operation: string) {
    if (operation == 'add') {
      this.minutes = (this.minutes == 60) ?  0 : this.minutes + 1;
    } else {
      this.minutes = (this.minutes == 0) ? 60 : this.minutes - 1;
    }

    input.value = this.minutes;
    this.onTimerPicked.emit({minutes: this.minutes, seconds: this.seconds});
  }

  changeSecond(input: any, operation: string) {
    if (operation == 'add') {
      this.seconds = (this.seconds == 59) ?  0 : this.seconds + 1;
    } else {
      this.seconds = (this.seconds == 0) ? 59 : this.seconds - 1;
    }

    input.value = this.seconds;
    this.onTimerPicked.emit({minutes: this.minutes, seconds: this.seconds});
  }

  onChangeMinute(event: KeyboardEvent) {
    if (event.key == "." || event.key == "," || event.key == "-" || event.key == "e") {
      event.preventDefault();
    }

    if (!isNaN(Number(event.key))) {
      if (this.minutes * 10 + Number(event.key) > 60) {
        event.preventDefault();
      }
    }
  }

  onChangeSecond(event: KeyboardEvent) {
    if (event.key == "." || event.key == "," || event.key == "-" || event.key == "e") {
      event.preventDefault();
    }

    if (!isNaN(Number(event.key))) {
      if (this.seconds * 10 + Number(event.key) > 59) {
        event.preventDefault();
      }
    }
  }
}
