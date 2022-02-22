import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  subscription: Subscription = new Subscription();
  loggedIn: boolean = false;

  constructor(private _service: SharedService) { }

  ngOnInit() :void{
    this.subscription = this._service.currentLogStatus.subscribe(logStatus => this.loggedIn = logStatus);
  }
  
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
