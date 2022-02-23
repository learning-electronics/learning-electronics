import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LoginComponent } from './home/login/login.component';
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

  constructor(private _service: SharedService, private _router: Router, public login_dialog: MatDialog,) { }

  ngOnInit() {
    this.subscription = this._service.currentLogStatus.subscribe(logStatus => this.loggedIn = logStatus);
  }
  
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  /* Check if the profile component is available */
  profileRouting() {
    if (this.loggedIn == true) {
      this._router.navigate(['/profile']);
    } else {
      this.login();
    }
  }

  /* Check if the quizz component is available */
  quizzRouting() {
    if (this.loggedIn == true) {
      this._router.navigate(['/quizz']);
    } else {
      this.login();
    }
  }

  /* Check if the class component is available */
  classRouting() {
    if (this.loggedIn == true) {
      this._router.navigate(['/class']);
    } else {
      this.login();
    }
  }

  /* Open Login Dialog */
  login() {
    const dialogRef = this.login_dialog.open(LoginComponent, {
      width: '20%',
      height: '52%'
    });
  }

  /* Remove the login status and redirect to home */
  logout() {
    this._service.changeLogStatus(false);
    this._router.navigate(['/home']);
  }
}
