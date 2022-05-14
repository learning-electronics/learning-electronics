import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { AddClassComponent } from './add-class/add-class.component';
import { MatDialog } from '@angular/material/dialog';
import { SharedService, classroom, person } from '../shared.service';
import { ClassPasswordComponent } from './class-password/class-password.component';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'app-classes',
  templateUrl: './classes.component.html',
  styleUrls: ['./classes.component.scss']
})
export class ClassesComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = ['access', 'name', 'teacher', 'number_students'];
  dataSource = new MatTableDataSource<any>();

  search: string = "";
  value: number = 0;
  pageSize: number = 10;
  sortedData: any[] = [];
  all_classrooms: any[] = [];
  user_info: person;
  type: string;

  constructor(private _service: SharedService, private _router: Router, public add_class_dialog: MatDialog, public login_class_dialog: MatDialog) {
    this.refreshTable();
  }

  ngOnInit(): void { 
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  /* Sort data for the table */
  sortData(sort: Sort) {
    const data = this.all_classrooms.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedData = data;
      return;
    }

    this.sortedData = data.sort((a, b) => {  
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'name':
          return this.compare(a.name, b.name, isAsc);
        case 'teacher':
          return this.compare(a.teacher, b.teacher, isAsc);
        case 'number_students':
          return this.compare(a.number_students, b.number_students, isAsc);
        default:
          return 0;
      }
    });

    this.dataSource = new MatTableDataSource(this.sortedData);
  }

  /* Compare 2 elements of the table string or number */
  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  /* Open Dialog for adding a class */
  addClass() {
    const dialogRef = this.add_class_dialog.open(AddClassComponent, {
      width: '30%',
      height: '50%', 
      minWidth: '300px',
    });
  }

  /* Update the table's information */
  refreshTable() {
    this._service.getClassrooms().subscribe((data: any) => {
      data as classroom[];

      data.forEach( (element: any) => {
        this.all_classrooms.push({ access: element.access, id: element.id, name: element.name, teacher: element.teacher__first_name, number_students: element.students });
      });

      this.dataSource = new MatTableDataSource(this.all_classrooms);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.pageSize = localStorage.getItem('pageSizeClasses') ? parseInt(localStorage.getItem('pageSizeClasses')!) : 10;
    });
  }

  redirectClass(classroom: any) {
    if (classroom.access === false) {
      this.insertCredentialsClassroom(classroom);
    } else {
      this.openClassroom(classroom);
      this._router.navigate(['class/']);
    }
  }

  /* Change the opened classroom */
  openClassroom(info: any) {
    this._service.openClassroom(info);
  }

  /* Login to a classroom */
  insertCredentialsClassroom(info: any) {
    const dialogRef = this.login_class_dialog.open(ClassPasswordComponent, {
      width: '25%',
      height: '29%', 
      minWidth: '250px',
      data: info
    });
  }
}
