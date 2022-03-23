import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/shared.service';

@Component({
  selector: 'app-delete-confirmation',
  templateUrl: './delete-confirmation.component.html',
  styleUrls: ['./delete-confirmation.component.scss']
})
export class DeleteConfirmationComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any, 
    private _service: SharedService, 
    private _snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<DeleteConfirmationComponent>,
    private _router: Router
  ) { 
  }

  ngOnInit(): void {
  }

  /* Delete the exercises */
  confirm() {
    this.data.forEach((exercise: any) => {
      this._service.deleteExercise(exercise.id).subscribe((res: any) => {
        if (!res.v) {
          this._snackBar.open("Erro a eliminar exercícios", "Fechar", { duration: 2500 });
        }
      });
      /* Close the dialog */
      this.dialogRef.close();

      /* Reload the my_exercises component */
      let currentUrl = this._router.url;
      this._router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
          this._router.navigate([currentUrl]);
      });

      this._snackBar.open("Exercicícios Eliminados", "Fechar", { duration: 25000 });
    })
  }
}
