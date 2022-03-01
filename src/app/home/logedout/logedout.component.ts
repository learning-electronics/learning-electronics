import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from '../login/login.component';
import { RecoverPasswordComponent } from '../recover-password/recover-password.component';

@Component({
  selector: 'app-logedout',
  templateUrl: './logedout.component.html',
  styleUrls: ['./logedout.component.scss']
})
export class LogedoutComponent implements OnInit {

  constructor(public login_dialog: MatDialog) { }

  ngOnInit(): void {
  }

  /* Open Login Dialog */
  login() {
    const dialogRef = this.login_dialog.open(LoginComponent, {
      width: '20%',
      height: '52%'
    });
  }

  /* Open Recover Password Dialog */
  recoverPassword() {
    const dialogRef = this.login_dialog.open(RecoverPasswordComponent, {
      width: '20%',
      height: '30%'
    });
  }
}
