import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { SharedService } from './shared.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  subscription: Subscription = new Subscription();
  title: string = 'learning-electronics';
  isExpanded: boolean = false;
  loggedIn: boolean = false;

  constructor(private _service: SharedService) { }

  ngOnInit() {
    this.subscription = this._service.currentLogStatus.subscribe(logStatus => this.loggedIn = logStatus);
  }
  
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  logout() {
    this._service.changeLogStatus(false);
  }
}
