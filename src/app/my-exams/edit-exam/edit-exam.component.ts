import { SelectionModel } from '@angular/cdk/collections';
import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { PopupComponent } from 'src/app/popup/popup.component';
import { classroom, exercise, SharedService, theme } from 'src/app/shared.service';

@Component({
  selector: 'app-edit-exam',
  templateUrl: './edit-exam.component.html',
  styleUrls: ['./edit-exam.component.scss']
})
export class EditExamComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  
  displayedColumns: string[] = ['select', 'question', 'theme', 'classes'];
  dataSource = new MatTableDataSource<any>();
  selection = new SelectionModel<any>(true, []);
  
  filled_data: any;
  sortedData: exercise[] = [];
  all_themes: theme[] = [];
  all_exercises: any[] = [];
  all_classrooms: classroom[] = [];
  pageSize: number = 5;
  state: number = 1;
  points: any[] = [{name: 'Nada', value: 0}, {name: '25%', value: 0.25}, {name: '33%', value: 0.33}, {name: '50%', value: 0.5}];
  disable_state = false;
  disable_submit = false;
  hide: boolean = true;

  form!: UntypedFormGroup;

  constructor(private _formBuilder: UntypedFormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _service: SharedService,
    private _router: Router,
    private _snackBar: MatSnackBar,
    public popup_dialog: MatDialog,
    private dialogRef: MatDialogRef<EditExamComponent>)
  {
    console.log(data.exam);
    this.filled_data = data.exam;
    this.all_themes = data.themes as theme[];
    this.all_classrooms = data.classrooms as classroom[];
    this.refreshTable();
  }

  ngOnInit(): void {
    var class_ids: number[] = [];
    this.filled_data.classrooms.forEach((c: classroom) => {
      class_ids.push(c.id);
    });
    
    this.form = this._formBuilder.group({
      name: new UntypedFormControl(this.filled_data.name, [Validators.required]),
      questions: new UntypedFormControl(this.filled_data.number_of_exercises, [Validators.required]),
      password: new UntypedFormControl(null),
      deduct: new UntypedFormControl(this.points.find((p: any) => p.value == this.filled_data.deduct).value, [Validators.required]),
      check: new UntypedFormControl(this.filled_data.public),
      classrooms: new UntypedFormControl(class_ids),
      timer: new UntypedFormControl(this.filled_data.timer),
      repeat: new UntypedFormControl(this.filled_data.repeat),
    }, {validator: numQuestionsValidator});

    this.dataSource.filterPredicate = (data: exercise, filter: string): boolean => {
      return (
        data.question.toLocaleLowerCase().includes(filter)
      )
    };

    this.form.statusChanges.subscribe((result: string) => {
      if (result == 'INVALID') {
        this.disable_state = true;
      } else {
        this.disable_state = false;
      }
    });
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  /* Shorthands for form controls (used from within template) */
  get numQuestions() { return this.form.get('questions'); }
  get name() { return this.form.get('name'); }
  get deduct() { return this.form.get('deduct'); }

  /* Update validation when the questgions input changes */
  onQuestionsInput() {
    this.selection.clear();
    if (this.form.hasError('numQuestionsWrong'))
      this.numQuestions?.setErrors([{'numQuestionsWrong': true}]);
    else
      this.numQuestions?.setErrors(null);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  next() {
    this.state += 1;
  }

  previous() {
    this.state -= 1;
  }

  /* Submit form action */
  submit() {
    if (this.form.valid) {
      /* Get the exercises info needed for the rest view */
      var exercises_info: any[] = [];
      this.selection.selected.forEach((ex: exercise) => {
        exercises_info.push({
          exercise: ex.id,
          mark: (1/this.selection.selected.length).toFixed(2)
        });
      });

      var exam = {
        name: this.form.get('name')?.value,
        password: this.form.get('password')?.value,
        deduct: this.form.get('deduct')?.value.toFixed(2),
        classrooms: this.form.get('classrooms')?.value ? this.form.get('classrooms')?.value : [],
        public: this.form.get('check')?.value,
        exercises: exercises_info,
        repeat: this.form.get('repeat')?.value,
      }

      this._service.updateExam(exam, this.filled_data.id).subscribe((data: any) => {
        console.log(data);
        if ("v" in data) {
          if (data.v == true) {
            /* Close the dialog */
            this.dialogRef.close();

            /* Reload the my_exercises component */
            let currentUrl = this._router.url;
            this._router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
                this._router.navigate([currentUrl]);
            });
            
            this._snackBar.open('Exame adicionado!', 'Fechar', { "duration": 2500 });
          } else {
            this._snackBar.open('Erro ao adicionar Exame!', 'Fechar', { "duration": 2500 });
          }
        }
      });
    }
  }

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
      
        this.all_exercises.push(ex);
      });
      
      this.dataSource.data = this.all_exercises;
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.pageSize = 5;//localStorage.getItem('pageSizeExercises') ? parseInt(localStorage.getItem('pageSizeExercises')!) : 10;
      

      this.filled_data.exercises.forEach((id: number) => {
        this.dataSource.data.forEach((row: any) => {
          if (row.id == id) this.selection.select(row);
        });
      });
    });
  }

  /* Function to call poup exercise */
  popup(ex: exercise) {
    /* Open Popup Dialog */
    const dialogRef = this.popup_dialog.open(PopupComponent, {
      data: ex
    });
  }

  /* Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    return numSelected === this.numQuestions?.value;
  }

  /* Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach((row: any) => {
          if (this.selection.selected.length < this.numQuestions?.value) this.selection.select(row);
        });
  }  

  /* Stop default action of checkbox when the number of checkboxes checked is the same as number of questions */
  tryToCheck(event: Event, row: any) {
    if (this.selection.selected.length >= this.numQuestions?.value) {
      if (!this.selection.selected.includes(row)) event.preventDefault();
    }
  }
}

export const numQuestionsValidator: ValidatorFn = (formGroup: AbstractControl ): ValidationErrors | null  => {
  var numQuestions = formGroup.get('questions')?.value;

  if (numQuestions <= 0 || numQuestions > 50) {
    return {'numQuestionsWrong': true};
  } else {
    return null;
  }
}
