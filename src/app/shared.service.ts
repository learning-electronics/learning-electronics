import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

export interface theme {
  id: number,
  name: string
}

export interface exercise {
  id?: number,
  question: string,
  ans1: string,
  ans2: string,
  ans3: string,
  correct: string,
  unit: string,
  theme: number[] | string[],
  resol: string,
  img: string | null,
  teacher?: number,
  date?: any,
  visible?: any[]
  public?: boolean
}

export interface exerciseSolver {
  question: string,
  public: string,
  theme: string,
  target: string,
  freq: string,
  unit: string
}

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
  role?: string | number
}

export interface classroom {
  id: number,
  name: string,
  teacher?: string,
  students?: any[],
  access: boolean
}

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  readonly ACCOUNT_API = "http://127.0.0.1:8000/account/api";
  readonly EXERCISE_API = "http://127.0.0.1:8000/exercise/api";
  readonly CLASSROOM_API = "http://127.0.0.1:8000/classroom/api";
  readonly EXAM_API = "http://127.0.0.1:8000/exam/api";

  /* Initialize the log status as true or false*/
  private logStatusSource = new BehaviorSubject<boolean>(localStorage.getItem('loggedIn') === 'true' ? true : false);
  currentLogStatus = this.logStatusSource.asObservable();

  /* Initialize the theme status as true or false*/
  private themeStatusSource = new BehaviorSubject<boolean>(localStorage.getItem('theme') === 'true' ? true : false);
  currentThemeStatus = this.themeStatusSource.asObservable();

  /* Initialize the classroom information */
  private classroomSource = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('class')!));
  classroomOpened = this.classroomSource.asObservable()

  /* Initialize the type of user information */
  private userSource = new BehaviorSubject<string>(localStorage.getItem('user') === 'Teacher' ? 'Teacher' : 'Student');
  userStatus = this.userSource.asObservable()

  constructor(private _http: HttpClient) { }

  /* Change the opened class information */
  openClassroom(info: any) {
    this.classroomSource.next(info);
    localStorage.setItem('class', JSON.stringify(info));
  }

  /* Change log status used across the app*/
  changeUserStatus(userStatus: string) {
    this.userSource.next(userStatus);
    localStorage.setItem('user', userStatus);
  }

  /* Change log status used across the app*/
  changeLogStatus(logStatus: boolean) {
    this.logStatusSource.next(logStatus);
    localStorage.setItem('loggedIn', logStatus.toString());
  }

  /* Change theme status used across the app*/
  changeThemeStatus(theme: boolean) {
    if (localStorage.getItem('theme') != theme.toString()) {
      this.themeStatusSource.next(theme);
      localStorage.setItem('theme', theme.toString());
    }
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

    return this._http.patch(this.ACCOUNT_API + '/update_user', person, httpOptions);
  }

  /* Update user's avatar */
  uploadPhoto(file: FormData) {
    var token = localStorage.getItem('token');

    const httpOptions = {
      headers: new HttpHeaders({ Authorization: 'Bearer ' + token })
    };

    return this._http.post(this.ACCOUNT_API + '/upload_avatar', file, httpOptions);
  }

  /* Get all the themes possible*/
  getThemes() {
    return this._http.get(this.EXERCISE_API + '/themes');
  }

  /* Get all the units possible */
  getUnits() {
    return this._http.get(this.EXERCISE_API + '/units');
  }

  /* Get all the exercises in the library database */
  getExercises() {
    return this._http.get(this.EXERCISE_API + '/exercises');
  }

  /* Get all the exercises created by the teacher */
  getMyExercises() {
    var token = localStorage.getItem('token');

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        Authorization: 'Bearer ' + token
      })
    }

    return this._http.get(this.EXERCISE_API + '/my_exercises', httpOptions);
  }

  /* Create the Exercise */
  addExercise(ex: exercise) {
    var token = localStorage.getItem('token');

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        Authorization: 'Bearer ' + token
      })
    }

    return this._http.post(this.EXERCISE_API + '/add_exercise', ex, httpOptions);
  }

  /* Create exercise with circuit solver */
  addExerciseSolver(file: FormData) {
    var token = localStorage.getItem('token');

    const httpOptions = {
      headers: new HttpHeaders({ Authorization: 'Bearer ' + token })
    };

    return this._http.post(this.EXERCISE_API + '/add_exercise_solver', file, httpOptions);
  }

  /* Update exercise's photo */
  uploadExercisePhoto(file: FormData, id: number) {
    var token = localStorage.getItem('token');

    const httpOptions = {
      headers: new HttpHeaders({ Authorization: 'Bearer ' + token })
    };

    return this._http.post(this.EXERCISE_API + '/update_ex_img/' + id, file, httpOptions);
  }

  /* Delete the exercise from the db */
  deleteExercise(id: number) {
    var token = localStorage.getItem('token');

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        Authorization: 'Bearer ' + token
      })
    };

    return this._http.delete(this.EXERCISE_API + '/delete_exercise/' + id, httpOptions);
  }

  /* Update the exercise from the db */
  updateExercise(ex: exercise, id: number) {
    var token = localStorage.getItem('token');

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        Authorization: 'Bearer ' + token
      })
    };

    return this._http.patch(this.EXERCISE_API + '/update_exercise/' + id, ex, httpOptions);
  }

  /* Get all classrooms */
  getClassrooms() {
    var token: any = localStorage.getItem('token');

    const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          Authorization: 'Bearer ' + token
        })
    };

    return this._http.get(this.CLASSROOM_API + '/classrooms', httpOptions);
  }

  /* Get all the classrooms from the Teacher */
  getMyClassrooms() {
    var token: any = localStorage.getItem('token');

    const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          Authorization: 'Bearer ' + token
        })
    };

    return this._http.get(this.CLASSROOM_API + '/my_classrooms', httpOptions);
  }

  /* Create a new Classroom */
  addClassroom(classroom: classroom) {
    var token: any = localStorage.getItem('token');

    const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          Authorization: 'Bearer ' + token
        })
    };

    return this._http.post(this.CLASSROOM_API + '/add_classroom', classroom, httpOptions);
  }

  /* Get information from a Classroom */
  getInfoClassroom(id: number) {
    var token: any = localStorage.getItem('token');

    const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          Authorization: 'Bearer ' + token
        })
    };

    return this._http.get(this.CLASSROOM_API + '/my_classrooms/' + id, httpOptions);
  }

  /* Login to a classroom */
  loginClassroom(id: number, password: string) {
    var token: any = localStorage.getItem('token');

    const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          Authorization: 'Bearer ' + token
        })
    };

    return this._http.post(this.CLASSROOM_API + '/enter_classroom/' + id, {'password': password}, httpOptions);
  }

  /* Leave a classroom */
  leaveClassroom(id: number) {
    var token: any = localStorage.getItem('token');

    const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          Authorization: 'Bearer ' + token
        })
    };

    return this._http.post(this.CLASSROOM_API + '/exit_classroom/' + id, {}, httpOptions);
  }

  /* Delete a classroom */
  deleteClassroom(id: number) {
    var token: any = localStorage.getItem('token');

    const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          Authorization: 'Bearer ' + token
        })
    };

    return this._http.delete(this.CLASSROOM_API + '/delete_classroom/' + id, httpOptions);
  }

  /* Update a classroom */
  updateClassroom(info: any, id: number) {
    var token: any = localStorage.getItem('token');

    const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          Authorization: 'Bearer ' + token
        })
    };

    return this._http.patch(this.CLASSROOM_API + '/update_classroom/' + id, info, httpOptions);
  }

  /* Create a new Exam */
  addExam(exam: any) {
    var token: any = localStorage.getItem('token');

    const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          Authorization: 'Bearer ' + token
        })
    };

    return this._http.post(this.EXAM_API + '/add_exam', exam, httpOptions);
  }

  getMyExams() {
    var token: any = localStorage.getItem('token');

    const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          Authorization: 'Bearer ' + token
        })
    };

    return this._http.get(this.EXAM_API + '/my_exams', httpOptions);
  }

  /* Delete a exam */
  deleteExam(id: number) {
    var token: any = localStorage.getItem('token');

    const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          Authorization: 'Bearer ' + token
        })
    };

    return this._http.delete(this.EXAM_API + '/delete_exam/' + id, httpOptions);
  }
}
