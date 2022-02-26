import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-logedout',
  templateUrl: './logedout.component.html',
  styleUrls: ['./logedout.component.scss']
})
export class LogedoutComponent implements OnInit {

  constructor(public login_dialog: MatDialog, public register_dialog: MatDialog) { }

  ngOnInit(): void {
  }

  /* Open Login Dialog */
  login() {
    const dialogRef = this.login_dialog.open(LoginComponent, {
      width: '20%',
      height: '52%'
    });
  }
}
