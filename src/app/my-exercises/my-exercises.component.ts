import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { exercise, SharedService, theme, classroom } from '../shared.service';
import { AddExerciseComponent } from './add-exercise/add-exercise.component';
import { EditExerciseComponent } from './edit-exercise/edit-exercise.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import * as _moment from 'moment';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { SelectionModel } from '@angular/cdk/collections';
import { DeleteConfirmationComponent } from './delete-confirmation/delete-confirmation.component';
import { MatSort, Sort} from '@angular/material/sort';


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
  selector: 'app-my-exercises',
  templateUrl: './my-exercises.component.html',
  styleUrls: ['./my-exercises.component.scss'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: DATE_FORMAT },
  ]
})
export class MyExercisesComponent implements OnInit{
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  
  displayedColumns: string[] = ['select', 'question', 'theme', 'classes', 'date'];
  dataSource = new MatTableDataSource<any>();
  selection = new SelectionModel<any>(true, []);
  
  all_themes: theme[] = [];
  all_units: string[] = [];
  all_exercises: any[] = [];
  all_classrooms: classroom[] = [];
  sortedData: exercise[] = [];
  pageSize: number = 10;

  constructor(public add_edit_ex_dialog: MatDialog, private _service: SharedService) {
    this._service.getThemes().subscribe((data: any) => {
      this.all_themes = data as theme[];
      this.refreshTable();
    });

    this._service.getUnits().subscribe((data: any) => {
      this.all_units = data;
    });

    this._service.getMyClassrooms().subscribe((data: any) => {
      this.all_classrooms = data as classroom[];
    });
  }

  ngOnInit(): void {  
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  /* Sort data for the table */
  sortData(sort: Sort) {
    const data = this.all_exercises.slice();
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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  /* Refresh the table content */
  refreshTable() {
    this._service.getMyExercises().subscribe((data: any) => {
      data.forEach((ex: any) => {
        // Changing theme ID array to theme name array
        var theme_names: string[] = [];
        ex.theme.forEach((id: any) => {
          theme_names.push(this.all_themes[id - 1 - 4].name);
        });  

        if (ex.public == true) {
          ex.classes = "Público";
        } else {
          if ('visible' in ex) {
            ex.classes = "";
            
            /* Append the class name to the classes string */
            ex.visible.forEach((c: {'id': number, 'name': string}) => {
              ex.classes += c.name + ", ";
            });
            
            /* Remove the last comma */
            ex.classes = ex.classes.substring(0, ex.classes.length - 2);
          } else {
            ex.classes = "Nenhuma";
          }
        }
          
        ex.theme = theme_names;
        // Get the correct date format
        ex.date = moment(ex.date).format('DD-MM-YYYY');

        this.all_exercises.push(ex);
      });
      
      this.dataSource = new MatTableDataSource(this.all_exercises);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.pageSize = localStorage.getItem('pageSizeExercises') ? parseInt(localStorage.getItem('pageSizeExercises')!) : 10;
    });
  }

  /* Open Add or Edit Exercise Dialog */
  addEx() {
    const dialogRef = this.add_edit_ex_dialog.open(AddExerciseComponent, {
      width: '50%',
      height: '75%', 
      minWidth: '500px',
      data: {
        'ModalTitle': "Adicionar Exercício",
        'themes': this.all_themes,
        'units': this.all_units,
        'classrooms': this.all_classrooms
      }
    });
  }

  /* Open Add or Edit Exercise Dialog */
  editEx(exercise_data: any) {
    var ex = Object.create(exercise_data);
    var theme_list: number[] = [];

    exercise_data.theme.forEach((theme: string) => {
      theme_list.push(this.all_themes.findIndex((t: theme) => t.name == theme) + 1 + 4);
    });

    const dialogRef = this.add_edit_ex_dialog.open(EditExerciseComponent, {
      data: {
        'ModalTitle': "Editar Exercício",
        'themes': this.all_themes,
        'units': this.all_units,
        'exercise': {
          'id': ex.id,
          'question': ex.question,
          'ans1': ex.ans1,
          'ans2': ex.ans2,
          'ans3': ex.ans3,
          'correct': ex.correct,
          'unit': ex.unit,
          'resol': ex.resol,
          'theme': theme_list,
          'img': ex.img,
        }
      }
    });
  }

  /* Open the delete confirmation dialog */
  deleteExercises() {
    const dialogRef = this.add_edit_ex_dialog.open(DeleteConfirmationComponent, {
      data: this.selection.selected
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
