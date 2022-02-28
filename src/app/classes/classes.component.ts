import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

@Component({
  selector: 'app-classes',
  templateUrl: './classes.component.html',
  styleUrls: ['./classes.component.scss']
})
export class ClassesComponent implements OnInit {
  displayedColumns: string[] = ['name', 'teacher', 'number_students', 'actions'];
  dataSource!: MatTableDataSource<any>;
  search: string = "";
  value: number = 0;

  constructor(private _router: Router) { }

  ngOnInit(): void {
    this.value = Math.floor(Math.random() * 10) + 1;
    this.refreshTable();
  }

  refreshTable() {
    var results: any[] = [];
    
    results.push({
      name: 'SE-101',
      teacher: 'Andre',
      number_students: 10,
    });

    this.dataSource = new MatTableDataSource(results);
  }
}
