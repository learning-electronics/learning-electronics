import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';

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

  constructor(private _router: Router) {
    this.refreshTable();
  }

  ngOnInit(): void {
    this.value = Math.floor(Math.random() * 10) + 1;
    this.refreshTable();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  /* Sort data for the table */
  sortData(sort: Sort) {
  //   const data = this.all_exercises.slice();
  //   if (!sort.active || sort.direction === '') {
  //     this.sortedData = data;
  //     return;
  //   }

  //   this.sortedData = data.sort((a, b) => {  
  //     const isAsc = sort.direction === 'asc';
  //     switch (sort.active) {
  //       case 'question':
  //         return this.compare(a.question, b.question, isAsc);
  //       case 'theme':
  //         return this.compare(a.ans1, b.ans1, isAsc);
  //       case 'classes':
  //         return this.compare(a.ans1, b.ans1, isAsc);
  //       case 'date':
  //         return this.compareDate(a.date, b.date, isAsc);
  //       default:
  //         return 0;
  //     }
  //   });

  //   this.dataSource = new MatTableDataSource(this.sortedData);
  }

  /* Compare 2 elements of the table string or number */
  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  /* Update the table's information */
  refreshTable() {
    var results: any[] = [];
    
    results.push({
      id: 1,
      name: 'SE-101',
      teacher: 'Andre',
      number_students: 10,
    },
    {
      id: 2,
      name: 'SE-202',
      teacher: 'Joao',
      number_students: 20,
    }
    );

    this.dataSource = new MatTableDataSource(results);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.pageSize = localStorage.getItem('pageSizeClasses') ? parseInt(localStorage.getItem('pageSizeClasses')!) : 10;
  }

  redirectClass(classroom: any) {
    this._router.navigate(['class/'], { state: { id: classroom.id } });
  }
}
