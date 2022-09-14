import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { LoginComponent } from './home/login/login.component';
import { SharedService } from './shared.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  subscription: Subscription = new Subscription();
  loggedIn: boolean = false;

  constructor (private _service: SharedService, public login_dialog: MatDialog, private _router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
    ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    this.subscription = this._service.currentLogStatus.subscribe(logStatus => this.loggedIn = logStatus);
    
    if (this.loggedIn) {
      return true;
    } else {
      this._router.navigate(['/home']);
  
      const dialogRef = this.login_dialog.open(LoginComponent, {
        width: '30%',
        minWidth: '330px',
        maxWidth: '500px',
      });
  
      return false;
    }
  }
}
