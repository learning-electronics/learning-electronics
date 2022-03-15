import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SharedService, theme } from '../shared.service';
import { AddExerciseComponent } from './add-exercise/add-exercise.component';
import { EditExerciseComponent } from './edit-exercise/edit-exercise.component';

@Component({
  selector: 'app-my-exercises',
  templateUrl: './my-exercises.component.html',
  styleUrls: ['./my-exercises.component.scss']
})
export class MyExercisesComponent implements OnInit {
  all_themes: theme[] = [];
  all_units: string[] = [];

  constructor(public add_edit_ex_dialog: MatDialog, private _service: SharedService) {
    this._service.getThemes().subscribe((data: any) => {
      this.all_themes = data as theme[];
    });

    this._service.getUnits().subscribe((data: any) => {
      this.all_units = data;
    });
  }

  ngOnInit(): void {
  }

  /* Open Add or Edit Exercise Dialog */
  addEx() {
    const dialogRef = this.add_edit_ex_dialog.open(AddExerciseComponent, {
      width: '50%',
      height: '60%', 
      data: {
        'ModalTitle': "Adicionar Exercício",
        'themes': this.all_themes,
        'units': this.all_units
      }
    });
  }

  /* Open Add or Edit Exercise Dialog */
  editEx() {
    const dialogRef = this.add_edit_ex_dialog.open(EditExerciseComponent, {
      width: '50%',
      height: '60%', 
      data: {
        'ModalTitle': "Editar Exercício",
        'themes': this.all_themes,
        'units': this.all_units
      }
    });
  }
}
