import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ChangePasswordComponent } from './change-password/change-password.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor(public change_pw_dialog: MatDialog) { }

  ngOnInit(): void {
  }

  /* Open Change Password Dialog */
  changePassword() {
    const dialogRef = this.change_pw_dialog.open(ChangePasswordComponent, {
      width: '20%',
      height: '52%'
    });
  }

}
