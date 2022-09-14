import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { SharedService } from './shared.service';

@Injectable({
  providedIn: 'root'
})
export class PermissionGuard implements CanActivate {
  subscription: Subscription = new Subscription();
  isTeacher: boolean = false;

  constructor(private _service: SharedService, private _router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    this.subscription = this._service.userStatus.subscribe(userStatus => this.isTeacher = userStatus == 'Teacher');

    if (this.isTeacher) {
      return true;
    } else {
      this._router.navigate(['/home']);
      return false;
    }
  }
}
