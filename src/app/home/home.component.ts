import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { SharedService } from '../shared.service';
import { LoginComponent } from './login/login.component';
import { RecoverPasswordComponent } from './recover-password/recover-password.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  subscription: Subscription = new Subscription();
  loggedIn: boolean = false;

  constructor(private _service: SharedService, public login_dialog: MatDialog) { }

  ngOnInit() :void{
    this.subscription = this._service.currentLogStatus.subscribe(logStatus => this.loggedIn = logStatus);
  }
  
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  /* Open Login Dialog */
  login() {
    const dialogRef = this.login_dialog.open(LoginComponent, {
      width: '25%',
      height: '55%',
      minWidth: '350px'
    });
  }

  /* Open Recover Password Dialog */
  recoverPassword() {
    const dialogRef = this.login_dialog.open(RecoverPasswordComponent);
  }
}
