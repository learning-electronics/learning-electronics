import { Component, OnInit, ViewChild } from '@angular/core';
import { exercise, theme, SharedService } from 'src/app/shared.service';
import { Subscription } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import * as moment from 'moment';
import { PopupComponent } from 'src/app/popup/popup.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-show-class',
  templateUrl: './show-class.component.html',
  styleUrls: ['./show-class.component.scss']
})
export class ShowClassComponent implements OnInit {
  @ViewChild(MatPaginator) paginatorMembers: MatPaginator;
  @ViewChild(MatSort) sortMembers: MatSort;
  @ViewChild(MatPaginator) paginatorExercises: MatPaginator;
  @ViewChild(MatSort) sortExercises: MatSort;

  displayedColumnsMembers: string[] = ['type', 'fname', 'lname'];
  dataSourceMembers = new MatTableDataSource<any>();
  displayedColumnsExercises: string[] = ['question', 'theme', 'date'];
  dataSourceExercises = new MatTableDataSource<any>();

  valueMembers: number = 0;
  pageSizeMembers: number = 10;
  sortedDataMembers: any[] = [];
  valueExercises: number = 0;
  pageSizeExercises: number = 10;
  sortedDataExercises: any[] = [];

  all_members: any[] = [];
  all_exercises: exercise[] = [];
  all_themes: theme[] = [];

  name: string = "";
  data: any;
  subscription: Subscription = new Subscription();

  constructor(private _service: SharedService, public popup_dialog: MatDialog) {
    this.subscription = this._service.classroomOpened.subscribe((data: any) => {
      this.data = data;

      this._service.getThemes().subscribe((data: any) => {
        this.all_themes = data as theme[];
        this.refreshTable();
      });
    });
  }
  
  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  ngAfterViewInit() {
    this.dataSourceMembers.sort = this.sortMembers;
    this.dataSourceMembers.paginator = this.paginatorMembers;
  }

  /* Sort data for the table */
  sortData(sort: Sort) {
    /* const data = [""];
    if (!sort.active || sort.direction === '') {
      this.sortedData = data;
      return;
    }

    this.sortedData = data.sort((a, b) => {  
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'name':
          return this.compare(a.question, b.question, isAsc);
        case 'teacher':
          return this.compare(a.ans1, b.ans1, isAsc);
        case 'number_students':
          return this.compare(a.ans1, b.ans1, isAsc);
        default:
          return 0;
      }
    });

    this.dataSource = new MatTableDataSource(this.sortedData); */
  }

  /* Compare 2 elements of the table string or number */
  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  applyFilterMembers(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceMembers.filter = filterValue.trim().toLowerCase();
    
  }

  applyFilterExercises(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceExercises.filter = filterValue.trim().toLowerCase(); 
  }

  /* Update the table's information */
  refreshTable() {
    this._service.getInfoClassroom(this.data.id).subscribe((data: any) => {
      var teacher: any = this.convertValueToMember(data.teacher);
      this.all_members.push({ type: 'Professor', fname: teacher.fname, lname: teacher.lname });

      data.students.forEach( (element: any) => {
        var member: any = this.convertValueToMember(element);
        this.all_members.push({ type: 'Estudante', fname: member.fname, lname: member.lname });
      });

      data.exercises.forEach((ex: exercise) => {
        // Changing theme ID array to theme name array
        var theme_names: string[] = [];
        ex.theme.forEach((id: any) => {
          theme_names.push(this.all_themes[id - 1 - 4].name);
        });  

        ex.theme = theme_names;
        // Get the correct date format
        ex.date = moment(ex.date).format('DD-MM-YYYY');

        this.all_exercises.push(ex);
      });
      
      this.dataSourceExercises = new MatTableDataSource(this.all_exercises);
      this.dataSourceExercises.sort = this.sortExercises;
      this.dataSourceExercises.paginator = this.paginatorExercises;
      this.pageSizeExercises = localStorage.getItem('pageSizeExercises') ? parseInt(localStorage.getItem('pageSizeExercises')!) : 10;

      this.dataSourceMembers = new MatTableDataSource(this.all_members);
      this.dataSourceMembers.sort = this.sortMembers;
      this.dataSourceMembers.paginator = this.paginatorMembers;
      this.pageSizeMembers = localStorage.getItem('pageSizeClasses') ? parseInt(localStorage.getItem('pageSizeClasses')!) : 10;
    });
  }

  popup(ex: exercise) {
    /* Open Popup Dialog */
    const dialogRef = this.popup_dialog.open(PopupComponent, {
      data: ex
    });
  }

  /* Converts the received value to a member object */
  convertValueToMember(member: string) {
    var member_object: any = {};

    member_object.fname = member.split(' ')[2];
    member_object.lname = member.split(' ')[3];

    return member_object;
  }
}
