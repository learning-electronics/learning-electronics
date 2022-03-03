import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

export interface login {
  email: string,
  password: string
}

export interface passwords {
  old_pwd: string,
  new_pwd: string
}

export interface account_response {
  v: boolean,
  m: string,
  t?: string
}

export interface person {
  email: string,
  first_name: string,
  last_name: string,
  birth_date: string,
  password?: string,
  joined?: string,
  avatar?: string | null,
  role: number
}

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  readonly ACCOUNT_API = "http://127.0.0.1:8000/account/api";

  /* Initialize the log status as true or false*/
  private logStatusSource = new BehaviorSubject<boolean>(localStorage.getItem('loggedIn') === 'true' ? true : false);
  currentLogStatus = this.logStatusSource.asObservable();

  constructor(private _http: HttpClient) { }

  /* Change log status used across the app*/
  changeLogStatus(logStatus: boolean) {
    this.logStatusSource.next(logStatus);
    localStorage.setItem('loggedIn', logStatus.toString());
  }

  /* Login with email and password */
  login(credentials: login) {
    return this._http.post(this.ACCOUNT_API + '/login', credentials);
  }

  /* Logout with account response */
  logout() {
    var token: any = localStorage.getItem('token');

    const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          Authorization: 'Bearer ' + token
        })
    };

    /* Remove the token from local storage */
    localStorage.removeItem('token');
    return this._http.post(this.ACCOUNT_API + '/logout', token, httpOptions);
  }

  /* Register with person attributes */
  register(person: person) {
    return this._http.post(this.ACCOUNT_API + '/register', person);
  }

  /* Change an user's password */
  changePassword(pwds: passwords) {
    var token: any = localStorage.getItem('token');

    const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          Authorization: 'Bearer ' + token
        })
    };

    return this._http.post(this.ACCOUNT_API + '/change_pwd', pwds, httpOptions);
  }

  /* Deactive the user's account */
  deleteAccount(credentials: login) {
    var token = localStorage.getItem('token');

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        Authorization: 'Bearer ' + token
      })
    };

    return this._http.post(this.ACCOUNT_API + '/delete', credentials, httpOptions);
  }

  /* Retrieve the user's information */
  getAccount() {
    var token = localStorage.getItem('token');

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        Authorization: 'Bearer ' + token
      })
    };

    return this._http.get(this.ACCOUNT_API + '/user', httpOptions);
  }

  /* Update user's first name and/or last name and/or birth date */
  updateAccount(person: person) {
    var token = localStorage.getItem('token');

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        Authorization: 'Bearer ' + token
      })
    };

    return this._http.post(this.ACCOUNT_API + '/update_user', person, httpOptions);
  }

  /* Update user's avatar */
  uploadPhoto(file: FormData) {
    var token = localStorage.getItem('token');

    const httpOptions = {
      headers: new HttpHeaders({ Authorization: 'Bearer ' + token })
    };

    return this._http.post(this.ACCOUNT_API + '/upload_avatar', file, httpOptions);
  }
}
