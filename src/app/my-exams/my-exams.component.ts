import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { classroom, SharedService, theme } from '../shared.service';
import * as _moment from 'moment';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { AddExamComponent } from './add-exam/add-exam.component';
import { DeleteConfirmationExamComponent } from './delete-confirmation-exam/delete-confirmation-exam.component';
import { EditExamComponent } from './edit-exam/edit-exam.component';

const moment = _moment;

export const DATE_FORMAT = {
  parse: {
      dateInput: ['DD-MM-YYYY', 'DD/MM/YYYY'] 
  },
  display: {
      dateInput: 'DD-MM-YYYY',
      monthYearLabel: 'YYYY',
      dateA11yLabel: 'LL',
      monthYearA11yLabel: 'YYYY'
  }
};

@Component({
  selector: 'app-my-exams',
  templateUrl: './my-exams.component.html',
  styleUrls: ['./my-exams.component.scss'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: DATE_FORMAT },
  ]
})
export class MyExamsComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  
  displayedColumns: string[] = ['select', 'title', 'numQuestions', 'visible', 'classes', 'password', 'timer', 'date'];
  dataSource = new MatTableDataSource<any>();
  selection = new SelectionModel<any>(true, []);

  all_classrooms: classroom[];
  all_themes: theme[];
  all_exams: any[] = [];
  sortedData: any[] = [];
  pageSize: number = 10;
  
  constructor(public add_edit_ex_dialog: MatDialog, private _service: SharedService) {
    this._service.getThemes().subscribe((data: any) => {
      this.all_themes = data as theme[];
      this.refreshTable();
    });

    this._service.getMyClassrooms().subscribe((data: any) => {
      this.all_classrooms = data as classroom[];
    });
  }

  ngOnInit(): void {
    this.dataSource.filterPredicate = (data: any, filter: string): boolean => {
      return (
        data.name.toLocaleLowerCase().includes(filter)
      )
    }
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  refreshTable() {
    this._service.getMyExams().subscribe((data: any) => {
      console.log(data);
      data.forEach((exam: any) => {
        if (exam.classrooms.length > 0) {
          exam.classes = "";
          
          /* Append the class name to the classes string */
          exam.classrooms.forEach((c: {'id': number, 'name': string}) => {
            exam.classes += c.name + ", ";
          });
          
          /* Remove the last comma */
          exam.classes = exam.classes.substring(0, exam.classes.length - 2);
        } else {
          exam.classes = "Nenhuma";
        }
        
        // Get the correct date format
        exam.date_created = moment(exam.date_create).format('DD-MM-YYYY');

        this.all_exams.push(exam);
      });
      
      this.dataSource.data = this.all_exams;
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      localStorage.getItem('pageSizeExams') ? parseInt(localStorage.getItem('pageSizeExams')!) : 10;
    });
  }

  /* Sort data for the table */
  sortData(sort: Sort) {
    const data = this.all_exams.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedData = data;
      return;
    }

    this.sortedData = data.sort((a, b) => {  
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

    this.dataSource = new MatTableDataSource(this.sortedData);
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

  deleteExams() {
    const dialogRef = this.add_edit_ex_dialog.open(DeleteConfirmationExamComponent, {
      data: this.selection.selected
    });
  }

  addExam() {
    const dialogRef = this.add_edit_ex_dialog.open(AddExamComponent, {
      width: '60%',
      height: '75%', 
      minWidth: '700px',
      data: {
        'themes': this.all_themes,
        'classrooms': this.all_classrooms
      }
    });
  }

  editExam(exam_data: any) {
    const dialogRef = this.add_edit_ex_dialog.open(EditExamComponent, {
      width: '60%',
      height: '75%', 
      minWidth: '700px',
      data: {
        'exam': exam_data,
        'themes': this.all_themes,
        'classrooms': this.all_classrooms
      }
    });
  }

  /* Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /* Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
  }
}
