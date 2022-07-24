import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from '../home/login/login.component';

@Component({
  selector: 'app-success-register',
  templateUrl: './success-register.component.html',
  styleUrls: ['./success-register.component.scss']
})
export class SuccessRegisterComponent implements OnInit {
  constructor(public login_dialog: MatDialog) { }

  ngOnInit(): void {
  }

  /* Open Login Dialog */
  login() {
    const dialogRef = this.login_dialog.open(LoginComponent, {
      width: '30%',
      minWidth: '330px',
      maxWidth: '500px',
    });
  }
}
