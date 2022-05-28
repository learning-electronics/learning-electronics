import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { PopupComponent } from 'src/app/popup/popup.component';
import { classroom, exercise, SharedService, theme } from 'src/app/shared.service';

@Component({
  selector: 'app-add-exam',
  templateUrl: './add-exam.component.html',
  styleUrls: ['./add-exam.component.scss']/* ,
  encapsulation: ViewEncapsulation.None */
})
export class AddExamComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  
  displayedColumns: string[] = ['select', 'question', 'theme', 'classes'];
  dataSource = new MatTableDataSource<any>();
  selection = new SelectionModel<any>(true, []);
  
  sortedData: exercise[] = [];
  all_themes: theme[] = [];
  all_exercises: any[] = [];
  all_classrooms: classroom[] = [];
  pageSize: number = 5;
  state: number = 1;
  points: any[] = [{name: 'Nada', value: 0}, {name: '25%', value: 0.25}, {name: '33%', value: 1/3}, {name: '50%', value: 0.5}];
  disable_state = true;
  disable_submit = true;
  hide: boolean = true;

  form!: FormGroup;

  constructor(private _formBuilder: FormBuilder, 
    private _service: SharedService,
    private _router: Router,
    private _snackBar: MatSnackBar,
    public popup_dialog: MatDialog,
    private dialogRef: MatDialogRef<AddExamComponent>)
  {
    this._service.getThemes().subscribe((data: any) => {
      this.all_themes = data as theme[];
      this.refreshTable();
    });

    this._service.getMyClassrooms().subscribe((data: any) => {
      this.all_classrooms = data as classroom[];
    });
  }

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      name: new FormControl("", [Validators.required]),
      questions: new FormControl("", [Validators.required]),
      password: new FormControl(null),
      deduct: new FormControl("", [Validators.required]),
      check: new FormControl(false),
      classrooms: new FormControl([]),
      timer: new FormControl(""),
      repeat: new FormControl(true),
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
    if (this.form.hasError('numQuestionsWrong'))
      this.numQuestions?.setErrors([{'numQuestionsWrong': true}]);
    else
      this.numQuestions?.setErrors(null);
  }

  /* Block Classrooms form field when "public" checkbox is chosen */
  blockClassrooms(val: boolean) {
    if (val) {
      this.form.controls['classrooms'].reset();
      this.form.controls['classrooms'].disable();
    } else {
      this.form.controls['classrooms'].enable();
    }
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
        classrooms: this.form.get('check')?.value == false ? this.form.get('classrooms')?.value : [],
        public: this.form.get('check')?.value,
        exercises: exercises_info
      }

      console.log(exam);

      this._service.addExam(exam).subscribe((data: any) => {
        if ("v" in data) {
          if (data.v == true) {
            /* Close the dialog */
            this.dialogRef.close();

            /* Reload the my_exercises component */
            let currentUrl = this._router.url;
            this._router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
                this._router.navigate([currentUrl]);
            });
            
            this._snackBar.open('Teste adicionado!', 'Fechar', { "duration": 2500 });
          } else {
            this._snackBar.open('Erro ao adicionar Teste!', 'Fechar', { "duration": 2500 });
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
