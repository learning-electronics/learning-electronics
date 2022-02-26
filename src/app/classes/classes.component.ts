import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-classes',
  templateUrl: './classes.component.html',
  styleUrls: ['./classes.component.scss']
})
export class ClassesComponent implements OnInit {
  displayedColumns: string[] = ['name', 'teacher', 'number_students', 'actions'];
  dataSource!: MatTableDataSource<any>;
  search: string ="";

  constructor() { }

  ngOnInit(): void {
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
