import { OverlayContainer } from '@angular/cdk/overlay';
import { Component, HostBinding } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LoginComponent } from './home/login/login.component';
import { SharedService, account_response } from './shared.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @HostBinding('class') className = '';
  subscription: Subscription = new Subscription();
  toggleControl = new FormControl(false);
  
  title: string = 'learning-electronics';
  isExpanded: boolean = false;
  loggedIn: boolean = false;

  constructor(private overlay: OverlayContainer, private _service: SharedService, private _router: Router, public login_dialog: MatDialog, private _snackBar: MatSnackBar) { }

  ngOnInit() {
    this.toggleControl.valueChanges.subscribe((darkMode) => {
      const darkClassName = 'darkMode';
      this.className = darkMode ? darkClassName : '';
      if (darkMode) {
        this.overlay.getContainerElement().classList.add(darkClassName);
      } else {
        this.overlay.getContainerElement().classList.remove(darkClassName);
      }
    });

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
      this._router.navigate(['/classes']);
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
    this._service.logout().subscribe((data: any) => {
      if ("v" in data) {
        data as account_response;
        if (data.v == true) {
          this._snackBar.open('Logout bem sucedido!', 'Close', { "duration": 2500 });
        } else {
          this._snackBar.open('Logout falhou!', 'Close', { "duration": 2500 });
        }
      } else {
        this._snackBar.open('Logout falhou!', 'Close', { "duration": 2500 });
      }  
    });
    this._router.navigate(['/home']);
  }
}
