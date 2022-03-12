import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddEditExerciseComponent } from './add-edit-exercise/add-edit-exercise.component';

@Component({
  selector: 'app-my-exercises',
  templateUrl: './my-exercises.component.html',
  styleUrls: ['./my-exercises.component.scss']
})
export class MyExercisesComponent implements OnInit {

  constructor(public add_edit_ex_dialog: MatDialog,) { }

  ngOnInit(): void {
  }

  /* Open Add or Edit Exercise Dialog */
  addEx() {
    const dialogRef = this.add_edit_ex_dialog.open(AddEditExerciseComponent, {
      width: '50%',
      height: '60%', 
      data: {
        'ModalTitle': "Adicionar Exercício",
      }
    });
  }

  /* Open Add or Edit Exercise Dialog */
  editEx() {
    const dialogRef = this.add_edit_ex_dialog.open(AddEditExerciseComponent, {
      width: '50%',
      height: '60%', 
      data: {
        'ModalTitle': "Editar Exercício",
      }
    });
  }
}
