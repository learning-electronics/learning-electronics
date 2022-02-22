import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from '../register/register.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(public login_dialog: MatDialog, public register_dialog: MatDialog) { }

  ngOnInit(): void {
  }

  /* Open Login Dialog */
  login() {
    const dialogRef = this.login_dialog.open(LoginComponent, {
      width: '20%',
      height: '52%'
    });

    /* After closed should refresh the page and verify its login status */
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
  
}
