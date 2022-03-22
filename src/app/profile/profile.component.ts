import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SharedService, person } from '../shared.service';
import { ChangeEmailComponent } from './change-email/change-email.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { DeleteAccountComponent } from './delete-account/delete-account.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  user_info!: person;

  constructor(public change_pw_dialog: MatDialog, public delete_acc_dialog: MatDialog, private _service: SharedService) {
    this._service.getAccount().subscribe((data: any) => {
      if (data.v == true) {
        this.user_info = data.info as person;
      }
    });
  }

  ngOnInit(): void {
  }

  /* Open Change Email Dialog */
  changeEmail() {
    const dialogRef = this.change_pw_dialog.open(ChangeEmailComponent);
  }

  /* Open Change Password Dialog */
  changePassword() {
    const dialogRef = this.change_pw_dialog.open(ChangePasswordComponent);
  }

  /* Open Delete Account Dialog */
  deleteAccount() {
    const dialogRef = this.delete_acc_dialog.open(DeleteAccountComponent);
  }

  /* Smooth Scroll to element */
  scrollToElement($element: any) {
    $element.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
  }
}
