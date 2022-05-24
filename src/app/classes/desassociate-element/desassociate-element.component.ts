import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/shared.service';

@Component({
  selector: 'app-desassociate-element',
  templateUrl: './desassociate-element.component.html',
  styleUrls: ['./desassociate-element.component.scss']
})
export class DesassociateElementComponent implements OnInit {
  ModalTitle: string;
  patch_info: any;
  deleted_info: any;
  type: string;
  id: number;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private _service: SharedService, 
    private _snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<DesassociateElementComponent>,
    private _router: Router ) {
      this.ModalTitle = data.ModalTitle;
      this.type = data.type;
      this.patch_info = data.patch_info;
      this.deleted_info = data.deleted_info;
      this.id = data.classroom_id;
    }

  ngOnInit(): void {
  }

  /* Desassociate exercises or members from the class */
  confirm() {
    if (this.type == 'exercise') {
      this.desassociateExercises();
    } else if (this.type == 'member') {
      this.desassociateMembers();
    }
  }

  /* Desassociate selected member(s) from the classroom */
  desassociateMembers() {
    var info: any = { students: [] };
    this.patch_info.forEach((member: any) => { info.students.push(member.id) });
    
    this._service.updateClassroom(info, this.id).subscribe((data: any) => {
      if (data.v == true) {
        this._snackBar.open('Alunos desassociados com sucesso', 'Fechar', { duration: 2500 });
        
        /* Close the dialog */
        this.dialogRef.close();

        /* Reload the my_exercises component */
        let currentUrl = this._router.url;
        this._router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
            this._router.navigate([currentUrl]);
        });
      } else {
        this._snackBar.open('Erro ao desassociar alunos', 'Fechar', { duration: 2500 });
      }
    });
  }

  /* Desassociate selected exercise(s) from the classroom */
  desassociateExercises() {
    var info: any = { exercises: [] };
    this.patch_info.forEach((ex: any) => { info.exercises.push(ex.id) });

    this._service.updateClassroom(info, this.id).subscribe((data: any) => {
      if (data.v == true) {
        this._snackBar.open('Exercícios desassociados com sucesso', 'Fechar', { duration: 2500 });

        /* Close the dialog */
        this.dialogRef.close();

        /* Reload the my_exercises component */
        let currentUrl = this._router.url;
        this._router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
            this._router.navigate([currentUrl]);
        });
      } else {
        this._snackBar.open('Erro ao desassociar exercícios', 'Fechar', { duration: 2500 });
      }
    });
  }
}
