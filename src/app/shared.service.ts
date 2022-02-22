import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';

export interface login {
  email: string,
  password: string
}

export interface auth_response {
  message: boolean,
  email: string,
  token: string
}

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  readonly ACCOUNT_API = "http://127.0.0.1:8000/account/api";

  private logStatusSource = new BehaviorSubject<boolean>(false);
  currentLogStatus = this.logStatusSource.asObservable();
  private authResSource = new BehaviorSubject<auth_response>({message: false, email: "", token: ""});
  currentAuthRes = this.authResSource.asObservable();

  constructor(private _http: HttpClient) { }

  /* Change log status used across the app*/
  changeLogStatus(logStatus: boolean) {
    this.logStatusSource.next(logStatus);
  }

  /* Change Auth Response used across the app*/
  changeAuthRes(authRes: auth_response) {
    this.authResSource.next(authRes);
  }

  /* Login with email and password */
  login(credentials: login) {
    return this._http.post(this.ACCOUNT_API + '/login', credentials);
  }

  /* Logout with auth_response */
  logout() {
    const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          Authorization: 'Bearer ' + this.authResSource
        })
    };

    return this._http.post(this.ACCOUNT_API + '/logout', this.authResSource, httpOptions);
  }
}
