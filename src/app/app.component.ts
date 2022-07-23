import { OverlayContainer } from '@angular/cdk/overlay';
import { Component, HostBinding, HostListener } from '@angular/core';
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
  currentComponent: string = "home";
  theme: number = 0;
  teacher: boolean = false;
  smallScreen: boolean = false;

  constructor(private _overlay: OverlayContainer, private _service: SharedService, private _router: Router, public login_dialog: MatDialog, private _snackBar: MatSnackBar) {
    this.checkTeacherStatus();
  }

  checkTeacherStatus() {
    var token = localStorage.getItem('token');

    if (token != null) {
      this._service.getAccount().subscribe((data: any) => {
        if (data.v == true) {
          if (data.info.role == "Teacher") {
            this.teacher = true;
            this._service.changeUserStatus('Teacher');
          } else {
            this.teacher = false;
            this._service.changeUserStatus('Student');
          }
        }
      });
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    event.target.innerWidth <= 700 ? this.smallScreen = true : this.smallScreen = false;
  }

  ngOnInit() {
    window.innerWidth <= 700 ? this.smallScreen = true : this.smallScreen = false;
    
    /* Listen for form changes */
    this.toggleControl.valueChanges.subscribe((toggled) => {
      this.className = toggled ? 'darkMode' : '';
      
      if (toggled) {
        this._overlay.getContainerElement().classList.add('darkMode');
        this.theme = 0.5;

        // Storage variable theme
        this._service.changeThemeStatus(true);
      } else {
        this._overlay.getContainerElement().classList.remove('darkMode');
        this.theme = 0;

        // Storage variable theme
        this._service.changeThemeStatus(false);
      }
    });

    /* Pre fill the form with the correct theme */
    if (localStorage.getItem('theme') == 'true') {
      this.toggleControl.setValue(true);
    } else {
      this.toggleControl.setValue(false);
    }

    this.subscription = this._service.currentLogStatus.subscribe(logStatus => this.loggedIn = logStatus);
  }

  /* Change the currentComponent status */
  public onRouterOutletActivate(event : any) {
    if (event.constructor.name == "ProfileComponent" || event.constructor.name == "RegisterComponent") {
      this.currentComponent = "profile";
    }else if (event.constructor.name == "HomeComponent" || event.constructor.name == "FaqComponent") {
      this.currentComponent = "none";
    } else {
      this.currentComponent = "other";
    }
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

  /* Check if the class component is available */
  gameRouting() {
    if (this.loggedIn == true) {
      this._router.navigate(['/game']);
    } else {
      this.login();
    }
  }

  /* Open Login Dialog */
  login() {
    const dialogRef = this.login_dialog.open(LoginComponent, {
      width: '30%',
      minWidth: '330px',
      maxWidth: '500px',
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
    
    this.teacher = false;
    this._router.navigate(['/home']);
  }
}
