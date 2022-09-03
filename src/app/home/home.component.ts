import { OverlayContainer } from '@angular/cdk/overlay';
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
  more: boolean = false;
  theme: number = 0;
  changes: any;

  constructor(private _service: SharedService, public login_dialog: MatDialog, private _overlay: OverlayContainer) { }

  ngOnInit() :void{
    this.subscription = this._service.currentLogStatus.subscribe(logStatus => this.loggedIn = logStatus);
    this.theme = this._overlay.getContainerElement().classList.contains('darkMode') ? 0.5 : 0;
  }
  
  ngAfterContentInit(): void {
    this.changes = new MutationObserver((mutations: MutationRecord[]) => {
      mutations.forEach((mutation: MutationRecord) => {
        this.theme = this._overlay.getContainerElement().classList.contains('darkMode') ? 0.5 : 0;
      });
    });

    this.changes.observe(this._overlay.getContainerElement(), {
      attributeFilter: ['class'],
    });
  }
  
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  /* Open Login Dialog */
  login() {
    const dialogRef = this.login_dialog.open(LoginComponent, {
      width: '30%',
      minWidth: '330px',
      maxWidth: '500px',
    });
  }

  /* Open Recover Password Dialog */
  recoverPassword() {
    const dialogRef = this.login_dialog.open(RecoverPasswordComponent);
  }
}
