import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private logStatusSource = new BehaviorSubject<boolean>(false);
  currentLogStatus = this.logStatusSource.asObservable();

  constructor() { }

  /* Change log status used across the app*/
  changeLogStatus(logStatus: boolean) {
    this.logStatusSource.next(logStatus);
  }
}
