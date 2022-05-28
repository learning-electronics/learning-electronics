import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { classroom, SharedService } from '../shared.service';
import { AddExamComponent } from './add-exam/add-exam.component';

@Component({
  selector: 'app-my-exams',
  templateUrl: './my-exams.component.html',
  styleUrls: ['./my-exams.component.scss']
})
export class MyExamsComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  
  displayedColumns: string[] = ['select', 'title', 'classes', 'password', 'date'];
  dataSource = new MatTableDataSource<any>();
  selection = new SelectionModel<any>(true, []);

  d:any = [
    {
      title: 1,
      classes: 1,
      password: 1,
      date: 1,
    },
    {
      title: 2,
      classes: 2,
      password: 2,
      date: 2,
    }
  ]

  pageSize: number = 10;
  all_classrooms: classroom[];
  
  constructor(public add_edit_ex_dialog: MatDialog, private _service: SharedService) {
    this._service.getMyClassrooms().subscribe((data: any) => {
      this.all_classrooms = data as classroom[];
    });
    this.dataSource = new MatTableDataSource(this.d);
  }

  ngOnInit(): void {
    this.dataSource.filterPredicate = (data: any, filter: string): boolean => {
      return (
        data.title.toLocaleLowerCase().includes(filter)
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

  sortData(sort: Sort) {}

  deleteExams() {

  }

  addExam() {
    const dialogRef = this.add_edit_ex_dialog.open(AddExamComponent, {
      width: '60%',
      height: '75%', 
      minWidth: '700px',
      data: {
        'ModalTitle': "Adicionar Teste",
        'classrooms': this.all_classrooms
      }
    });
  }

  editExam(exam_data: any) {}

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
