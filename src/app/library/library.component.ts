import { Component, OnInit } from '@angular/core';
import { exercise, SharedService } from '../shared.service';

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.scss']
})
export class LibraryComponent implements OnInit {
  all_exercises: exercise[] = [];

  constructor(private _service: SharedService) {
    this._service.getExercises().subscribe((data: any) => {
      data.forEach((ex: exercise) => {
        this.all_exercises.push(ex);
      });
    });

    console.log(this.all_exercises);
  }

  ngOnInit(): void {
  }
}
