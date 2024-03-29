import { Component, OnInit, ViewChild } from '@angular/core';
import { exercise, theme, SharedService } from 'src/app/shared.service';
import { Subscription } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import * as moment from 'moment';
import { PopupComponent } from 'src/app/popup/popup.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { DesassociateElementComponent } from '../desassociate-element/desassociate-element.component';
import { StartExamComponent } from '../start-exam/start-exam.component';

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
  @ViewChild(MatPaginator) paginatorExams: MatPaginator;
  @ViewChild(MatSort) sortExams: MatSort;

  displayedColumnsMembers: string[] = ['select', 'type', 'first_name', 'last_name'];
  dataSourceMembers = new MatTableDataSource<any>();
  selectionMembers = new SelectionModel<any>(true, []);
  
  displayedColumnsExercises: string[] = ['select', 'question', 'theme', 'date'];
  dataSourceExercises = new MatTableDataSource<any>();
  selectionExercises = new SelectionModel<any>(true, []);
  
  displayedColumnsExams: string[] = ['select', 'title', 'numQuestions', 'password', 'timer'];
  dataSourceExams = new MatTableDataSource<any>();
  selectionExams = new SelectionModel<any>(true, []);

  pageSizeMembers: number = 10;
  sortedDataMembers: any[] = [];
  pageSizeExercises: number = 10;
  sortedDataExercises: any[] = [];
  pageSizeExams: number = 10;
  sortedDataExams: any[] = [];

  all_members: any[] = [];
  all_exercises: exercise[] = [];
  all_themes: theme[] = [];
  all_exams: any[] = [];
  all_stats: any[] = [];

  name: string = "";
  data: any;
  subscription: Subscription = new Subscription();
  sorted_stats: any[] = [];

  constructor(private _service: SharedService, public popup_dialog: MatDialog, private _snackBar: MatSnackBar, private _router: Router) {
    this.subscription = this._service.classroomOpened.subscribe((data: any) => {
      this.data = data;

      if (data == null) {
        this._router.navigate(['/classes']);
      } else {
        this._service.getThemes().subscribe((data: any) => {
          this.all_themes = data as theme[];
          this.refreshTable();
        });

        this._service.getClassroomExams(this.data.id).subscribe((data: any) => {
          this.all_exams = data;
        });

        if (this.data.type != 'Student') {
          this._service.getClassStats(this.data.id).subscribe((data: any) => {
            data.forEach((submited_exam: any) => {
              // Get the correct date format
              submited_exam.date_submitted = moment(submited_exam.date_submitted).format('DD-MM-YYYY');
              this.all_stats.push(submited_exam);
            });

            this.sorted_stats = this.all_stats.reduce(function(a: any, b: any) {
              if(a[b['exam_name']]) {
                a[b['exam_name']].push( b )
              } else {
                a[b['exam_name']] = [ b ]
              }
              return a
            }, {})
          });
        }
      }
    });
  }
  
  ngOnInit(): void {
    if (this.data.type == 'Student') {
      this.displayedColumnsMembers = ['type', 'first_name', 'last_name'];
      this.displayedColumnsExercises = ['question', 'theme', 'date'];
      this.displayedColumnsExams = ['title', 'numQuestions', 'password', 'timer'];
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  ngAfterViewInit() {
    this.dataSourceMembers.sort = this.sortMembers;
    this.dataSourceMembers.paginator = this.paginatorMembers;

    this.dataSourceExercises.sort = this.sortExercises;
    this.dataSourceExercises.paginator = this.paginatorExercises;

    this.dataSourceExams.sort = this.sortExams;
    this.dataSourceExams.paginator = this.paginatorExams;

    /* this.dataSourceStats.sort = this.sortStats;
    this.dataSourceStats.paginator = this.paginatorStats; */
  }

  /* Sort Exercises Data for the table */
  sortDataExercises(sort: Sort) {
    const data = this.all_exercises.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedDataExercises = data;
      return;
    }

    this.sortedDataExercises = data.sort((a, b) => {  
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'question':
          return this.compare(a.question, b.question, isAsc);
        case 'date':
          return this.compareDate(a.date, b.date, isAsc);
        default:
          return 0;
      }
    });

    this.dataSourceExercises = new MatTableDataSource(this.sortedDataExercises);
  }

  /* Sort Members Data for the table */
  sortDataMembers(sort: Sort) {
    const data = this.all_members.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedDataMembers = data;
      return;
    }

    this.sortedDataMembers = data.sort((a, b) => {  
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'first_name':
          return this.compare(a.first_name, b.first_name, isAsc);
        case 'last_name':
          return this.compareDate(a.last_name, b.last_name, isAsc);
        default:
          return 0;
      }
    });

    this.dataSourceMembers = new MatTableDataSource(this.sortedDataMembers);
  }

  /* Sort Exams Data for the table */
  sortDataExams(sort: Sort) {
    const data = this.all_exams.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedDataExams = data;
      return;
    }

    this.sortedDataExams = data.sort((a, b) => {  
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'first_name':
          return this.compare(a.first_name, b.first_name, isAsc);
        case 'last_name':
          return this.compareDate(a.last_name, b.last_name, isAsc);
        default:
          return 0;
      }
    });

    this.dataSourceExams = new MatTableDataSource(this.sortedDataExams);
  }

  /* Compare 2 elements of the table string or number */
  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  /* Function to compare 2 dates */
  compareDate(a: string, b: string, isAsc: boolean) {
    var d1 = moment(a, 'DD-MM-YYYY').utc();
    var d2 = moment(b, 'DD-MM-YYYY').utc();

    return (d1.isBefore(d2) ? -1 : 1) * (isAsc ? 1 : -1); 
  }

  applyFilterMembers(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceMembers.filter = filterValue.trim().toLowerCase();
    
  }

  applyFilterExercises(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceExercises.filter = filterValue.trim().toLowerCase(); 
  }

  applyFilterExams(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceExams.filter = filterValue.trim().toLowerCase(); 
  }

  /* Update the table's information */
  refreshTable() {
    this.all_exercises = [];
    this.all_members = [];

    this._service.getInfoClassroom(this.data.id).subscribe((data: any) => {
      var teacher: any = this.convertValueToMember(data.teacher);
      this.all_members.push({ id: teacher.id, type: 'Professor', first_name: teacher.first_name, last_name: teacher.last_name });

      data.students.forEach( (element: any) => {
        var member: any = this.convertValueToMember(element);
        this.all_members.push({ id: member.id, type: 'Estudante', first_name: member.first_name, last_name: member.last_name });
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
      
      this.dataSourceExercises.data = this.all_exercises;
      this.dataSourceExercises.sort = this.sortExercises;
      this.dataSourceExercises.paginator = this.paginatorExercises;
      this.pageSizeExercises = localStorage.getItem('pageSizeClassExs') ? parseInt(localStorage.getItem('pageSizeClassExs')!) : 10;

      this.dataSourceMembers.data = this.all_members;
      this.dataSourceMembers.sort = this.sortMembers;
      this.dataSourceMembers.paginator = this.paginatorMembers;
      this.pageSizeMembers = localStorage.getItem('pageSizeClassMembers') ? parseInt(localStorage.getItem('pageSizeClassMembers')!) : 10;

      this.dataSourceExams.data = this.all_exams;
      this.dataSourceExams.sort = this.sortExams;
      this.dataSourceExams.paginator = this.paginatorExams;
      this.pageSizeExams = localStorage.getItem('pageSizeClassExams') ? parseInt(localStorage.getItem('pageSizeClassExams')!) : 10;
    });
  }

  /* Function to call poup exercise */
  popup(ex: exercise) {
    /* Open Popup Dialog */
    const dialogRef = this.popup_dialog.open(PopupComponent, {
      data: ex
    });
  }

  /* Converts the received value to a member object */
  convertValueToMember(member: string) {
    var member_object: any = {};

    member_object.id = member.split(' :')[0];
    member_object.first_name = member.split(' ')[2];
    member_object.last_name = member.split(' ')[3];

    return member_object;
  }

  /* Student leaves the classroom */
  leaveClassroom() {
    this._service.leaveClassroom(this.data.id).subscribe((data: any) => {
      if (data.v == true) {
        this._snackBar.open('Saiu da turma com sucesso', 'Fechar', { duration: 2500 });
        this._service.openClassroom(null);
      } else {
        this._snackBar.open('Erro ao sair da turma', 'Fechar', { duration: 2500 });
      }
    });
  }

  /* Delete the classroom */
  deleteClassroom() {
    this._service.deleteClassroom(this.data.id).subscribe((data: any) => {
      if (data.v == true) {
        this._snackBar.open('Turma eliminada com sucesso', 'Fechar', { duration: 2500 });
        this._service.openClassroom(null);
      } else {
        this._snackBar.open('Erro ao eliminar a turma', 'Fechar', { duration: 2500 });
      }
    });
  }

  /* Desassociate selected member(s) from the classroom */
  desassociateMembers() {
    var data: any = { patch_info: [], deleted_info: [] };
    
    this.all_members.forEach((member: any) => {
      if (!this.selectionMembers.selected.includes(member) && member.type == 'Estudante') {
        data.patch_info.push(member);
      } else {
        if (member.type == 'Estudante') data.deleted_info.push(member);
      }
    });

    data.deleted_info.length > 1 ? data.ModalTitle = 'os seguintes membros' : data.ModalTitle = 'o seguinte membro';
    data.type = 'member';
    data.classroom_id = this.data.id;

    this.popup_dialog.open(DesassociateElementComponent, { data: data });
  }

  /* Desassociate selected exercise(s) from the classroom */
  desassociateExercises() {
    var data: any = { patch_info: [], deleted_info: [] };
    
    this.all_exercises.forEach((ex: any) => { 
      if (!this.selectionExercises.selected.includes(ex)) {
        data.patch_info.push(ex);
      } else {
        data.deleted_info.push(ex);
      }
    });

    data.deleted_info.length > 1 ? data.ModalTitle = 'os seguintes exercícios' : data.ModalTitle = 'o seguinte exercício';
    data.type = 'exercise';
    data.classroom_id = this.data.id;

    this.popup_dialog.open(DesassociateElementComponent, { data: data });
  }

  desassociateExams() {}

  /* Whether the number of selected elements matches the total number of rows. */
  isAllSelectedExercises() {
    const numSelected = this.selectionExercises.selected.length;
    const numRows = this.dataSourceExercises.data.length;
    return numSelected === numRows;
  }

  /* Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggleExercises() {
    this.isAllSelectedExercises() ?
        this.selectionExercises.clear() :
        this.dataSourceExercises.data.forEach(row => this.selectionExercises.select(row));
  }

  /* Whether the number of selected elements matches the total number of rows. */
  isAllSelectedMembers() {
    const numSelected = this.selectionMembers.selected.length;
    const numRows = this.dataSourceMembers.data.length - this.all_members.filter(member => member.type == 'Professor').length;
    return numSelected === numRows;
  }

  /* Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggleMembers() {
    this.isAllSelectedMembers() ?
        this.selectionMembers.clear() :
        this.dataSourceMembers.data.forEach(row => {
          if(row.type == 'Estudante') this.selectionMembers.select(row)
        });
  }

  /* Whether the number of selected elements matches the total number of rows. */
  isAllSelectedExams() {
    const numSelected = this.selectionExams.selected.length;
    const numRows = this.dataSourceExams.data.length;
    return numSelected === numRows;
  }

  /* Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggleExams() {
    this.isAllSelectedExams() ?
        this.selectionExams.clear() :
        this.dataSourceExams.data.forEach(row => this.selectionExams.select(row));
  }

  /* Last confirmation before starting the exam */
  confirmExam(data:any) {
    this.popup_dialog.open(StartExamComponent, { data: {class: this.data, exam: data} });
  }

  /* Review the exam */
  reviewExam(exam: any) {
    exam.nquestions = exam.exercises.length;
    
    exam.studentAnswer = exam.answers;
    delete exam.answers;
    
    exam.grade = exam.final_mark;
    delete exam.final_mark;

    var exsOptions = new Map<number, string[]>();
    var studentAnswer = new Map<number, string>();

    for (let ex in exam.exercises) {
      exsOptions.set(exam.exercises[ex].id, [exam.exercises[ex].ans1, exam.exercises[ex].ans2, exam.exercises[ex].ans3, exam.exercises[ex].correct]);
    }

    for (let ex in exam.studentAnswer) {
      studentAnswer.set(Number(ex), exam.studentAnswer[ex]);
    }

    exam.exsOptions = JSON.stringify([...exsOptions]);
    exam.studentAnswer = JSON.stringify([...studentAnswer]);
    exam.time_str = '0s';

    this._service.openExam(exam);
    this._router.navigate(['/show-quiz']);
  }
}
